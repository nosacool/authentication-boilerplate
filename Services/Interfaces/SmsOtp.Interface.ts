export default interface SmsOtpInterface {
    setAndSendOtp(phone):Promise<object>
    verifyOtp(otpToken:string,otp:Number,phoneNumber:Number)

}