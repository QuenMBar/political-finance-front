# The Political Finance Project

[Frontend Git Repo](https://github.com/QuenMBar/political-finance-front) | [Backend Git Repo](https://github.com/QuenMBar/PoliticalFinances)

(More documentation is to come and also some cleaned up code)

This project was created as my final project for Flatiron web development class.

## Project Goal

The goal of this project was to create a map showing where politicians receive their money from and how the politicians use it.  However, the scope of showing both where the money came from and went proved to be too large of a task for the two week period so I decided to focus on just where the money was coming from (though I do plan on finishing where its going to in my free time).  The current version of the website also allows users to select counties, zip codes, and individual donations to track or keep tabs on, and whatever you're tracking shows up on your profile page.

## Frontend

Lets start with the front end since it is by far the simpler of the two.  The front end was made with react using redux and material ui.  It is mainly for just displaying and mapping the data stored on the backend.

### Setup

Setting up the frontend isn't that hard.

- Step 1 is just cloning down the repo.
- Step 2 is creating an env file.

    To do this you will want to head over to [MapBox](https://docs.mapbox.com/help/getting-started/access-tokens/) and get an access token.  Paste your token into the .env.example and remove the example part of the the name so its just .env.

- Step 3 is running ```npm install```.
- Step 4 is running ```npm start``` or ```npm run build``` depending on which one you want to use.  Please note that when running npm start, you should first run the backend so it gets priority over the ports.

## Backend

The backend is alot more complicated.  It is a rails api that uses the bulk downloads that can be found through the FEC website [here](https://www.fec.gov/data/browse-data/?tab=bulk-data), resulting in a database of about 35 gigabytes for the 2020-2021 election cycle.  While it was considered to use a prebuilt api for this, none of them had the data I wanted and by creating my own, I was able to make a lot more interesting charts without having to make a load of API requests.  This rails app uses a postgres database, with elasticsearch and searchkick being used for searching.  Along with that, backblaze is being used to host the database snapshot, and jwt is being used for sign in.

### Setup

(This will take around 40 gb to setup with a final size of 35 gb, also it will take up allll of your ram)

- First, you should install elastic search on your machine by following this [guide](https://www.elastic.co/downloads/elasticsearch).  This is used to take the search time from 3 min to a few seconds.
- Next, install or start [PostgreSQL](https://www.postgresql.org/download/)
- Next, just cloning down the repo.  This app was built on ruby 3.0.1 and may not work on other versions
- Then run bundle install
- TODO: Download snapshot
- Now run the following commands

    ```bash
    rails db:setup
    rails db:migrate
    gunzip -c dbdevsnapshot.gz | psql PoliticalFinances_development
    ```

- Before we can run our database though, we will need to reindex searchkick by running ```searchkick:reindex:all```.  There are also multithreaded ways to do this since it will take a while, if you're interested please look [here](https://github.com/ankane/searchkick#performance)
- Also set your .env the same way as above.  The value can be any string without spaces.
- The final step is just to run ```rails s```.  Do this before npm start.
