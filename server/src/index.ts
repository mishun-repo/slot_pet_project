import express from 'express'
import cors from 'cors'
import { healthRouter } from './routes/health'
import { authRouter } from './routes/auth'
import { initRouter } from './routes/init'
import { spinRouter } from './routes/spin'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.use('/health', healthRouter)
app.use('/auth', authRouter)
app.use('/init', initRouter)
app.use('/spin', spinRouter)

app.get('/', (_req, res) => {
  res.json({ message: 'Slot server is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})