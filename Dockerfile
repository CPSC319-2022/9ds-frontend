# Dockerfile code from https://mherman.org/blog/dockerizing-a-react-app/
# and https://www.youtube.com/watch?v=3OP-q55hOUI&t=284s 

# # pull official base image
# FROM node:18.0.0-alpine3.15

# # set working directory
# WORKDIR /app

# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# # install app dependencies
# COPY package.json ./
# RUN yarn add package.json

# # add app
# COPY . ./

# # Build production app
# RUN yarn build

# # start app
# CMD yarn start

# https://cloud.google.com/community/tutorials/deploy-react-nginx-cloud-run
# build environment
FROM node:14-alpine as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

# server environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template

COPY --from=react-build /app/build /usr/share/nginx/html

ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"

