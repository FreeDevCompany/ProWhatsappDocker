import Joi from "joi"

const baseHeader = Joi.object({
    'content-length': Joi.string(),
    'connection': Joi.string().required(),
    'accept-encoding': Joi.string().required(),
    'host': Joi.string().required(),
    'postman-token': Joi.string(),
    'accept': Joi.string().required(),
    'user-agent': Joi.string().required(),
    'content-type': Joi.string().required(),
    'x-api-gateway': Joi.string().required(),
})
const baseHeaderWithDeviceId = Joi.object({
    'content-length': Joi.string(),
    'connection': Joi.string().required(),
    'accept-encoding': Joi.string().required(),
    'host': Joi.string().required(),
    'postman-token': Joi.string(),
    'accept': Joi.string().required(),
    'user-agent': Joi.string().required(),
    'content-type': Joi.string().required(),
    'x-api-gateway': Joi.string().required(),
    'x-device-id': Joi.string().required()
})

const baseHeaderWithToken = Joi.object({
    'content-length': Joi.string(),
    'connection': Joi.string().required(),
    'accept-encoding': Joi.string().required(),
    'host': Joi.string().required(),
    'postman-token': Joi.string(),
    'accept': Joi.string().required(),
    'user-agent': Joi.string().required(),
    'content-type': Joi.string().required(),
    'x-api-gateway': Joi.string().required(),
    'x-device-id': Joi.string().required(),
    'x-token': Joi.string().required()
})

export {baseHeader, baseHeaderWithToken, baseHeaderWithDeviceId};
