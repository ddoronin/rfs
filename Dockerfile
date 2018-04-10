FROM node:8-alpine
RUN mkdir /build/
COPY packages/media-gallery/package.json /build/
RUN cd /build/; yarn
COPY packages/media-gallery/ /build/
RUN cd /build/; yarn build
