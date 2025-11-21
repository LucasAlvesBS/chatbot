FROM node:22-alpine AS build
WORKDIR /app
COPY .docker docker
RUN chmod +x ./docker/entrypoint.sh
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src ./src
RUN npm i --ignore-scripts -g @nestjs/cli rimraf
RUN npm ci
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV production
COPY --from=build /app/dist ./dist
COPY --from=build /app/docker ./.docker
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
RUN npm prune --omit=dev
USER node
ENTRYPOINT ["./.docker/entrypoint.sh"]