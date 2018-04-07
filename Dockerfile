FROM node:8-alpine
WORKDIR /build/
COPY packages/media-gallery/package.json /
RUN yarn
COPY packages/media-gallery/  /
RUN yarn build
