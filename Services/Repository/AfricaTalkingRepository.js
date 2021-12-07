"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var credentials = {
    apiKey: 'c13ab20f6d412a1e78e82bb9b0a8cf9d347a0677a0c7a4f7107dcd72246f5df8',
    username: 'docApp',
};
var AfricasTalking = require('africastalking')(credentials);
var AfricaTalkingRepository = /** @class */ (function () {
    function AfricaTalkingRepository() {
    }
    AfricaTalkingRepository.prototype.send = function (to, message) {
        var sms = AfricasTalking.SMS;
        var options = {
            // Set the numbers you want to send to in international format
            to: [to],
            // Set your message
            message: message,
            // Set your shortCode or senderId
            //from: 'DocApp'
        };
        // That’s it, hit send and we’ll take care of the rest
        return sms.send(options)
            .then(function (result) {
            console.log(result.SMSMessageData.Recipients);
            return true;
        }).catch(function (err) {
            console.log(err);
            return false;
        });
    };
    return AfricaTalkingRepository;
}());
exports.default = AfricaTalkingRepository;
//# sourceMappingURL=AfricaTalkingRepository.js.map