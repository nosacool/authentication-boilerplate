import SmsOtpInterface from "../Interfaces/SmsOtp.Interface";
import AfricaTalkingRepository from "./AfricaTalkingRepository";
import TwilioRepository from "./TwilioRepository";

const Redis = use('Redis')

export default class SmsOtpRepository implements SmsOtpInterface{

    messagingService
    constructor(){
        
        this.messagingService = new AfricaTalkingRepository
    }

    async setAndSendOtp(phone):Promise<Object> {
        const otpToken = Math.random().toString(20).substr(2, 6)
        const otp = Math.floor(100000 + Math.random() * 900000)
        const redisKey = phone+':'+otpToken
        console.log(redisKey)
        Redis.set(redisKey,otp)
        Redis.expire(redisKey,400)

        if(this.messagingService.send(phone,'Your Otp is '+otp)){
            return {
                status:true,
                otpToken:otpToken
            }
        }
        else{
            return {
                status:false
            }
        }
    }


    async verifyOtp(otpToken: string, otp: Number, phoneNumber: Number) {

        const otpReal = await Redis.get(phoneNumber+':'+otpToken)
        if(otpReal){
            console.log(otp)
            console.log(otpReal)
            if(otpReal == otp){
                Redis.set(phoneNumber+':'+otpToken,'verified')
                Redis.expire(phoneNumber+':'+otpToken,600)
                return {
                    status:true
                }
            }
            else{
                return {
                    status: false,
                    message:'Incorrect Otp'
                }
            }
        }
        else{
            return {
                status:false,
                message: 'Expired Otp'
            }
        }
    }
}