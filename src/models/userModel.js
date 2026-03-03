import { prisma } from '../config/prismaClient.js'


export class UserModel {

    static async findById ( user_id ) {
        const user =  await prisma.user.findUnique({
            where: { id: user_id }
        })

        return user
    }
    static async findByEmail( email ) {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        return user
    }


    static async create( data ) {
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.hashedPassword
            }
        })

        return user
    }

    static async findByIdAndUpdate( userId, data ) {
        const updateUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
                password: data.password
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })
        return updateUser
    }

    static async partialUpdate( userId, data) {
        const partialUpdateUser =  await prisma.user.update({
            where: { id: userId },
            data: {
                
            }
        })
    }
}