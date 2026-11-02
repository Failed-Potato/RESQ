import { createServer } from 'node:http'
import { access, readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleIntelligenceRequest } from './server/intelligence-api.js'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const buildDirectory = resolve(projectRoot, 'dist')
const port = Number(process.env.PORT) || 4173
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

async function serveFile(request, response, pathname) {
  let decodedPath
  try {
    decodedPath = decodeURIComponent(pathname)
  } catch {
    response.writeHead(400).end('Invalid URL path.')
    return
  }

  const requestedPath = resolve(buildDirectory, `.${decodedPath}`)
  if (requestedPath !== buildDirectory && !requestedPath.startsWith(`${buildDirectory}${sep}`)) {
    response.writeHead(403).end('Forbidden.')
    return
  }

  let filePath = requestedPath
  try {
    if (!(await stat(filePath)).isFile()) filePath = resolve(buildDirectory, 'index.html')
    await access(filePath)
  } catch {
    filePath = resolve(buildDirectory, 'index.html')
  }

  try {
    const contents = await readFile(filePath)
    const extension = extname(filePath)
    response.writeHead(200, {
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
    response.end(request.method === 'HEAD' ? undefined : contents)
  } catch (error) {
    console.error('Unable to serve the RESQ production build.', error)
    response.writeHead(500).end('The RESQ production build could not be served.')
  }
}

const server = createServer((request, response) => {
  let pathname
  try {
    pathname = new URL(request.url, 'http://localhost').pathname
  } catch {
    response.writeHead(400).end('Invalid request URL.')
    return
  }

  if (pathname === '/api/intelligence') {
    handleIntelligenceRequest(request, response)
    return
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD')
    response.writeHead(405).end('Method not allowed.')
    return
  }

  serveFile(request, response, pathname)
})

server.listen(port, () => {
  console.log(`RESQ production server listening on http://localhost:${port}`)
  console.log(`Gemini intelligence: ${process.env.GEMINI_API_KEY ? 'configured' : 'demo fallback'}`)
})
