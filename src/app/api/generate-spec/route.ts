import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Read the YAML schema
    const schemaPath = path.join(process.cwd(), 'schemas', 'api-specification.yml')
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8')

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // Extract base64 data and media type from data URL
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }

    const mediaType = matches[1]
    const base64Data = matches[2]

    // Call Claude API with vision
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `You are an expert system architect. Analyze this architecture diagram and generate a detailed YAML specification that describes the system.

IMPORTANT: Your YAML output MUST conform to the following schema:

\`\`\`yaml
${schemaContent}
\`\`\`

Follow these guidelines:
1. The YAML must be valid and conform to the schema structure above
2. Required fields: version, name, components
3. Each component must have: name, type (and optionally: description, technology, endpoints, properties)
4. For API components, include endpoints with: path, method (and optionally: description, payload, response)
5. Include connections array if there are relationships between components (from, to, protocol, description)
6. Include deployment object if deployment info is visible (platform, regions, environment)

Be thorough and accurate. Only include information that is clearly visible in the diagram. Return ONLY the YAML specification, no additional text or explanation.`,
            },
          ],
        },
      ],
    })

    // Extract YAML from response
    const yamlContent = message.content[0].type === 'text' ? message.content[0].text : ''

    // Clean up the YAML (remove markdown code blocks if present)
    let cleanYaml = yamlContent.trim()
    if (cleanYaml.startsWith('```yaml')) {
      cleanYaml = cleanYaml.replace(/^```yaml\n/, '').replace(/\n```$/, '')
    } else if (cleanYaml.startsWith('```')) {
      cleanYaml = cleanYaml.replace(/^```\n/, '').replace(/\n```$/, '')
    }

    return NextResponse.json({ yaml: cleanYaml })
  } catch (error) {
    console.error('Error generating specification:', error)
    return NextResponse.json(
      { error: 'Failed to generate specification', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
