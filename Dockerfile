# Dockerfile code from https://mherman.org/blog/dockerizing-a-react-app/
# and https://www.youtube.com/watch?v=3OP-q55hOUI&t=284s 

# pull official base image
FROM node:18.0.0-alpine3.15

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
RUN yarn add package.json

# add app
COPY . ./

# Build production app
RUN yarn build

# start app
CMD yarn start
