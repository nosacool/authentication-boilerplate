'use strict'

const {validateAll} = use('Validator')
const { default: UserRepository } = require('../../../../Services/Repository/UserRepository')
const BaseController = require('../BaseController')
const Mail = use('Mail')
const Env = use('Env')
const Redis = use('Redis')


class ResetPasswordController extends BaseController {

    userRepository

    constructor(){
        super()
        this.userRepository = new UserRepository
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
            console.log(user)
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

    async verifyEmailOtp({request,response}){
        const rules = {
            otp: 'required|range:100000,999999',
            email: 'email|required|string'
        }
        const validation = await validateAll(request.all(),rules)
        if(validation.fails()){
            return await this.sendError(this.validation_error,validation.messages(),422,{response})
        }
        const key = request.input('email')+':otp'
        const retrievedOtp = await Redis.get(key)
        if(retrievedOtp){
            if(retrievedOtp == request.input('otp')){
                Redis.set(key,'Verified')
                Redis.expire(key,600)
                return this.sendResponse(this.success,null,{response})
            }
            else{
                return this.sendError('Otp Incorrect',null,401,{response})
            }
        }
        else{
            return this.sendError('Otp Expired',null,404,{response})
        }
    }

    async resetPassword({request,response}){
        const rules = {
            email : 'email|required',
            password: 'required|string'
        }
        const validation = await validateAll(request.all(),rules)
        if(validation.fails()){
            this.sendError(this.validation_error,validation.messages(),422,{response});
        }

        const key = request.input('email')+':otp'
        const value = await Redis.get(key)
        console.log(value)
        if(value == 'Verified'){
            const user = await this.userRepository.findOneBy('email',request.input('email'))
            if(user){
                user.password = request.input('password')
                console.log(user.toJSON())
                await user.save()
                return true
            }
            else{
                return 'unknown user'
            }
        }
        else{
            return 'otp expired'
        }
        

    }
}

module.exports = ResetPasswordController
