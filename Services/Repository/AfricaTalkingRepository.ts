
import MessagingInterface from "../Interfaces/Messaging.Interface";
const credentials = {
    apiKey: process.env.AFRICATALKING_APIKEY,
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