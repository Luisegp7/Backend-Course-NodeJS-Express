import { prisma } from "../config/prismaClient.js";

export class UserController {
    static async getAll(){}

    static async getProfile(req, res) {
        const user = await prisma.user.findUnique({
            where: {id: req.userId }
        })

        if(!user){
            return res.status(404).json({ message: 'User Not Found'})
        }

        return res.status(200).json({
            status: 'success',
            data: {
                name: user.name,
                email: user.email
            }
        })
    }
}