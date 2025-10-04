'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'

const Excalidraw = dynamic(
  async () => {
    const module = await import('@excalidraw/excalidraw')
    return module.Excalidraw
  },
  { ssr: false }
)

interface ExcalidrawCanvasProps {
  onSendToChat: (imageDataUrl: string) => void
  yamlSpec: string
}

export default function ExcalidrawCanvas({ onSendToChat, yamlSpec }: ExcalidrawCanvasProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null)
  const [isValidating, setIsValidating] = useState(false)

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

      // Dynamically import exportToBlob
      const { exportToBlob } = await import('@excalidraw/excalidraw')

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

  const handleValidateSpec = async () => {
    setIsValidating(true)
    setValidationResult(null)

    try {
      // Dynamically import yaml and Ajv
      const [yamlModule, AjvModule] = await Promise.all([
        import('js-yaml'),
        import('ajv')
      ])
      const yaml = yamlModule.default
      const Ajv = AjvModule.default

      // Parse the YAML specification
      const parsedYaml = yaml.load(yamlSpec)

      // Fetch the schema
      const schemaResponse = await fetch('/schemas/api-specification.yml')
      const schemaText = await schemaResponse.text()
      const schema = yaml.load(schemaText)

      // Validate using AJV
      const ajv = new Ajv({ allErrors: true, strict: false })
      const validate = ajv.compile(schema as object)
      const valid = validate(parsedYaml)

      if (valid) {
        setValidationResult({
          valid: true,
          message: '✓ Specification is valid!'
        })
      } else {
        const errors = validate.errors?.map(err =>
          `${err.instancePath || 'root'}: ${err.message}`
        ).join('\n') || 'Unknown validation error'

        setValidationResult({
          valid: false,
          message: `✗ Validation failed:\n${errors}`
        })
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        message: `✗ Error: ${error instanceof Error ? error.message : 'Failed to validate'}`
      })
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      gap: '20px',
      backgroundColor: '#1a1a1a',
      padding: '20px'
    }}>
      {/* Canvas Section - 2/3 width */}
      <div style={{
        flex: '2',
        backgroundColor: '#0a0a0a',
        borderRadius: '8px',
        border: '1px solid #333',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#e0e0e0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          }}>
            Draw Your Architecture
          </div>
          <button
            onClick={handleSendToChat}
            disabled={isSending}
            style={{
              padding: '10px 20px',
              backgroundColor: isSending ? '#444' : '#e85d2a',
              color: isSending ? '#888' : 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isSending ? 'not-allowed' : 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              transition: 'all 0.2s'
            }}
          >
            {isSending ? 'Sending...' : 'Send to Chat'}
          </button>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            theme="dark"
          />
        </div>
      </div>

      {/* Specification Section - 1/3 width */}
      <div style={{
        flex: '1',
        backgroundColor: '#0a0a0a',
        borderRadius: '8px',
        border: '1px solid #333',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #333',
          fontSize: '20px',
          fontWeight: '600',
          color: '#e0e0e0',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          Specification
        </div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <pre style={{
            margin: 0,
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#b0b0b0',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            flex: 1
          }}>
            {yamlSpec}
          </pre>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleValidateSpec}
              disabled={isValidating}
              style={{
                padding: '10px 20px',
                backgroundColor: isValidating ? '#444' : '#e85d2a',
                color: isValidating ? '#888' : 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isValidating ? 'not-allowed' : 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                transition: 'all 0.2s'
              }}
            >
              {isValidating ? 'Validating...' : 'Validate Specification'}
            </button>
            {validationResult && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '6px',
                backgroundColor: validationResult.valid ? 'rgba(40, 167, 69, 0.2)' : 'rgba(232, 93, 42, 0.2)',
                border: `1px solid ${validationResult.valid ? '#28a745' : '#e85d2a'}`,
                color: validationResult.valid ? '#4ade80' : '#e85d2a',
                fontSize: '13px',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}>
                {validationResult.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
