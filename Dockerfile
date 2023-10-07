FROM ghcr.io/puppeteer/puppeteer:21.1.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN tsup src
COPY . .

CMD [ "node", "dist/server.js" ]