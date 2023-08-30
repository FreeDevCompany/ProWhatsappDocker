# İlk adımda, "client" uygulamanızı build edin.
FROM node:alpine as client-builder
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build

# İkinci adımda, Nginx imajını kullanın ve "client" build çıktısını kopyalayın.
FROM nginx:alpine
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=client-builder /app/build /usr/share/nginx/html
EXPOSE 80
