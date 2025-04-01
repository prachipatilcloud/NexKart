

const forgotPasswordTemplate =({ name, otp })=> {
    return `
<div>
    <p>Dear ${name},</p>
    <p>You've requested a password reset for your account. Please use the OTP below to reset your password.</p>
    <div style="background: yellow ; font-size:20px; padding: 20px; border-radius: 10px; text-align: center; 
    font-weight: 800;">
        ${otp}
    </div>
    <p>This OTP is valid for 1 hour only. Enter this OTP in the NexKart website
    to proceed with resetting your password. </p>
    <br/>
    </br>
    <p>Thanks</p>
    <p>NexKart</p>

</div>
    `
}

export default forgotPasswordTemplate;