import http, { IncomingMessage, ServerResponse } from 'http';
import * as net from 'net';
import { AddressInfo } from 'net';

/*
  Mini server to process async responses
 */

const processPost = (request: IncomingMessage, response: ServerResponse, callback: () => void) => {
  let queryData = ''
  if (typeof callback !== 'function') return null

  request.on('data', function (data) {
    queryData += data
  })

  request.on('end', function () {
    (request as any).post = JSON.parse(queryData)
    callback()
  })
}

const sendResponse = (res: ServerResponse, statusCode: number, body: any) => {
  res.writeHead(statusCode)
  res.write(body)
  res.end()
}

const send200 = (res: ServerResponse, body?: any) => {
  sendResponse(res, 200, body || '<h1>OK</h1>')
}

export function getFreePort () {
  return new Promise(resolve => {
    const server = net.createServer()
    server.listen(() => {
      const port = (server.address() as AddressInfo)?.port
      server.close(() => resolve(port))
    })
  })
}

export default (port: number, mockData = {}) => {
  const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = req.url
    if (url === '/ok') {
      send200(res)
      return;
    }

    if (url?.startsWith('/echo')) {
      sendResponse(res, 200, JSON.stringify({ echo: url.slice(8) }))
      return;
    }

    if (url?.startsWith('/number')) {
      sendResponse(res, Number.parseInt(url.slice(8, 11)), JSON.stringify(mockData))
      return;
    }

    if (url?.startsWith('/sleep')) {
      const urlParts = url?.split('/');
      const waitTime = Number.parseInt(urlParts[urlParts?.length - 1])
      setTimeout(() => {
        send200(res)
      }, waitTime)
      return
    }

    if (url === '/post') {
      processPost(req, res, function () {
        sendResponse(res, 200, JSON.stringify({ got: (req as any).post }))
      })
    }
  })
  server.listen(port, 'localhost')

  return server
}
