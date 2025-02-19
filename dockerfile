#Base Image
FROM node:20.11.1

#create an app dir
WORKDIR /app

#install app dependencies
COPY package*.json ./

#run npm install
RUN npm install

#copy everything from current dir to container app dir
COPY . .

#expose port 3000
EXPOSE 3000

#commands to run the server
CMD [ "npm", "start"]