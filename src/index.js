import fastify from 'fastify'
import Client from './client'
import { join } from 'path'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const app = fastify()
app.register(require('@fastify/cors'), {
    origin: '*',
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
})

let clientSession = {}

const users = {
    fabricio: '123',
    fabio: '123',
    wellington: '123',
}

app.get('/teste', (request, reply) => {
    reply.status(200).send('Hello')
})

app.post('/status', async (request, reply) => {

    const { sessionName } = request.body

    if(!users[sessionName]) reply.status(401).send('usuário invalido')

    if (!clientSession[sessionName])
        clientSession[sessionName] = new Client(sessionName)

    const client = clientSession[sessionName]

    while (true) {
        await sleep(1000)
        if (client.qrCode || client.connected) break
    }

    reply.send({
        qr_code: client.qrCode,
        connected: client.isConnected,
        status: client.status,
    })

})

app.post('/send', (request, reply) => {
    
    const { sessionName, number, message } = request.body

    if(!users[sessionName]) reply.status(401).send('usuário invalido')

    clientSession[sessionName].sendText(number, message)
        .then(() => {
            return reply.send()
        })
        .catch(error => {
            return reply.status(500).send({ status: 'error', message: error })
        })
})

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
    console.log('HTTP Server Running')
    // console.log(join(__dirname, '../'))
})