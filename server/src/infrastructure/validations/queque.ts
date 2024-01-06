import Joi from "joi";


export const updateQuequeBody = Joi.object({
    title: Joi.string().required(),
    message: Joi.string().required(),
})

export const updateQuequeParam = Joi.object({
    user: Joi.string().required(),
    queque: Joi.string().required(),
})

export const createQuequeBody = Joi.object({
    title: Joi.string().required(),
    sessionId: Joi.string().required(),
    message: Joi.string().required(),
    customers: Joi.array<string>(),
    groupId: Joi.string(),
    files: Joi.array().items(
        Joi.binary().required()
    )
})

export const createQuequeParam = Joi.object({
    user: Joi.string().required(),
})

export const deleteQuequeParam = Joi.object({
    user: Joi.string().required(),
    queque: Joi.string().required()
})

export const getAllQuequeParam = Joi.object({
    user: Joi.string().required(),
})
export const getAllQuequeQuery = Joi.object({
    page: Joi.number().required(),
    perpage: Joi.number().required(),
    state: Joi.string().required()

})
export const getByIdQuequeParam = Joi.object({
    user: Joi.string().required(),
    queque: Joi.string().required()
})

export const deleteFileBody = Joi.object({
  file: Joi.string().required()
})
export const deleteFileParam = Joi.object({
  user: Joi.string().required(),
  queque: Joi.string().required()
})


export const pauseQueueParam = Joi.object({
    user: Joi.string().required(),
    queue: Joi.string().required()
})
export const startQueueAgainParam = Joi.object({
    user: Joi.string().required(),
    queue: Joi.string().required()
})
export const startQueueAgainBody = Joi.object({
    startDate: Joi.date().required()
})
export const getItemsQuequeQuery = Joi.object({
    page: Joi.number().required(),
    perpage: Joi.number().required(),
})
export const getItemsQuequeParam = Joi.object({
    user: Joi.string().required(),
    queue: Joi.string().required()
})
export const addCustomersBody = Joi.object({
    customers: Joi.array<string>()
})
export const addCustomersParam = Joi.object({
    user: Joi.string().required(),
    queue: Joi.string().required()
})
export const removeCustomersBody = Joi.object({
    customer: Joi.string().required()
})
export const removeCustomersParam = Joi.object({
    user: Joi.string().required(),
    queue: Joi.string().required()
})