###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine As development

RUN addgroup app && adduser -S -G app app
RUN mkdir -p /app && chown -R app:app /app

USER app

WORKDIR /app

COPY --chown=app:app package*.json ./

COPY --chown=app:app env/* ./env/

RUN yarn install --frozen-lockfile

COPY --chown=app:app . .

ENV NODE_ENV development

###################
# BUILD FOR PRODUCTION
###################

FROM node:16-alpine As build

RUN addgroup app && adduser -S -G app app
RUN mkdir -p /app && chown -R app:app /app

USER app

WORKDIR /app

COPY --chown=app:app package*.json ./

COPY --chown=app:app --from=development /app/node_modules ./node_modules

COPY --chown=app:app . .

RUN yarn build

ENV NODE_ENV production

RUN yarn install --frozen-lockfile --production=true && yarn cache clean --force

###################
# PRODUCTION
###################

FROM node:16-alpine As production

RUN addgroup app && adduser -S -G app app
RUN mkdir -p /app && chown -R app:app /app

COPY --chown=app:app package*.json ./

USER app

# Copy the bundled code from the build stage to the production image
COPY --chown=app:app --from=build /app/node_modules ./node_modules
COPY --chown=app:app --from=build /app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
