export default interface TwilioInterface{

    send(to:string,message:string)
    verifyOtp(otpToken:string,otp:Number,phoneNumber:Number)
} 