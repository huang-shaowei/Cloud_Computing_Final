FROM node:6.9.2
EXPOSE 8080
COPY server.js .
COPY index.html .
COPY main.js .
COPY style.css .
CMD node server.js
