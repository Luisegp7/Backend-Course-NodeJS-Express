import { asyncHandler } from '../utils/asyncHandler.js'
import { UserModel } from "../models/userModel.js";
import bcrypt from 'bcryptjs';

export class UserController {
    static async getAll(){}

    static getProfile = asyncHandler(async (req, res) => {
        const user = await UserModel.findById(req.userId)

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
    })

    static update = asyncHandler(async (req, res) => {
        const user = await UserModel.findById(req.userId)

        if(!user) {
            return res.status(404).json({ message: 'User Not Found'})
        }

        const updatedData = req.body
        const password = updatedData.password

        const salt = await bcrypt.genSalt(10)
        updatedData.password = await bcrypt.hash(password, salt)

        const updateUser = await UserModel.findByIdAndUpdate( req.userId, updatedData )
        
        return res.status(200).json({
            status: 'success',
            data: updateUser
        })
    })
}