import { useState } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!prompt.trim()) {
      setError('Please enter a prompt first.')
      return
    }

    setLoading(true)
    setError('')
    setResponse('')
    setCopied(false)

    try {
      const result = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: AbortSignal.timeout(60000),
      })

      const data = await result.json()

      if (!result.ok) {
        throw new Error(data.error || 'Failed to generate text.')
      }

      setResponse(data.text || 'No text was returned.')
    } catch (err) {
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        setError('The AI request took too long. Please try again.')
      } else if (err.message === 'Failed to fetch') {
        setError(
          'The AI service is unreachable. Please check that the servers are running.',
        )
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(response)
      setCopied(true)
      setError('')
    } catch {
      setError('Unable to copy. Please select and copy the text manually.')
    }
  }

  function handleClear() {
    setPrompt('')
    setResponse('')
    setError('')
    setCopied(false)
  }

  return (
    <main className="app">
      <header className="header">
        <div className="brand-mark">AI</div>
        <span className="brand-name">PromptCraft</span>
        <span className="status">Free AI Lab</span>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR IDEAS, POWERED BY AI</p>
        <h1>
          Turn your ideas into <span>words.</span>
        </h1>
        <p className="subtitle">
          Write, brainstorm, and create with your personal AI text generator.
        </p>
      </section>

      <section className="generator">
        <label htmlFor="prompt">What would you like to create?</label>

        <textarea
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Example: Write a professional introduction for a beginner web developer..."
          rows={6}
          maxLength={5000}
        />

        <div className="input-footer">
          <span>{prompt.length}/5000 characters</span>

          <div className="action-buttons">
            <button
              className="clear-button"
              onClick={handleClear}
              disabled={loading}
              type="button"
            >
              Clear
            </button>

            <button
              className="generate-button"
              onClick={handleGenerate}
              disabled={loading}
              type="button"
            >
              {loading ? (
                <>
                  <span className="loading-spinner" aria-hidden="true" />
                  AI is thinking...
                </>
              ) : (
                '✦ Generate text'
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <div className="result">
          <div className="result-header">
            <h2>Generated result</h2>

            {response && (
              <button
                className="copy-button"
                onClick={handleCopy}
                type="button"
              >
                {copied ? 'Copied!' : 'Copy text'}
              </button>
            )}
          </div>

          {response ? (
            <p className="response">{response}</p>
          ) : (
            <p className="placeholder">
              Your AI-generated text will appear here.
            </p>
          )}
        </div>
      </section>

      <footer>
        Built for learning · Connected to your own AI gateway
      </footer>
    </main>
  )
}

export default App