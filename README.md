# CTFNotes

Follow the steps below to self host this app.

1. First we have to build the app (This step can be skipped for project submission as the build files are already included)
Go to the project root directory and run the following lines
```
$ npm install
$ npm run build
```
The built front end should be in /dist
Go to /cs6131-backend and run
```
$ npx tsc
$ cp package.json ./dist
$ cd ./dist
$ npm install
```

2. Before we run the app, we must seed the database. First make sure that a mysql server is running at port 3306.
Open up /cs6131-backend/mysql-seeding.ipynb and run all the cells
Then create /cs6131-backend/dist/.env and populate it with the following environmental variables
```
DB_HOST="127.0.0.1"
DB_USER="root"
DB_PASSWORD="admin"
DB_NAME="project"
JWT_SECRET_KEY="dummysecretkey"
```
Replace JWT_SECRET_KEY with your own secure randomly generated key, for testing purposes this is not really needed.
3. Now we can run the app
Go to /cs6131/dist and run
```
$ node index.js
```
You should see the server running on port 3000
Then navigate to the project root directory and run
```
$ npm install -g serve
$ serve -l 8080 -s ./dist
```
You may need admin permissions to install serve globally
If all goes well, the frontend should be up at localhost:8080
