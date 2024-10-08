# Bike Service Web App

This is a full-stack web application designed for managing bike service bookings. The application includes functionalities for users to book services and for admins to manage bookings.

## Table of Contents

- [Installation](#installation)
- [Database Configuration](#database-configuration)
- [Database Schema](#database-schema)
- [Sample Data](#sample-data)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Best Practices](#best-practices)
- [License](#license)

## Installation

### Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).
- You have a running MySQL database instance.

### Clone the Repository

```bash
git clone https://github.com/yourusername/bike-service-web-app.git
cd bike-service-web-app
```

### Navigatee to "Backend Directory" and install dependencies

```bash
cd Backend
npm install
```

### Create a ".env" file in the server directory and add your database credentials:

```PORT=8080
DB_HOST=your_host
DB_USER=your_username_in_tidb
DB_PASSWORD=your_password
DB_NAME=your_db_name_in_tidbcloud.com
DB_PORT=4000
USER_SECRET_KEY=Hf6B#4vG8$yN3sA!Jr%kLf@Wm7cP2qZiT0xR9wUeX5&zYgD1p
CLIENT_ID=946353326356-0phv1dlj95oqe1hedjn6bq915832jie3.apps.googleusercontent.com
CLIENT_SECRET=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
REDIRECT_URI=https://developers.google.com/oauthplayground
REFRESH_TOKEN=1//04y7FB9P8nC1aCgYIARAAGAQSNwF-L9IrxBtbsvBfE_S3UuamqZ2Nr2KSot6INsFnBQ44PZrgDR3uEP9S9Zhl6FfX_F3cRIWwwDE
CREATOR_MAILID=guruprasathv.dev@gmail.com
```


### Start the backend server:

```bash
npm run devStart
```

##Databasse Configuration

###The following is the database schema required for the application:
###Enter into your sql editor in https://tidbcloud.com and there create a cluster you will get credentials enter this in .env files

###schemas for all tables
###Tables:
- [bookings](#bookings)
- [users](#users)
- [services](#services)
- [bookings_services](#bookings_services)

###Schemas:
bookings:
```SQL
CREATE TABLE Bookings (
    bookingId CHAR(36) NOT NULL PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    bookedDate DATE NOT NULL,
    state VARCHAR(50) NOT NULL,
    vehicleNo VARCHAR(50) NOT NULL,
    vehicleModel VARCHAR(50) NOT NULL
);
```

users:

```SQL
CREATE TABLE Users (
    userId CHAR(36) NOT NULL PRIMARY KEY,
    userName VARCHAR(255) NOT NULL UNIQUE,
    userPassword VARCHAR(255) NOT NULL,
    userMobile VARCHAR(255) NOT NULL,
    displayName VARCHAR(255) NOT NULL,
    doorNo VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    postalCode CHAR(6) NOT NULL,
    userRole VARCHAR(20) DEFAULT 'Customer'
);
```


services:
```SQL
CREATE TABLE Services (
    servId CHAR(36) NOT NULL PRIMARY KEY,
    servName VARCHAR(255) NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    timeTaken VARCHAR(255) NOT NULL,
    description TEXT,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    category VARCHAR(255) DEFAULT 'General'
);
```

bookings_services:
```SQL
CREATE TABLE BookingServices (
    bookingId CHAR(36) NOT NULL,
    serviceId CHAR(36) NOT NULL,
    PRIMARY KEY (bookingId, serviceId)
);
```


###sample date

users:
```SQL
userPassword	userMobile	displayName	doorNo	street	city	state	postalCode	userRole
$2b$10$BzSzQ8SDV1lKTWR3do7IieQzIaDs.QctErh6LRAd.1.8yku27p6am	8667481775	Guruprasath V	X-145	x-145, North housing unit, Selvapuram, Coimbatore	Coimbatore	Tamil Nadu	641026	Admin
$2b$10$44wvC2srMVygiNvW3xs16.hfbsdB1JH83lZDpL6RUnGuOVaB0Uwji	8667481775	pevert	X-145	north housing unit	Coimbatore	Tamil Nadu	641026	Customer
$2b$10$Dx9xcSSCjazRYoTQ.fkgMe7/eJyOwcffhRWePfRc5POSYUYiWIiPG	6382061988	Samu	ts40	ms street	coimbatore	tamilnadu	641035	Customer
```


services:
```SQL
servId	servName	fee	timeTaken	description	createdTime	updateTime	category
c01e5d23-8313-4818-9065-bce728e5a117	oil change	30.2	5	Oil change will be taken	2024-08-06 15:28:54	2024-08-06 15:45:48	General
f1bd3656-1bf1-4433-925b-2a024c974a53	Water Wash	100	1:30	Clean your bikes with clear water	2024-08-06 15:35:11	2024-08-06 15:35:48	General
```


bookings can only be done through website

###Move to frontend and start install packages
```bash
cd ../client
npm install
```

###create .env in frontend root directory and add this
REACT_APP_BASE_URL_API=http://localhost:8080/api


###Start server
```bash
npm start
```

#Happie hacking




