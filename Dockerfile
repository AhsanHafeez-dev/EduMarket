FROM node:alpine


WORKDIR /usr/src
COPY package*.json .

RUN npm config set registry https://registry.npmmirror.com
RUN npm config set fetch-timeout 60000
RUN npm config set fetch-retries 5


RUN npm ci




COPY . .  
RUN npx prisma generate
EXPOSE  5000
CMD ["npm","run","docker"]