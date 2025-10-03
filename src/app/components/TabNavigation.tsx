'use client'

import { useState } from 'react'
import ExcalidrawCanvas from './ExcalidrawCanvas'
import ChatWindow from './ChatWindow'

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'chat'>('canvas')

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e0e0e0',
        backgroundColor: '#fff',
        padding: '0 20px'
      }}>
        <button
          onClick={() => setActiveTab('canvas')}
          style={{
            padding: '16px 32px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'canvas' ? '3px solid #0066cc' : '3px solid transparent',
            color: activeTab === 'canvas' ? '#0066cc' : '#666',
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
            borderBottom: activeTab === 'chat' ? '3px solid #0066cc' : '3px solid transparent',
            color: activeTab === 'chat' ? '#0066cc' : '#666',
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
        {activeTab === 'canvas' ? <ExcalidrawCanvas /> : <ChatWindow />}
      </div>
    </div>
  )
}
