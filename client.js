var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.js
var client_exports = {};
__export(client_exports, {
  default: () => client_default
});
module.exports = __toCommonJS(client_exports);
var import_path = require("path");
var import_venom_bot = require("venom-bot");
var Client = class {
  client;
  connected;
  statusSession;
  qr;
  get isConnected() {
    return this.connected;
  }
  get qrCode() {
    return this.qr;
  }
  get status() {
    return this.statusSession;
  }
  constructor(sessionName) {
    const qr = (base64Qr) => this.qr = base64Qr;
    const status = (statusSession) => {
      this.statusSession = statusSession;
      this.connected = ["isLogged", "qrReadSuccess", "chatsAvailable", "successChat"].includes(statusSession);
    };
    const start = (client) => {
      this.client = client;
      client.onStateChange((state) => {
        this.connected = state === import_venom_bot.SocketState.CONNECTED;
      });
    };
    (0, import_venom_bot.create)(sessionName, qr, status, {
      logQR: false,
      puppeteerOptions: { args: [
        "--no-sandbox",
        "--disable-stuid-sandbox",
        "--single-process",
        "--no-zygote"
      ] },
      // headless: false,
      // browserPathExecutable: '/usr/bin/chromium-browser',
      // browserPathExecutable: join(__dirname, '.cache', 'puppeteer'),
      // browserPathExecutable: '/opt/render/project/.chrome',
      // browserPathExecutable: 'chrome/chrome-win',
      // browserPathExecutable: '/opt/render/project/.render/chrome/opt/google/chrome',
      browserPathExecutable: process.env.PUPPETEER_EXECUTABLE_PATH
      // slowMo: undefined,
    }).then((client) => start(client)).catch((error) => console.log(error));
  }
  async sendText(to, body) {
    const phoneNumber = `${to}@c.us`;
    await this.client.sendText(phoneNumber, body);
  }
};
var client_default = Client;
