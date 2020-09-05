FROM node:12
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN rm -f *lock.json
EXPOSE 3333
ENTRYPOINT ["yarn", "dev:server"]
