import { RequestHandler } from 'express'
import db from '@repo/db/clients'
import { decode } from '../utils/token'

export interface UserToken {
  id: string
  name: string
  email: string
  created_at: string
  iat: number
}

export const verifyToken: RequestHandler = async (req, res, next) => {
  // const token = req.cookies['access_token']
  // console.log(token)
  const token = req.headers.authorization?.split(' ')[1]
  try {
    if (!token) {
      res.locals.user = null
    } else {
      const tempUser = decode(token) as UserToken
      const user = await db.user.findFirst({
        where: {
          id: tempUser?.id
        }
      })
      res.locals.user = user
    }
  } catch (e) {
    res.locals.user = null
  }
  next()
}
