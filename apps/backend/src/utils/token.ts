import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export const encode = (data: any) => {
  try {
    const token = jwt.sign(data, JWT_SECRET, { expiresIn: '6h' })
    return token
  } catch (e) {
    return ''
  }
}

export const decode = (token: string) => {
  try {
    const data = jwt.verify(token, JWT_SECRET)
    return data
  } catch (e) {
    return null
  }
}
