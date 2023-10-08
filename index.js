var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.js
var import_fastify = __toESM(require("fastify"));

// src/client.js
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

// src/index.js
var import_path2 = require("path");
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var app = (0, import_fastify.default)();
app.register(require("@fastify/cors"), {
  origin: "*",
  methods: "GET,PUT,POST,DELETE,OPTIONS"
});
var clientSession = {};
var users = {
  fabricio: "123",
  fabio: "123",
  wellington: "123"
};
app.get("/teste", (request, reply) => {
  reply.status(200).send("Hello");
});
app.post("/status", async (request, reply) => {
  const { sessionName } = request.body;
  if (!users[sessionName])
    reply.status(401).send("usu\xE1rio invalido");
  if (!clientSession[sessionName])
    clientSession[sessionName] = new client_default(sessionName);
  const client = clientSession[sessionName];
  while (true) {
    await sleep(1e3);
    if (client.qrCode || client.connected)
      break;
  }
  reply.send({
    qr_code: client.qrCode,
    connected: client.isConnected,
    status: client.status
  });
});
app.post("/send", (request, reply) => {
  const { sessionName, number, message } = request.body;
  if (!users[sessionName])
    reply.status(401).send("usu\xE1rio invalido");
  clientSession[sessionName].sendText(number, message).then(() => {
    return reply.send();
  }).catch((error) => {
    return reply.status(500).send({ status: "error", message: error });
  });
});
app.listen({
  host: "0.0.0.0",
  port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
  console.log("HTTP Server Running");
});
