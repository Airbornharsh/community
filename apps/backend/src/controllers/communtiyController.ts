import { RequestHandler } from 'express'
import { NoUserResponse, catchErrorResponse } from '../constants/response'
import { UserToken } from '../middlewares/authMiddleware'
import { communityNameValidation } from '../validator'
import db from '@repo/db/clients'
import { v4 } from 'uuid'

export const createCommunityController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user as UserToken | null
    if (user === null) {
      return res.status(401).json(NoUserResponse)
    }
    const { name } = req.body
    const { error } = communityNameValidation.validate({ name })
    if (error) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: 'name',
            message: 'Name should be at least 2 characters.',
            code: 'INVALID_INPUT'
          }
        ]
      })
    }
    // const date = new Date()
    // db.community.create({
    //   data: {
    //     id: v4(),
    //     name,
    //     slug: name.toLowerCase().replace(' ', '-'),
    //     updated_at: date,
    //     ownerId: user.id,
    //     created_at: date,
    //     members: {
    //       create: {
    //         userId: user.id,
    //         role: ,
    //         created_at: date
    //       }
    //     }
    //   }
    // })
  } catch (e) {
    return res.status(500).json(catchErrorResponse)
  }
}

export const getAllCommunityController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user as UserToken | null
    if (user === null) {
      return res.status(401).json(NoUserResponse)
    }
  } catch (e) {
    return res.status(500).json(catchErrorResponse)
  }
}

export const getMembersCommunityController: RequestHandler = async (
  req,
  res
) => {
  const user = res.locals.user as UserToken | null
  if (user === null) {
    return res.status(401).json(NoUserResponse)
  }
  try {
  } catch (e) {
    return res.status(500).json(catchErrorResponse)
  }
}

export const getOwnedCommunityController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user as UserToken | null
    if (user === null) {
      return res.status(401).json(NoUserResponse)
    }
  } catch (e) {
    return res.status(500).json(catchErrorResponse)
  }
}

export const getJoinedCommunityController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user as UserToken | null
    if (user === null) {
      return res.status(401).json(NoUserResponse)
    }
  } catch (e) {
    return res.status(500).json(catchErrorResponse)
  }
}
