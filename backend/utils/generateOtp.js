

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); ///1000000 to 9999999
}

export default generateOtp;