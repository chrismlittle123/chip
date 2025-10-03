'use client'

import { Excalidraw } from '@excalidraw/excalidraw'

export default function ExcalidrawCanvas() {
  const sampleYaml = `# System Architecture Specification
version: "1.0"
name: "Example Architecture"

components:
  - name: "Frontend"
    type: "web-app"
    framework: "React"
    description: "User-facing web application"

  - name: "Backend API"
    type: "api-service"
    framework: "Node.js"
    description: "RESTful API server"

  - name: "Database"
    type: "database"
    engine: "PostgreSQL"
    description: "Primary data store"

connections:
  - from: "Frontend"
    to: "Backend API"
    protocol: "HTTPS"

  - from: "Backend API"
    to: "Database"
    protocol: "TCP"

deployment:
  platform: "AWS"
  regions:
    - "us-east-1"
`

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
          fontSize: '20px',
          fontWeight: '600',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          Draw Your Architecture
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <Excalidraw />
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
            {sampleYaml}
          </pre>
        </div>
      </div>
    </div>
  )
}
