# About

[![Greenkeeper badge](https://badges.greenkeeper.io/ginpei/try-instagram-api.svg)](https://greenkeeper.io/)

An example to log in to Instagram, get own profile and show recent photos.

![./image.png](./image.png)

# Getting Started

## 1. Install

```
$ git clone git@github.com:ginpei/try-instagram-api.git
$ npm i
```

## 2. Set Credential

The file `src/creds.js` is required to be set up. See `src/creds.example.js` as an example.

```
const CLIENT_ID = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

The key in the file is found here (You have to have your account):

- [Manage Clients • Instagram Developer Documentation](https://www.instagram.com/developer/clients/manage/)

## 3. Run Gulp

```
$ npm start
```

### 4. Try on your brouser

- `http://localhost:3000/`
