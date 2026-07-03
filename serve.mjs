import {createReadStream, existsSync, statSync} from 'node:fs'
import {createServer} from 'node:http'
import {extname, join, normalize, resolve} from 'node:path'

const root = resolve('.')
const port = Number(process.env.PORT || process.argv.find(arg => arg.startsWith('--port='))?.split('=')[1] || 8080)
const host = process.env.HOST || process.argv.find(arg => arg.startsWith('--host='))?.split('=')[1] || '127.0.0.1'

const types = {
  '.css': 'text/css',
  '.glb': 'model/gltf-binary',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${port}`)
  const safePath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '')
  let filePath = resolve(join(root, safePath))

  if (!filePath.startsWith(root)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  if (!existsSync(filePath)) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  if (statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html')
  }

  if (!existsSync(filePath)) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  res.writeHead(200, {'Content-Type': types[extname(filePath)] || 'application/octet-stream'})
  createReadStream(filePath).pipe(res)
}).listen(port, host, () => {
  const visibleHost = host === '0.0.0.0' ? 'localhost' : host
  console.log(`Rock 8th Wall project served at http://${visibleHost}:${port}`)
})
