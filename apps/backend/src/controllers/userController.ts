import { RequestHandler } from 'express'
import { userValidation } from '../validator'
import { v4 } from 'uuid'
import db from '@repo/db/clients'

export const signupController: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const { error } = userValidation.validate({ name, email, password })
    if (error) {
      return res.status(400).json(error)
    }
    console.log('1')
    const userExists = await db.user.findFirst({
      where: {
        email
      }
    })
    console.log(userExists)
    if (userExists) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: 'email',
            message: 'User with this email address already exists.',
            code: 'RESOURCE_EXISTS'
          }
        ]
      })
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
  } catch (e) {}
}
