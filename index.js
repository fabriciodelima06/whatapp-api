const express = require("express")
const { scrapeLogic } = require("./scrapeLogic")
const { create } = require("venom-bot")
const { join } = require("path")

const app = express()

app.get("/", (req, res) => {
    res.send('Render Puppeteer is up and running')
})

app.get('/scrape', (req, res) => {
    scrapeLogic(res)
})
app.get('/status', (req, res) => {

    console.log(__dirname)

    create('sessionName', undefined, undefined, {
        logQR: false,
        puppeteerOptions: {
            args: [
                '--no-sandbox',
                '--disable-stuid-sandbox',
                '--single-process',
                '--no-zygote'
            ]
        },
        // browserPathExecutable: join(__dirname, '.cache', 'puppeteer'),
    })
        .then(client => res.send(ok))
        .catch(error => console.log(error))
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})