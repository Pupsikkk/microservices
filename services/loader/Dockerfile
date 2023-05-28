FROM node:18-alpine
WORKDIR /service

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY ./../../package*.json ./
COPY package*.json ./

# # Install app dependencies
RUN npm install

# Bundle app source
# COPY ./../node_modules ./node_modules
COPY . .

# EXPOSE 3000

# Start the server using the production build
# CMD [ "node", "index.js" ]