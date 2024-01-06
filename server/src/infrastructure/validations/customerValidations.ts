import Joi from "joi";


export const createGroupBody = Joi.object({
  groupName: Joi.string().required()
})
export const createGroupParams = Joi.object({
  user: Joi.string().required()
})


export const addCustomerBody = Joi.object({
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required()
})
export const addCustomerParam = Joi.object({
  user: Joi.string().required()
})



export const deleteGroupParam = Joi.object({
  user: Joi.string().required(),
  group: Joi.string().required()
})

export const deleteCustomerParam = Joi.object({
  user: Joi.string().required(),
  customer: Joi.string().required()
})


export const updateCustomerParam = Joi.object({
  user: Joi.string().required(),
  customer: Joi.string().required()
})
export const updateCustomerBody = Joi.object({
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required()
})

export const updategroupParam = Joi.object({
  user: Joi.string().required(),
  group: Joi.string().required()
})
export const updategroupBody = Joi.object({
  groupName: Joi.string().required()
})



export const addToBlackListParam = Joi.object({
  user: Joi.string().required(),
  customer: Joi.string().required(),
})

export const addToGrayListParam = Joi.object({
  user: Joi.string().required(),
  customer: Joi.string().required(),
})

export const removeFromBlackListParam = Joi.object({
  user: Joi.string().required(),
  customer: Joi.string().required()
})

export const removeFromGrayListParam = Joi.object({
  user: Joi.string().required(),
  customer: Joi.string().required()
})


export const addToGroupParam = Joi.object({
  user: Joi.string().required(),
  group: Joi.string().required()
})
export const addToGroupBody = Joi.object({
  customers: Joi.array().items(Joi.string().required())
})

export const removeFromGroupParam = Joi.object({
  user: Joi.string().required(),
  group: Joi.string().required()
})
export const removeFromGroupBody = Joi.object({
  customerId: Joi.string().required()
})



export const getCustomersParam = Joi.object({
  user: Joi.string().required(),
})
export const getCustomersQuery = Joi.object({
  page: Joi.number().required(),
  perpage: Joi.number().required()
})


export const getBlackListParam = Joi.object({
  user: Joi.string().required(),
})
export const getBlackListQuery = Joi.object({
  page: Joi.number().required(),
  perpage: Joi.number().required()
})

export const getGrayListParam = Joi.object({
  user: Joi.string().required(),
})
export const getGrayListQuery = Joi.object({
  page: Joi.number().required(),
  perpage: Joi.number().required()
})

export const getGroupsParam = Joi.object({
  user: Joi.string().required(),
})
export const getGroupsQuery = Joi.object({
  page: Joi.number().required(),
  perpage: Joi.number().required()
})


export const getGroupCustomersParam = Joi.object({
  user: Joi.string().required(),
  group: Joi.string().required()
})
export const getGroupCustomersQuery = Joi.object({
  page: Joi.number().required(),
  perpage: Joi.number().required()
})

export const getCustomerById = Joi.object({
  user: Joi.string().required(),
  customer: Joi.string().required
})
export const getGroupById = Joi.object({
  user: Joi.string().required(),
  group: Joi.string().required
})

export const addMultipleCustomerBody = Joi.object({
  customers: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      lastName: Joi.string().required(),
      phone: Joi.string().required()
    })
  ).required()
})