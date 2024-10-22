import http from 'node:http'
// ESModules => importacao usando import/export

// CommonJs => importacao usando require
// const http = require('http')

const users = []
let idSequence = 1

const server = http.createServer(async (req, res) => {
    const {method, url} = req

    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try{
        req.body = JSON.parse(Buffer.concat(buffers).toString())

    } catch {
        req.body = null
    }

    // console.log(body)

    if (method == 'GET' && url == '/users'){
        return res
        .setHeader('Content-type', 'application/json')
        .end(JSON.stringify(users))
    }

    if (method == 'POST' && url == '/users'){
        // const {name, email} = req.body poderia ser feito com desestruturacao tambem

        users.push({
            id: idSequence,
            name: req.body.name,
            email: req.body.email
        })
        idSequence++
        return res.writeHead(201).end()
    }

    return res.writeHead(404).end('Not Found :(')
})

server.listen(3333)