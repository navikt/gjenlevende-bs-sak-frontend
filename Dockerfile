FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY package.json package-lock.json ./

COPY dist/ ./dist/

COPY build/ ./build/
COPY node_modules/ ./node_modules/

EXPOSE 8080

CMD ["/nodejs/bin/node", "dist/server.js"]