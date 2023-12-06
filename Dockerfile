FROM node:18
# RUN mkdir -p /app
WORKDIR /app
# ADD . /app
COPY package.json package-lock.json ./
RUN npm install
# ENV NODE_ENV development
# copy all the files from the project’s root to the working directory
COPY . .
# EXPOSE 3000
# EXPOSE 8080
CMD ["npm","start"]