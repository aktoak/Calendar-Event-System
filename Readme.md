# Event System App

# Docker Build

**prerequisites**

- docker installed on your machine

Steps:

- clone the git repository
- inside the root directory run `docker-compose up -d --build` to start the application
- finally visit `http://localhost:5000` to view the App running.

p.s: run `docker-compose down` to stop the application

# Manual Build

**prerequisites**

- react installed
- nodejs installed

Steps:

- clone the git repository
- inside the client directory run `npm ci` to install the required packages.
- inside the client directory run `npm run build`.
- inside the server directory run `npm ci` to install the required packages.
- inside the server directory run `npm start` to start the application
- finally visit `http://localhost:5000` to view the App running.
