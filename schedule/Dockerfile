FROM node:alpine
WORKDIR /usr/src/app
# Installing dependencies
COPY package*.json ./
RUN npm install
# Copying source files
COPY . .
# Running the app
CMD [ "npm", "run", "start" ]
EXPOSE 3000