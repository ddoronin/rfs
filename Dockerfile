FROM node:8-alpine

# Compile front-end assets
COPY packages/media-gallery/package.json /build/
RUN cd /build/ \
    && yarn
COPY packages/media-gallery/ /build/
RUN cd /build/ \
    && yarn build \
    && mkdir ../dist \
    && cd .. \
    && mv build/public ../dist \
    && rm -rf build
