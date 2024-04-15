import { Router } from 'express'
import {
  getUserData,
  signinController,
  signupController
} from '../controllers/userController'
import { verifyToken } from '../middlewares/authMiddleware'
import {
  createCommunityController,
  getAllCommunityController,
  getJoinedCommunityController,
  getMembersCommunityController,
  getOwnedCommunityController
} from '../controllers/communtiyController'
import {
  createMemberController,
  removeMemberController
} from '../controllers/memberController'
import {
  createRoleController,
  getAllRoleController
} from '../controllers/roleController'

const main = (router: Router) => {
  router.get('/', (req, res) => {
    res.send('Hello World!')
  })

  user(router)
  role(router)
  community(router)
  member(router)
}

export default main

const user = (router: Router) => {
  const r = Router()
  router.use('/auth', r)

  r.post('/signup', signupController)
  r.post('/signin', signinController)
  r.get('/me', verifyToken, getUserData)
}

const role = (router: Router) => {
  const r = Router()
  router.use('/role', r)

  r.post('/', verifyToken, createRoleController)
  r.get('/', verifyToken, getAllRoleController)
}

const community = (router: Router) => {
  const r = Router()
  router.use('/community', r)

  r.post('/', verifyToken, createCommunityController)
  r.get('/', verifyToken, getAllCommunityController)
  r.get('/:id/members', verifyToken, getMembersCommunityController)
  r.get('/me/owner', verifyToken, getOwnedCommunityController)
  r.get('/me/member', verifyToken, getJoinedCommunityController)
}

const member = (router: Router) => {
  const r = Router()
  router.use('/member', r)

  r.post('/', verifyToken, createMemberController)
  r.delete('/:id', verifyToken, removeMemberController)
}
