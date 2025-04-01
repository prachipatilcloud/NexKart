import sendEmail from '../config/sendEmail.js';
import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';

export async function registerUserController(request,response){
    try {
        const {name, email, password} = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide email, name, password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email })

        if (user) {
            return response.json({
                message: "Email already exists",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`

        const verify_Email = await sendEmail({
            sendTo: email,
            subject: "Verify your email from NexKart",
            html: verifyEmailTemplate({
                name,
                url: VerifyEmailUrl
            })
        })

        return response.json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: save
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body

        const user = await UserModel.findOne({ _id : code })

        if (!user) {
            return response.status(400).json({
                message: "Invalid code",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({ _id : code },{
            verify_email: true
        })

        return response.json({
            message: "Email verified successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

//login controller

export async function loginController(request, response) {
    try {
        const { email, password } = request.body

        if (!email || !password) {
            return response.status(400).json({
                message: "Email and password are required",
                error: true,
                success: false
            })
        }
        
        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "Invalid User",
                error: true,
                success: false
            })
        }

        if (user.status !== "Active") {
            return response.status(400).json({
                message: "Contact to Admin",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password)

        if (!checkPassword) {
            return response.status(400).json({
                message: "Invalid Password",
                error: true,
                success: false
            })
        }

        const accesstoken = await generateAccessToken(user._id)
        const refreshtoken = await generateRefreshToken(user._id)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accessToken', accesstoken, cookiesOption)
        response.cookie('refreshToken', refreshtoken, cookiesOption)

        return response.json({
            message: "Login Success",
            error: false,
            success: true,
            data: {
                accesstoken,
                refreshtoken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}


//logout controller

export async function logoutController(request, response) {
    try {

        const userid = request.userId //middleware
        
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.clearCookie("accessToken", cookiesOption)
        response.clearCookie("refreshToken", cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token: ''
        })

        return response.json({
            message: "Logout Success",
            error: false,
            success: true,
        })

        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
        
    }
}

//upload user avatar

export async function uploadAvatar(request,response){
    try {
        const userId = request.userId // auth middleware
        const image = request.file //multer middleware

        const upload = await uploadImageCloudinary(image)

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
            })

        return response.json({
            message: "Avatar uploaded successfully",
            data: {
                _id: userId,
                avatar: upload.url
            }
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

//update user details

export async function updateUserDetails(request,response){
    try {
        
    } catch (error) {
        
    }
}



