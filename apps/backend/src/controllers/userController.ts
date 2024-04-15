import { RequestHandler } from 'express'
import { userValidation } from '../validator'
import { v4 } from 'uuid'
import db from '@repo/db/clients'

export const signupController: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body
  const { error } = userValidation.validate({ name, email, password })
  if (error) {
    return res.status(400).json(error)
  }

  const user = await db.user.create({
    data: {
      id: v4(),
      name,
      email,
      password,
      created_at: new Date()
    }
  })
  return res.status(201).json(user)
}
