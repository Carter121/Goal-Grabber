# Goal Grabber

## Description

The all in one solution to keeping students engaged in after school activities.

## Features

- Fully Customizable
- Create and Scan Qr Codes
- Create Own Events
- Create Own Prizes
- Secure Authentication

## Installation

### Front End

```bash
$ npm install
$ npm run build
```

### Database

Follow instructions on [Pocketbase](https://pocketbase.io/) for your system. Then create a .env file like this in the base folder:

```env
PUBLIC_POCKETBASE_URL=[pocketbase url]
ADMIN_EMAIL=[admin email]
ADMIN_PASSWORD=[admin password]
```

## Usage

To get started, create your admin user in the database and then create a school with your account linked to the school. Login to the web portal and get started!

## License

GNU GPLv3
