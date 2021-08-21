[![GitHub version](https://img.shields.io/github/last-commit/Diuxx/xjson)](https://https://github.com/Diuxx/xjson) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://https://github.com/Diuxx/xjson/graphs/commit-activity)

<br />
<p align="center">
  <a href="https://https://github.com/Diuxx/xjson">
    <img src="json.svg" alt="Logo" width="120" height="120">
  </a>

  <h3 align="center">xjson</h3>

  <p align="center">
    Local JSON database manager (write with typescript).
  </p>
</p>

<!-- ABOUT THE PROJECT -->
## About The Project

## Install

```sh
npm i @diuxx/xjson
```

## Usage

To init and link a json file in your project instantiate and init it.

```js
import { xJson } from "../src/xJson";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

(async () => {
  // instantiate xJson object.
  let users: xJson = new xJson<User>('examples/databases/users');

  // read data and get ready to work with.
  await users.init();
})();
```
The user.json file :

```js
{
    "users": []
}
```

write data in json file

```js
(async () => {
    // instantiate xJson object.
    let users: xJson = new xJson<User>('examples/databases/users');

    // read data and get ready to work with.
    await users.init();

    users.add({ firstName: 'Nicolas' });
    users.write();
})();
```

```js
{
  "users": [
    {
      "firstName": "Nicolas",
      "id": 1
    }
  ]
}
```

By default auto increment is set to on. Thereby an id zill be added in your stored object.
