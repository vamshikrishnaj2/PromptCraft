import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3002

app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'PromptCraft backend' })
})

app.post('/api/generate', async (req, res) => {
  const prompt = req.body?.prompt

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Please enter a prompt.' })
  }

  if (prompt.length > 5000) {
    return res.status(400).json({
      error: 'Prompt must be 5000 characters or fewer.',
    })
  }

  const apiKey = process.env.FREELLMAPI_KEY

  if (!apiKey || apiKey === 'your_actual_gateway_key_here') {
    return res.status(500).json({
      error: 'Backend API key is not configured.',
    })
  }

  try {
    const response = await fetch(
      'http://127.0.0.1:3001/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'auto',
          messages: [{ role: 'user', content: prompt.trim() }],
        }),
        signal: AbortSignal.timeout(60000),
      },
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      console.error('AI gateway HTTP status:', response.status)
      return res.status(502).json({
        error: 'The AI gateway returned an error. Check its configuration.',
      })
    }

    const text = data.choices?.[0]?.message?.content

    if (typeof text !== 'string' || !text.trim()) {
      return res.status(502).json({
        error: 'The AI gateway returned no text.',
      })
    }

    return res.json({ text })
  } catch (error) {
    console.error('AI request failed:', error.message)
    return res.status(502).json({
      error: 'Could not reach FreeLLMAPI. Make sure its server is running on port 3001.',
    })
  }
})

app.listen(PORT, '127.0.0.1', () => {
  console.log(`PromptCraft backend running at http://127.0.0.1:${PORT}`)
})