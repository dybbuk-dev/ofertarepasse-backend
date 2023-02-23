FROM node:12-alpine AS base

RUN mkdir -p /home/node/app && \
  chown -R node:node /home/node/app

RUN apk add --virtual build-deps build-base python2

USER node
WORKDIR /home/node/app
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --prod

FROM base AS build

RUN yarn install
COPY --chown=node:node . .
RUN yarn build

FROM node:12-alpine AS prod

RUN mkdir -p /home/node/app && \
  chown -R node:node /home/node/app

USER node
WORKDIR /home/node/app

COPY --from=base /home/node/app/node_modules ./node_modules
COPY --from=build /home/node/app/dist ./dist

ENV NODE_ENV=production \
  PORT=3333

CMD ["node", "dist/main.js"]
#CMD ["sh","entrypoint.sh"]