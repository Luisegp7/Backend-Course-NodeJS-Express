import request from 'supertest'
import jwt from 'jsonwebtoken'
import { createApp } from '../../src/app.js'
import { connectDB, disconnectDB, prisma } from '../../src/config/prismaClient.js'

const app = createApp()

const randomIp = () => `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

const createUserPayload = () => {
  const seed = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`

  return {
    name: `user-${seed}`,
    email: `user-${seed}@example.com`,
    password: 'Password123!'
  }
}

const registerUser = async (payload = createUserPayload()) => {
  return request(app)
    .post('/auth/register')
    .set('X-Forwarded-For', randomIp())
    .send(payload)
}

const loginUser = async ({ email, password }) => {
  return request(app)
    .post('/auth/login')
    .set('X-Forwarded-For', randomIp())
    .send({ email, password })
}

const cleanDatabase = async () => {
  await prisma.watchlistItem.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.movie.deleteMany()
  await prisma.user.deleteMany()
}

describe('API integration - critical endpoints', () => {
  beforeAll(async () => {
    await connectDB()
  })

  beforeEach(async () => {
    await cleanDatabase()
  })

  afterAll(async () => {
    await cleanDatabase()
    await disconnectDB()
  })

  test('POST /auth/register creates a user and returns accessToken', async () => {
    const payload = createUserPayload()

    const response = await registerUser(payload)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('accessToken')
    expect(response.body.data.user).toMatchObject({
      email: payload.email,
      name: payload.name.toLowerCase()
    })
  })

  test('POST /auth/login + POST /auth/refresh rotates refresh token', async () => {
    const payload = createUserPayload()

    await registerUser(payload)

    const loginResponse = await loginUser(payload)

    expect(loginResponse.status).toBe(200)
    expect(loginResponse.headers['set-cookie']).toBeDefined()

    const cookie = loginResponse.headers['set-cookie'][0]

    const refreshResponse = await request(app)
      .post('/auth/refresh')
      .set('Cookie', cookie)

    expect(refreshResponse.status).toBe(200)
    expect(refreshResponse.body).toHaveProperty('accessToken')
    expect(refreshResponse.headers['set-cookie']).toBeDefined()
  })

  test('POST /auth/refresh rejects refresh token reuse', async () => {
    const payload = createUserPayload()
    await registerUser(payload)

    const loginResponse = await loginUser(payload)
    const oldCookie = loginResponse.headers['set-cookie'][0]

    const firstRefresh = await request(app)
      .post('/auth/refresh')
      .set('Cookie', oldCookie)

    expect(firstRefresh.status).toBe(200)

    const replayRefresh = await request(app)
      .post('/auth/refresh')
      .set('Cookie', oldCookie)

    expect(replayRefresh.status).toBe(401)
    expect(replayRefresh.body.message).toBe('Invalid refresh token')
  })

  test('protected route returns 401 for expired access token', async () => {
    const payload = createUserPayload()
    const registerResponse = await registerUser(payload)
    const userId = registerResponse.body.data.user.id

    const expiredToken = jwt.sign(
      { sub: userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '-1s' }
    )

    const response = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${expiredToken}`)

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Expired token')
  })

  test('protected route returns 401 for invalid token signature', async () => {
    const fakeSignedToken = jwt.sign(
      { sub: 'fake-user-id' },
      'wrong-secret',
      { expiresIn: '15m' }
    )

    const response = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${fakeSignedToken}`)

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Invalid token')
  })

  test('POST /watchlist requires access token', async () => {
    const response = await request(app)
      .post('/watchlist')
      .send({ movieId: '00000000-0000-0000-0000-000000000000' })

    expect(response.status).toBe(401)
  })

  test('POST /watchlist adds movie and rejects duplicates', async () => {
    const payload = createUserPayload()

    const registerResponse = await registerUser(payload)

    const accessToken = registerResponse.body.accessToken

    const movieResponse = await request(app)
      .post('/movies/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Interstellar',
        releaseYear: 2014,
        genres: ['sci-fi'],
        runtime: 169
      })

    expect(movieResponse.status).toBe(201)

    const addResponse = await request(app)
      .post('/watchlist')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        movieId: movieResponse.body.data.id,
        status: 'PLANNED',
        rating: 8,
        notes: 'must watch'
      })

    expect(addResponse.status).toBe(201)

    const duplicateResponse = await request(app)
      .post('/watchlist')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        movieId: movieResponse.body.data.id,
        status: 'PLANNED'
      })

    expect(duplicateResponse.status).toBe(409)
  })

  test('GET /movies supports full filter matrix', async () => {
    const payload = createUserPayload()
    await registerUser(payload)
    const loginResponse = await loginUser(payload)
    const accessToken = loginResponse.body.accessToken

    await request(app)
      .post('/movies/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Arrival', releaseYear: 2016, genres: ['sci-fi'], runtime: 116 })

    await request(app)
      .post('/movies/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Whiplash', releaseYear: 2014, genres: ['drama'], runtime: 106 })

    const byTitle = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ title: 'Arrival' })
    expect(byTitle.status).toBe(200)
    expect(byTitle.body.data.length).toBe(1)

    const byReleaseYear = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ releaseYear: 2014 })
    expect(byReleaseYear.status).toBe(200)
    expect(byReleaseYear.body.data.length).toBe(1)

    const byGenres = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ genres: 'sci-fi' })
    expect(byGenres.status).toBe(200)
    expect(byGenres.body.data.length).toBe(1)

    const byRuntime = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ runtime: 110 })
    expect(byRuntime.status).toBe(200)

    const paginated = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ pageSize: 1, page: 1, sort: 'asc' })
    expect(paginated.status).toBe(200)
    expect(paginated.body.totalItems).toBe(2)
    expect(paginated.body.data.length).toBe(1)
  })

  test('GET /movies returns 400 for validation errors in filters', async () => {
    const payload = createUserPayload()
    await registerUser(payload)
    const loginResponse = await loginUser(payload)
    const accessToken = loginResponse.body.accessToken

    const badGenre = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ genres: 'invalid-genre' })
    expect(badGenre.status).toBe(400)

    const badPage = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: 0 })
    expect(badPage.status).toBe(400)

    const badPageSize = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ pageSize: 0 })
    expect(badPageSize.status).toBe(400)

    const badReleaseYear = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ releaseYear: 1800 })
    expect(badReleaseYear.status).toBe(400)

    const badRuntime = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ runtime: -1 })
    expect(badRuntime.status).toBe(400)
  })

  test('PUT /user/profile/update requires currentPassword for email/password change', async () => {
    const payload = createUserPayload()
    await registerUser(payload)
    const loginResponse = await loginUser(payload)
    const accessToken = loginResponse.body.accessToken

    const response = await request(app)
      .put('/user/profile/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ email: `new-${payload.email}` })

    expect(response.status).toBe(400)
  })

  test('PUT /user/profile/update returns 409 on duplicated email', async () => {
    const userA = createUserPayload()
    const userB = createUserPayload()

    await registerUser(userA)
    await registerUser(userB)

    const loginResponse = await loginUser(userA)
    const accessToken = loginResponse.body.accessToken

    const response = await request(app)
      .put('/user/profile/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: userB.email,
        currentPassword: userA.password
      })

    expect(response.status).toBe(409)
    expect(response.body.error).toBe('User with this email already exists')
  })

  test('PUT /user/profile/update rejects wrong currentPassword', async () => {
    const payload = createUserPayload()
    await registerUser(payload)
    const loginResponse = await loginUser(payload)
    const accessToken = loginResponse.body.accessToken

    const response = await request(app)
      .put('/user/profile/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: `updated-${payload.email}`,
        currentPassword: 'WrongPassword123!'
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Invalid current password')
  })
})
