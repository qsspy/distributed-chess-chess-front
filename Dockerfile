FROM node:15.13-alpine

ARG ROOM_SERVICE_ADDRESS
ARG CHESS_COMMAND_ADDRESS
ARG CHESS_EVENT_ADDRESS

WORKDIR /chess-front
ENV PATH="./node-modules/.bin:$PATH"

#install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./

#inject production variables
RUN sed -i '/REACT_APP_ROOM_SERVICE_ADDRESS/d' ./.env
RUN sed -i '/REACT_APP_CHESS_COMMAND_ADDRESS/d' ./.env
RUN sed -i '/REACT_APP_CHESS_EVENT_ADDRESS/d' ./.env

RUN echo "REACT_APP_ROOM_SERVICE_ADDRESS=${ROOM_SERVICE_ADDRESS}" >> ./.env
RUN echo "REACT_APP_CHESS_COMMAND_ADDRESS=${CHESS_COMMAND_ADDRESS}" >> ./.env
RUN echo "REACT_APP_CHESS_EVENT_ADDRESS=${CHESS_EVENT_ADDRESS}" >> ./.env

RUN npm run build

#run
CMD ["npm", "start"]