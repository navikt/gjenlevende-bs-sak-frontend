FROM gcr.io/distroless/nodejs24-debian12

WORKDIR /app

COPY package.json package-lock.json ./

COPY dist/ ./dist/

COPY build/ ./build/
COPY node_modules/ ./node_modules/

ENV ENV=production

EXPOSE 8080

CMD ["dist/server.js"]