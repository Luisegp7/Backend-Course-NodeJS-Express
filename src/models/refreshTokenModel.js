import { prisma } from '../config/prismaClient.js'

export class RefreshTokenModel {

    static async findByToken(token) {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token }
        })

        return storedToken
    }

    static async create(data) {
        await prisma.refreshToken.create({
            data: {
                token: data.refreshToken,
                userId: data.userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        })
    }

    static async deleteByToken(token) {
        await prisma.refreshToken.delete({
            where: { token }
        })
    }

    static async deleteMany(userId) {
        await prisma.refreshToken.deleteMany({
            where: { userId }
        })
    }
}