import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import generateSpecRouter from './routes/generate-spec.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))

// Routes
app.use('/api', generateSpecRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' })
})

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
})
