'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  sender: 'user' | 'chip'
  text?: string
  image?: string
  timestamp: Date
}

interface ChatWindowProps {
  canvasImage: string | null
  onImageProcessed: () => void
  onYamlGenerated: (yaml: string) => void
}

export default function ChatWindow({ canvasImage, onImageProcessed, onYamlGenerated }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'chip',
      text: 'Hi! I\'m Chip. I can help you convert your architecture drawings into code. Draw something in the Canvas tab and click "Send to Chat" to share it with me!',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (canvasImage && !isProcessing) {
      handleCanvasImage(canvasImage)
    }
  }, [canvasImage])

  const handleCanvasImage = async (imageDataUrl: string) => {
    setIsProcessing(true)

    // Add user's canvas image to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      image: imageDataUrl,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Call API to analyze the image
    try {
      const response = await fetch('/api/generate-spec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageDataUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()

      // Update the YAML spec in the Canvas tab
      onYamlGenerated(data.yaml)

      // Add Chip's response with the YAML spec
      setTimeout(() => {
        const chipResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'chip',
          text: `I've analyzed your architecture diagram! Here's the YAML specification I generated:\n\n\`\`\`yaml\n${data.yaml}\n\`\`\`\n\nWould you like me to help you implement this, or would you like to make any changes?`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, chipResponse])
        setIsProcessing(false)
        onImageProcessed()
      }, 1000)
    } catch (error) {
      console.error('Error analyzing image:', error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'chip',
        text: 'Sorry, I had trouble analyzing your diagram. Please try again!',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
      setIsProcessing(false)
      onImageProcessed()
    }
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate Chip's response
    setTimeout(() => {
      const chipResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'chip',
        text: getChipResponse(inputValue),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, chipResponse])
    }, 500)
  }

  const getChipResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('help') || input.includes('how')) {
      return 'I can help you convert your architecture drawings into implementation plans! Draw your system architecture in the Canvas tab, then come back here and ask me to analyze it or generate code from it.'
    }

    if (input.includes('canvas') || input.includes('draw')) {
      return 'Go to the Canvas tab to draw your architecture diagram using Excalidraw. You can add boxes for services, arrows for connections, and text for labels!'
    }

    if (input.includes('convert') || input.includes('generate') || input.includes('code')) {
      return 'Once you\'ve drawn your architecture, I\'ll convert it to a YAML spec, validate it, and send it to Claude Code to implement. (Note: This is currently simulated for the MVP)'
    }

    return 'That\'s interesting! For now, I\'m focused on helping you convert architecture drawings into code. Try drawing something in the Canvas tab, or ask me how I can help!'
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        maxWidth: '1000px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e0e0e0',
          fontSize: '20px',
          fontWeight: '600',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          Chat with Chip
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map(message => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: message.image ? '90%' : '70%',
                padding: message.image ? '8px' : '12px 16px',
                borderRadius: '12px',
                backgroundColor: message.sender === 'user' ? '#0066cc' : '#f0f0f0',
                color: message.sender === 'user' ? 'white' : '#333',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '15px',
                lineHeight: '1.5'
              }}>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Canvas screenshot"
                    style={{
                      maxWidth: '100%',
                      borderRadius: '8px',
                      display: 'block'
                    }}
                  />
                )}
                {message.text && (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {message.text}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{
          padding: '16px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
