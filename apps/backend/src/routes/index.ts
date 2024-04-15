import { Router } from 'express'
import {
  getUserData,
  signinController,
  signupController
} from '../controllers/userController'
import { verifyToken } from '../middlewares/authMiddleware'

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

  r.post('/signup', signupController)
  r.use('/signin', signupController)
  r.use('/me', signupController)
}

const community = (router: Router) => {
  const r = Router()
  router.use('/community', r)

  r.post('/signup', signupController)
  r.use('/signin', signupController)
  r.use('/me', signupController)
}

const member = (router: Router) => {
  const r = Router()
  router.use('/member', r)

  r.post('/signup', signupController)
  r.use('/signin', signupController)
  r.use('/me', signupController)
}
