# Simulacrum

This project uses react and webpack on the front end and spring boot and kotlin on the backend.

## Demo
https://simulacrum.herokuapp.com

## Get Started
Install CLI tools via `brew` (if you don't have them already)
```
$ brew install mysql mvn npm
```
Login to mysql and create local database
```
$ mysql -u root
$ create database simulacrum;
$ exit;
```
Build the project:
```
$ mvn clean install -P development
```
Build and run the API via `mvn`:
```sh
$ cd api
$ mvn spring-boot:run
```

Run the app via `npm`:
```sh
$ cd app
$ npm start
```

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.


