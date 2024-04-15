import { RequestHandler } from 'express'
import { userValidation } from '../validator'
import { v4 } from 'uuid'
import db from '@repo/db/clients'
import { encode } from '../utils/token'

export const signupController: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const { error } = userValidation.validate({ name, email, password })
    if (error) {
      return res.status(400).json({
        status: false,
        errors: [
          ...error.details.map((e) => ({
            param: e.context?.key,
            message: e.message,
            code: 'INVALID_INPUT'
          }))
        ]
      })
    }
    const userExists = await db.user.findFirst({
      where: {
        email
      }
    })
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
    const userData = {
      id: user.id,
      name: user.name,
      email: user.name,
      created_at: user.created_at
    }
    const token = encode(userData)
    if (!token) {
      return res.status(500).json({
        status: false,
        errors: [
          {
            message: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR'
          }
        ]
      })
    }
    res.cookie('access_token', token)
    return res.status(200).json({
      status: true,
      content: {
        data: userData,
        meta: {
          access_token: token
        }
      }
    })
  } catch (e) {
    return res.status(500).json({
      status: false,
      errors: [
        {
          message: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR'
        }
      ]
    })
  }
}
