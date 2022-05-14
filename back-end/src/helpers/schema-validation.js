const Joi = require('joi')
module.exports.registerSchema = Joi.object({
    username : Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string().min(8).pattern(/[!@#$%&*_!]/).required(),
    repassword : Joi.ref('password')
})

module.exports.loginSchema = Joi.object({
    username : Joi.string().required(),
    password : Joi.string().min(8).pattern(/[!@#$%&*_!]/).required()
})

module.exports.patchUserSchema = Joi.object({
    username : Joi.required(),
    email : Joi.string().email().required(),
})
module.exports.forgetPasswordSchema = Joi.object({
    uid : Joi.required(),
    password : Joi.string().min(8).pattern(/[!@#$%&*_!]/).required(),
    repassword : Joi.ref('password')
})