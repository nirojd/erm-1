## Backend

In the backend directory, copy or move .example.env to .env

Configure port number and database settings in .env file.

Run

To run migration and seeders: `npm run db`

To run dependencies: `npm install`

To run the server: `npm run dev`

Please check username in the [seeder file](https://github.com/nirojdyola/erm/blob/main/backend/db/seeders/20201103132008-users-seeders.js).


## Frontend

In the frontend directory, copy or move .env.local.example to .env.local

Change the `REACT_APP_BASE_URL` and `REACT_APP_FILE_URL` to the respective one. For example:

REACT_APP_BASE_URL="http://localhost:3011/api"
REACT_APP_FILE_URL="http://localhost:3011/"

where "http://localhost:3011/api" is the one where backend server is running.


Run

To run dependencies: `npm install`
