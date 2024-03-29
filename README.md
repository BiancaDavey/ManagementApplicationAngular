# Management Application - Angular

This project utilises Angular and is the frontend for the full-stack Management Application, which enables users to manage clients. 

This application runs with the Java Spring Boot [backend](https://github.com/BiancaDavey/ManagementApplicationSpringBoot).

## Features

* Full stack application using Java Spring Boot, MySQL, and Angular
* Frontend application allowing users to view and manage clients
* Modal to add new clients with client-side input validation
* Button to delete clients
* Button to filter clients by status

## Requirements

* Angular
* MySQL
* Java
* Spring Boot
* This application runs with the [backend](https://github.com/BiancaDavey/ManagementApplicationSpringBoot)

## Run the Application locally

1. Navigate into the `server` folder from the [backend](https://github.com/BiancaDavey/ManagementApplicationSpringBoot) repository.
2. Run the backend application in IntelliJ.
3. Navigate into the `server-app` folder.
4. Start the frontend application: `ng serve`.
5. Navigate to `http://localhost:4200/` to view the frontend application.

## Application Usage

* The application is initialised with example client data
* Add a new client by clicking on the 'New Client' button and filling in the fields
* Delete an existing client by clicking on the trash icon next to the client entry
* Filter clients by status by clicking on the "ALL" button to select the applicable status

## Usage Example

* Client application
[![Client-Application.png](https://i.postimg.cc/HsMWqt3S/Client-Application.png)](https://postimg.cc/1f9Z6wk6)

* Add new client
[![Client-Application-Add.png](https://i.postimg.cc/0yq5PJB9/Client-Application-Add.png)](https://postimg.cc/rKQ29zTH)

* Filter clients
[![Client-Application-Filter.png](https://i.postimg.cc/DwdvZy9L/Client-Application-Filter.png)](https://postimg.cc/LJ5KQR68)

## Backend Usage Example

* [Backend](https://github.com/BiancaDavey/ManagementApplicationSpringBoot)- View client table in MySQL
[![My-SQLExample-Data.png](https://i.postimg.cc/ZY8d6ycn/My-SQLExample-Data.png)](https://postimg.cc/kD5GmGLP)