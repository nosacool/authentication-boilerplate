import MessagingInterface from "../Interfaces/Messaging.Interface";

const credentials = {
    apiKey: 'c13ab20f6d412a1e78e82bb9b0a8cf9d347a0677a0c7a4f7107dcd72246f5df8',
    username: 'docApp',
}

const AfricasTalking = require('africastalking')(credentials)


export default class AfricaTalkingRepository implements MessagingInterface{

    send(to: string, message: string) {
        const sms = AfricasTalking.SMS;
        const options = {
            // Set the numbers you want to send to in international format
            to: [to],
            // Set your message
            message: message,
            // Set your shortCode or senderId
            //from: 'DocApp'
        }
    
        // That’s it, hit send and we’ll take care of the rest
        return sms.send(options)
        .then((result) => {
            console.log(result.SMSMessageData.Recipients)
            return true
        }).catch((err) => {
            console.log(err)
            return false
        }); 
    }


}