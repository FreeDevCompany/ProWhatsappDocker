import Joi from "joi";


export const updateProfileBody = Joi.object({
  avatar: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required
})

export const updateProfileParam = Joi.object({
  user: Joi.string().required(),
})
