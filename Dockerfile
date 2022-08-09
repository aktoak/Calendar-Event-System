FROM node
WORKDIR /app
COPY ./client/package.json ./client/
RUN npm install --prefix ./client
COPY ./server/package.json ./server/
RUN npm install --prefix ./server
COPY ./client ./client/
COPY ./server ./server/
EXPOSE 5000
RUN npm run build --prefix ./client/
WORKDIR /app/server
CMD ["npm", "start"]

