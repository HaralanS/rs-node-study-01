import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

// query parameters - URL stateful - filtros, paginacao, nao obrigatorios - localhost:3333/users?userId=1&name=Diego
// route parameters - identificacao de recurso - localhost:3333/users/1 
// request body - envio de informacoes de um formulario - (HTTPS)


const server = http.createServer(async (req, res) => {
    const {method, url} = req


    await json(req, res)

    const route = routes.find(route => {
        return route.method == method && route.path.test(url)
    })

    if (route) {
        const routeParams = req.url.match(route.path)

        // console.log(extractQueryParams(routeParams.groups.query))

        const {query, ...params} = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}
        // console.log(routeParams.groups)

        return route.handler(req, res)
    }

    return res.writeHead(404).end('Not Found :(')
})

server.listen(3333)