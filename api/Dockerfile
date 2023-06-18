FROM node:16.17.0-alpine as build
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json",  "./"]
RUN npm install --production
COPY . .

FROM node:16.17.0-alpine
WORKDIR /app/backend

COPY --from=build /usr/src/app /app/backend
EXPOSE 8800

RUN chown -R node /app/backend
USER node
CMD ["node", "index.js"]

