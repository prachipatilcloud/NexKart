export const baseURL = "http://localhost:8080";

const SummaryApi = {
    register: {
        url : '/api/user/register',
        method : 'post',
    },
    login : {
        url : '/api/user/login',
        method : 'post',
    },
    forgot_Password : {
        url : '/api/user/forgot-password',
        method : 'put',
    },
    verify_forgot_password_otp : {
        url : '/api/user/verify-forgot-password-otp',
        method : 'put',
    },
    resetPassword :{
        url : '/api/user/reset-password',
        method : 'put',
    }
}

export default SummaryApi;