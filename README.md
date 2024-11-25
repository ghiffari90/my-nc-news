# Northcoders News API

For anyone who wishes to clone this project and run it locally. You need to make .env.development for your production database and .env.test for testing the code.
Put the name of the database setup in the setup.sql to each of the .env file. To setup (create/initialise) the databases, please run the command ```npm run setup-dbs```.

Once you run the test using ```npm test```, the code will direct itself to .env.test so the test database is used. On the other hand, if you wanted to run the code in production, the database set in .env.developent would be chosen.

Next, if all the test has been completed, you can run the command ```npm run seed``` to seed the production database with the initialised data (in JSON) given in the data/development-data folder.



--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
