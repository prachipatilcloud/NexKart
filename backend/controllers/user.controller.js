import sendEmail from '../config/sendEmail.js';
import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import generateOtp from '../utils/generateOtp.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import jwt from 'jsonwebtoken';

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
        const userId = request.userId // auth middleware
        const { name, email, mobile, password } = request.body

        let hashPassword = ""

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({_id : userId}, {
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && { mobile : mobile }),
            ...(password && { password : hashPassword })
        })

        return response.json({
            message: "User details updated successfully",
            error: false,
            success: true,
            data: updateUser
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

//forgot password not login

export async function forgotPasswordController(request,response){
    try {
        const { email } = request.body

        const user = await UserModel.findOne({ email })
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        const otp = generateOtp()

        const expireTime = new Date(Date.now() + 60 * 60 * 1000)

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp: otp,
            forgot_password_expiry: expireTime
        })

        await sendEmail({
            sendTo: email,
            subject: "Forgot Password",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return response.json({
            message: "Otp sent to your email",
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

//verify forgot password otp

export async function verifyForgotPasswordOtpController(request,response){
    try {
        
        const { email, otp } = request.body

        if (!email || !otp ) {
            return response.status(400).json({
                message: "Email and OTP are required",
                error: true,
                success: false
                })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }
        
        const currentTime = new Date()
        if (user.forgot_password_expiry < currentTime) {
            return response.status(400).json({
                message: "OTP has expired",
                error: true,
                success: false
            })
        }

        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            })
        }

        // if otp is not expired
        //otp === user.forgot_password_otp

        return response.status(200).json({
            message: "OTP verified successfully",
            error: false,
            success: true
            })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// reset the password

export async function resetPassword(request, response) {
    try {
        
        const { email, newPassword, confirmPassword } = request.body

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Please fill all the fields",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "newPassword and confirmPassword do not match",
                error: true,
                success: false
            })
        }


        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)

        const  update = await UserModel.findByIdAndUpdate(user._id,{
            password: hashPassword
        })

        return response.status(200).json({
            message: "Password updated successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// refresh token controller

export async function refreshTokenController(request, response) {
    try {
        
        const refreshToken = request.cookies?.refreshToken || request.headers?.authorization?.split(" ")[1]
        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid Token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if (!verifyToken) {
            return response.status(401).json({
                message: "Token is expired",
                error: true,
                success: false
            })
        }        

        const userId = verifyToken?._id
        
        const newAccessToken = await generateAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accessToken', newAccessToken,cookiesOption)
        
        return response.status(200).json({
            message: "New Access Token Generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


