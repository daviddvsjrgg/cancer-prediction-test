FROM node:18.20.0
WORKDIR /src/server/server
ENV PORT 8080
COPY . .
RUN npm install
EXPOSE 8080
CMD [ "npm", "run", "start"]