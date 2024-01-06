import Joi from "joi";

export const signUpBody = Joi.object({
  avatar: Joi.string().required(),
  firstName: Joi.string().required().min(3).max(30),
  lastName: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  phone: Joi.string().required().min(11).max(14),
})

export const loginBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

export const resetPasswordBody = Joi.object({
  id: Joi.string().required(),
  currentPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

export const verifyEmailQuery = Joi.object({
  hash: Joi.string().required()
})
export const forgotPasswordLinkBody = Joi.object({
  email: Joi.string().email().required()
})
export const resetSessionBod = Joi.object({
  user: Joi.string().required(),
})

export const forgotPasswordConfirmBody = Joi.object({
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

export const forgotPasswordLinkParam = Joi.object({
  userId: Joi.string().required(),
})

export const forgotPasswordParam = Joi.object({
  token: Joi.string().required(),
})

export const updateProfileParam = Joi.object({
  user: Joi.string().required(),
})
export const updateProfileBody = Joi.object({
  avatar: Joi.string().required().regex(/^data:image\/(jpeg|png|jpg);base64,/),
  firstName: Joi.string().required().min(3).max(30),
  lastName: Joi.string().required().min(3).max(30),
})

export const getAutomationSettingsParam = Joi.object({
  user: Joi.string().required()
})

export const updateAutomationSettings = Joi.object({
  beginTime: Joi.date().required(),
  min_message_delay: Joi.number().required(),
  max_message_delay: Joi.number().required()
})

export const activeSessionsParam = Joi.object({
  user: Joi.string().required()
})
export const activeSessionsQuery = Joi.object({
  page: Joi.number().required(),
  perpage: Joi.number().required()
})

export const freezeAccountParam = Joi.object({
  user: Joi.string().required()
})
export const freezeAccountBody = Joi.object(
  {
    password: Joi.string().required()
  })
export const deleteAccountBody = Joi.object(
  {
    password: Joi.string().required()
  })

export const reactivteAccountParam = Joi.object({
  user: Joi.string().required()
})
export const reactivateAccountConfirmParam = Joi.object({
  user: Joi.string().required(),
  code: Joi.string().required(),
})
export const deleteAccountParam = Joi.object({
  user: Joi.string().required()
})

export const deleteSessionParam = Joi.object({
  user: Joi.string().required(),
})
export const deleteSessionBody = Joi.object({
  password: Joi.string().required(),
  session: Joi.string().required()
})
