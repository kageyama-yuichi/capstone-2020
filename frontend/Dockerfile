FROM node:12.7.0-alpine as build

RUN mkdir -p /l8z/client
WORKDIR /l8z/client

COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent

COPY . ./

RUN npm run build

FROM nginx:1.17.0-alpine
COPY --from=build /l8z/client/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]
