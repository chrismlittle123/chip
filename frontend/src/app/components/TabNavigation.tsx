'use client'

import { useState } from 'react'
import ExcalidrawCanvas from './ExcalidrawCanvas'
import ChatWindow from './ChatWindow'

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'chat'>('canvas')
  const [canvasImage, setCanvasImage] = useState<string | null>(null)
  const [yamlSpec, setYamlSpec] = useState<string>(`# Draw your architecture diagram
# Then click "Send to Chat" to discuss it with Chip

# Your generated specification will appear here...`)

  const handleSendToChat = (imageDataUrl: string) => {
    setCanvasImage(imageDataUrl)
    setActiveTab('chat')
  }

  const handleYamlGenerated = (yaml: string) => {
    setYamlSpec(yaml)
  }

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a' }}>
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #333',
        backgroundColor: '#0a0a0a',
        padding: '0 20px'
      }}>
        <button
          onClick={() => setActiveTab('canvas')}
          style={{
            padding: '16px 32px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'canvas' ? '3px solid #e85d2a' : '3px solid transparent',
            color: activeTab === 'canvas' ? '#e85d2a' : '#999',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            transition: 'all 0.2s'
          }}
        >
          Canvas
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          style={{
            padding: '16px 32px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'chat' ? '3px solid #e85d2a' : '3px solid transparent',
            color: activeTab === 'chat' ? '#e85d2a' : '#999',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            transition: 'all 0.2s'
          }}
        >
          Chat with Chip
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', paddingTop: '20px' }}>
        <div style={{ display: activeTab === 'canvas' ? 'block' : 'none', height: '100%' }}>
          <ExcalidrawCanvas onSendToChat={handleSendToChat} yamlSpec={yamlSpec} />
        </div>
        <div style={{ display: activeTab === 'chat' ? 'block' : 'none', height: '100%' }}>
          <ChatWindow
            canvasImage={canvasImage}
            onImageProcessed={() => setCanvasImage(null)}
            onYamlGenerated={handleYamlGenerated}
          />
        </div>
      </div>
    </div>
  )
}
