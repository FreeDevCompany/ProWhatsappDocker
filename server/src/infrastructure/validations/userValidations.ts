import Joi from "joi";

export const  signUpBody = Joi.object({
    avatar: Joi.string().required(),
    firstName: Joi.string().required().min(3).max(30),
    lastName: Joi.string().required().min(3).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    phone: Joi.string().required().min(11).max(14),
    deviceId: Joi.string().required()
})

export const  loginBody = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

export const  resetPasswordBody = Joi.object({
    id: Joi.string().required(),
    currentPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

export const verifyEmailParams = Joi.object({
    userId: Joi.string().required(),
})

export const  forgotPasswordLinkBody = Joi.object({
    email: Joi.string().email().required()
})

export const  forgotPasswordConfirmBody = Joi.object({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

export const forgotPasswordLinkParam = Joi.object({
    userId: Joi.string().required(),
})


export const updateProfileParam = Joi.object({
    userId: Joi.string().required(),
})
export const  updateProfileBody = Joi.object({
    avatar: Joi.string().required().regex(/^data:image\/(jpeg|png|gif);base64,/),
    firstName: Joi.string().required().min(3).max(30),
    lastName: Joi.string().required().min(3).max(30),
})