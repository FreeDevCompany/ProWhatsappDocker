import Joi from "joi"

const baseHeader = Joi.object({
    'content-length': Joi.string(),
    'connection': Joi.string(),
    'accept-encoding': Joi.string(),
    'host': Joi.string().required(),
    'postman-token': Joi.string(),
    'accept': Joi.string(),
    'user-agent': Joi.string(),
    'content-type': Joi.string(),
    'x-api-gateway': Joi.string().required(),
}).unknown(true)
const baseHeaderWithDeviceId = Joi.object({
    'content-length': Joi.string(),
    'connection': Joi.string(),
    'accept-encoding': Joi.string(),
    'host': Joi.string().required(),
    'postman-token': Joi.string(),
    'accept': Joi.string(),
    'user-agent': Joi.string(),
    'content-type': Joi.string(),
    'x-api-gateway': Joi.string().required(),
    'x-device-id': Joi.string().required()
}).unknown(true)

const baseHeaderWithToken = Joi.object({
    'content-length': Joi.string(),
    'connection': Joi.string(),
    'accept-encoding': Joi.string(),
    'host': Joi.string().required(),
    'postman-token': Joi.string(),
    'accept': Joi.string(),
    'user-agent': Joi.string(),
    'content-type': Joi.string(),
    'x-api-gateway': Joi.string().required(),
    'x-token': Joi.string().required()
}).unknown(true)

export {baseHeader, baseHeaderWithToken, baseHeaderWithDeviceId};
