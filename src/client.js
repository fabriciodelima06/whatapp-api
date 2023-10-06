// import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js"
import { join } from "path"
import { create, SocketState } from "venom-bot"

class Client {
    client
    connected
    statusSession
    qr

    get isConnected() {
        return this.connected
    }

    get qrCode() {
        return this.qr
    }

    get status() {
        return this.statusSession
    }

    constructor(sessionName) {
        const qr = base64Qr => this.qr = base64Qr

        const status = statusSession => {
            //isLogged || notLogged || browserClose || qrReadSuccess || 
            //qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || 
            //chatsAvailable || deviceNotConnected || serverWssNotConnected || 
            //noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || 
            //initWhatsapp || erroPageWhatsapp || successPageWhatsapp || waitForLogin || 
            //waitChat || successChat

            this.statusSession = statusSession
            this.connected = ['isLogged', 'qrReadSuccess', 'chatsAvailable', 'successChat'].includes(statusSession)

        }

        const start = client => {
            this.client = client
            client.onStateChange(state => {
                this.connected = state === SocketState.CONNECTED
            })
        }

        create(sessionName, qr, status, { 
            logQR: false, 
            puppeteerOptions: { args: ['--no-sandbox'] }, 
            // headless: false,
            // browserPathExecutable: '/usr/bin/chromium-browser',
            // browserPathExecutable: join(__dirname, '.cache', 'puppeteer'),
            browserPathExecutable: '/opt/render/project/.render/chrome/opt/google/chrome',
            slowMo: undefined,
        })
            .then(client => start(client))
            .catch(error => console.log(error))
    }

    async sendText(to, body) {

        // if (!isValidPhoneNumber(to, 'BR')) {
        //     console.log({ to })
        //     throw new Error('This number is not valid!')
        // }


        // let phoneNumber = parsePhoneNumber(to, 'BR')?.format('E.164')?.replace('+', '')
        const phoneNumber = `${to}@c.us`

        await this.client.sendText(phoneNumber, body)
    }

}

export default Client