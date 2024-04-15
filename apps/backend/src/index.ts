import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes'
const router = express.Router()
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8000

app.use('/v1', router)

routes(router)

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
