FROM node:12
WORKDIR /usr/src/auth_system
COPY package.json .
RUN npm install
EXPOSE 8090
CMD ["npm","run","start"]
COPY . .
