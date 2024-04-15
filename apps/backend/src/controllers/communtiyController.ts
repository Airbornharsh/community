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
    const slugExists = await db.community.findFirst({
      where: {
        slug: name.toLowerCase().replace(' ', '-')
      }
    })
    if (slugExists) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: 'name',
            message: 'Community with this name already exists.',
            code: 'RESOURCE_EXISTS'
          }
        ]
      })
    }
    const date = new Date()
    const community = await db.community.create({
      data: {
        id: v4(),
        name,
        slug: name.toLowerCase().replace(' ', '-'),
        updated_at: date,
        owner: user.id,
        created_at: date
      }
    })
    const role = await db.role.create({
      data: {
        id: v4(),
        name: 'Community Admin',
        created_at: date,
        updated_at: date
      }
    })
    const member = await db.member.create({
      data: {
        id: v4(),
        user: user.id,
        community: community.id,
        role: role.id,
        created_at: date
      }
    })
    await db.community.update({
      where: {
        id: community.id
      },
      data: {
        members: {
          connect: {
            id: member.id
          }
        }
      }
    })
    return res.status(200).json({
      status: true,
      content: {
        data: community
      }
    })
  } catch (e) {
    return res.status(500).json(catchErrorResponse)
  }
}

export const getAllCommunityController: RequestHandler = async (req, res) => {
  try {
    const limit = 50
    const page = req.query.page ? parseInt(req.query.page as string) : 1
    const count = await db.community.count()
    const communities = await db.community.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        ownerRef: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    const tempCommunities = communities.map((community) => {
      return {
        ...community,
        owner: {
          id: community.ownerRef.id,
          name: community.ownerRef.name
        },
        ownerRef: undefined
      }
    })
    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page
        },
        data: tempCommunities
      }
    })
  } catch (e) {
    return res.status(500).json(catchErrorResponse)
  }
}

export const getMembersCommunityController: RequestHandler = async (
  req,
  res
) => {
  try {
    const { id } = req.params
    const community = await db.community.findFirst({
      where: {
        id
      },
      include: {
        members: {
          include: {
            userRef: {
              select: {
                id: true,
                name: true
              }
            },
            roleRef: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
    if (!community) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: 'Community not found',
            code: 'RESOURCE_NOT_FOUND'
          }
        ]
      })
    }
    const members = community.members.map((member) => {
      return {
        id: member.id,
        community: id,
        user: {
          id: member.userRef.id,
          name: member.userRef.name
        },
        role: {
          id: member.roleRef.id,
          name: member.roleRef.name
        },
        created_at: member.created_at
      }
    })
    return res.status(200).json({
      status: true,
      content: {
        data: members
      }
    })
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
