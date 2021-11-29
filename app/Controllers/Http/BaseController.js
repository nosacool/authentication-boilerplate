'use strict'

class BaseController {

    success = 'Success'
    error = 'Error'
    validation_error = 'Validation Error'

    async sendResponse(message,data,{response}){
        
        const result = {
            status: '00',
            message: message,
            data: data
        }
        return response.status(200).json(result)
    }

    async sendError(error,errorMessages = [],code = 401,{response}){
        const result = {
            status: code.toString(),
            message: error,
            data: errorMessages
        }
        return response.status(code).send(result)
    }

    
}

module.exports = BaseController
