import Joi from 'joi'

export const userValidation = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string()
    .regex(/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/)
    .required(),
  password: Joi.string().min(6).required()
})
