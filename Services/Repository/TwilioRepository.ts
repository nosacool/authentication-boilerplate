import TwilioInterface from "../Interfaces/Twilio.Interface";
//import client = require('twilio')(accountSid, authToken);


const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const Redis = use('Redis')

export default class TwilioRepository implements TwilioInterface {
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

    async send(to,message){
       
        await client.messages
        .create({
            body: message,
            from: process.env.TWILIO_FROM,
            to: to
        }).then((result) => {
            console.log(result.sid)
            return true
        }).catch((err) => {
            console.log(err)
            return false
        }); 
        return true
    }
}