import { RequestHandler } from 'express'
import { NoUserResponse, catchErrorResponse } from '../constants/response'
import { UserToken } from '../middlewares/authMiddleware'

export const createMemberController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user as UserToken | null
    if (user === null) {
      return res.status(401).json(NoUserResponse)
    }
  } catch (error) {
    return res.status(500).json(catchErrorResponse)
  }
}

export const removeMemberController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user as UserToken | null
    if (user === null) {
      return res.status(401).json(NoUserResponse)
    }
  } catch (error) {
    return res.status(500).json(catchErrorResponse)
  }
}
