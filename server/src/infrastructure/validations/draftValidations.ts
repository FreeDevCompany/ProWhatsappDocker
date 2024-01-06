import Joi from "joi";

export const createDraftValidationParam =  Joi.object({
    user: Joi.string().required(),

})
export const createDraftValidationBody =  Joi.object({
    text: Joi.string().required(),
    title: Joi.string().required()
})

export const deleteDraftValidationParam =  Joi.object({
    user: Joi.string().required(),
    draft: Joi.string().required()
})

export const updateDraftValidationParam =  Joi.object({
    user: Joi.string().required(),
    draft: Joi.string().required()
})
export const updateDraftValidationBody =  Joi.object({
    text: Joi.string().required(),
    title: Joi.string().required()
})

export const getByIdDraftValidationParam =  Joi.object({
    user: Joi.string().required(),
    draft: Joi.string().required()
})

export const getAllDraftValidationParam =  Joi.object({
    user: Joi.string().required(),
})
export const getAllDraftValidationQuery =  Joi.object({
    page: Joi.number().required(),
    perPage: Joi.number().required()
})
export const downloadDraftValidationParam =  Joi.object({
    user: Joi.string().required(),
    draft: Joi.string().required()
})