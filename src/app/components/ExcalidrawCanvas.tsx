'use client'

import { Excalidraw } from '@excalidraw/excalidraw'
import { useState } from 'react'
import { exportToBlob } from '@excalidraw/excalidraw'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'

interface ExcalidrawCanvasProps {
  onSendToChat: (imageDataUrl: string) => void
  yamlSpec: string
}

export default function ExcalidrawCanvas({ onSendToChat, yamlSpec }: ExcalidrawCanvasProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null)
  const [isSending, setIsSending] = useState(false)

  const handleSendToChat = async () => {
    if (!excalidrawAPI) {
      alert('Canvas not ready yet')
      return
    }

    setIsSending(true)

    try {
      // Get canvas elements
      const elements = excalidrawAPI.getSceneElements()

      if (elements.length === 0) {
        alert('Please draw something on the canvas first!')
        setIsSending(false)
        return
      }

      // Export canvas as image blob
      const blob = await exportToBlob({
        elements: elements,
        appState: excalidrawAPI.getAppState(),
        files: excalidrawAPI.getFiles(),
      })

      // Convert blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(blob)

      reader.onloadend = async () => {
        const base64Image = reader.result as string
        onSendToChat(base64Image)
        setIsSending(false)
      }
    } catch (error) {
      console.error('Error sending to chat:', error)
      alert('Failed to send to chat. Check console for details.')
      setIsSending(false)
    }
  }

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      gap: '20px',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      {/* Canvas Section - 2/3 width */}
      <div style={{
        flex: '2',
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          }}>
            Draw Your Architecture
          </div>
          <button
            onClick={handleSendToChat}
            disabled={isSending}
            style={{
              padding: '10px 20px',
              backgroundColor: isSending ? '#ccc' : '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isSending ? 'not-allowed' : 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}
          >
            {isSending ? 'Sending...' : 'Send to Chat'}
          </button>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} />
        </div>
      </div>

      {/* Specification Section - 1/3 width */}
      <div style={{
        flex: '1',
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
          Specification
        </div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#f8f8f8'
        }}>
          <pre style={{
            margin: 0,
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#333',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            {yamlSpec}
          </pre>
        </div>
      </div>
    </div>
  )
}
