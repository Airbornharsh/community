import { RequestHandler } from 'express'

export const verifyToken: RequestHandler = (req, res) => {
  const token = req.cookies['access_token']
}
