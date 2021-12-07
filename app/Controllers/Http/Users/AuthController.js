'use strict'

const { default: SmsOtpRepository } = require("../../../../Services/Repository/SmsOtpRepository")
//const { default: TwilioRepository } = require("../../../../Services/Repository/TwilioRepository")
const { default: UserRepository } = require("../../../../Services/Repository/UserRepository")
const BaseController = require("../BaseController")
const { validateAll } = use('Validator')
const Redis = use('Redis')

class AuthController extends BaseController {

    userRepository
    otpRepository
    constructor(){
        super()
        this.userRepository = new UserRepository
        this.smsOtpRepository = new SmsOtpRepository
    }

    async register({request,response}){
        const rules = {
            fullname: 'required',
            email:    'required|email|unique:users,email',
            phone:    'required|starts_with:+|string',
            password: 'required',
            otp_token: 'required|string'
        }
      
        const validation = await validateAll(request.all(), rules)
      
        if (validation.fails()) {
            return await this.sendError(this.validation_error,validation.messages(),422,{response})
        }
        if(await Redis.get(request.input('phone')+':'+request.input('otp_token')) == 'verified'){
            const user = await this.userRepository.create(request.only(['fullname','email','password','phone']));
            if(user){
                console.log('done')
                return await this.sendResponse(this.success,user,{response})
            }
            else{
                return await this.sendError(this.error,[],401,{response})
            }
        }
        else{
            return this.sendError(this.error,[],401,{response})
        }

        
         
        //return response.status(200).json(result)
    }

    async login({ request, auth, response }) {
        
        const rules = {
            email:    'required|email',
            password: 'required' 
        }
      
        const validation = await validateAll(request.all(), rules)
        
        if (validation.fails()) {
            return await this.sendError(this.validation_error,validation.messages(),422,{response})
        }
        const { email, password } = request.all()
        try {
            const user = await auth.validate(email, password, true);
            const token = await auth.withRefreshToken().generate(user, true, { expiresIn: '10m' })

            return await this.sendResponse(this.success,token,{response})
        } catch (error) { 
            console.log(error.message)
            return await this.sendError(this.error,error.message,403,{response})
        }
    }

    async refreshToken({request,auth,response}){
        const rules = {
            'refresh_token': 'required|string'
        }
        const validation = await validateAll(request.all(),rules)
        if(validation.fails()){
            return this.sendError(this.validation_error,validation.messages(),401,{response})
        }
        //console.log(request.input('refresh_token')); 
        //return await auth.listTokens()  
        //const refreshToken = 
        let token = await auth.generateForRefreshToken(request.input('refresh_token'),true)
  
        return this.sendResponse(this.success,token,{response})
    }

    async logout({request,auth,response}){

        try {
            const user = await auth.getUser()
            //console.log('dd')
            //console.log(apiToken)
            //await auth.check();
            //auth.use('api').revoke()
            await auth.revokeTokens([request.input('refresh_token')],true)
            return this.sendResponse(this.success,null,{response})
        } catch (error) {
            return this.sendError(this.error,error.message,401,{response})
        } 
        
    }

    async sendOtp ({request,response}){
        const rules = {
            phone:    'required|starts_with:+|string',
        }
      
        const validation = await validateAll(request.all(), rules)
      
        if (validation.fails()) {
            return await this.sendError(this.validation_error,validation.messages(),422,{response})
        }
        
        const sendOtp = await this.smsOtpRepository.setAndSendOtp(request.input('phone'))
        if(sendOtp.status) {
            return this.sendResponse(this.success,{
                otp_token:sendOtp.otpToken
            },{response})
        }
        else{
            return this.sendError(this.error,{message: 'Unable to generate Otp'},401,{response})
        }
    }

    async  verifyOtp ({request,response}){
        const rules = {
            otp_token: 'required|string',
            otp: 'integer|required',
            phone: 'required'
        }

        const validation = await validateAll(request.all(),rules)

        if(validation.fails()){
            return await this.sendError(this.validation_error,validation.messages(),422,{response})
        }

        const otpToken = request.input('otp_token')
        const phone = request.input('phone')
        const otp = request.input('otp')

        const verifyOtps = await this.smsOtpRepository.verifyOtp(otpToken,otp,phone)
        if(verifyOtps.status == true){
            return this.sendResponse(this.success,null,{response})
        }
        else{
            return this.sendError(this.error,verifyOtp.message,401,{response})
        }






    }

    async sendEmailOtp({request,response}){
        const rules = {
            email: 'required|email'
        }

        const validation = await validateAll(request.all(),rules)

        if(validation.fails()){
            return await this.sendError(this.validation_error,validation.messages(),422,{response})
        }

        const user = await this.userRepository.findOneBy('email',request.input('email'))
        if(user){
            const otp = Math.floor(100000 + Math.random() * 900000)
            const userJson = user.toJSON()
            const key = user.email+':otp'
            Redis.set(key, otp)
            Redis.expire(key,600)

            const otpInfo = {
                otp:otp
            }

            return await Mail.send('emails.resetPassword', {userJson,otpInfo}, (message) => {
                message
                  .to(user.email)
                  .from(Env.get('MAIL_FROM'))
                  .subject('Reset Password')

              }).then((result) => {
                console.log(result)
                return true
            }).catch((err)=>{
                  console.log(err)
                  return false
            })

        }
        else{
            console.log('none found')
        }
    }
}

module.exports = AuthController
