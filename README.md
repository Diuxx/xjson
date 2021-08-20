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

To init and link a json file in your projet instantiate and init it.

```js
import { xJson } from "../src/xJson";

(async () => {
  // instanciate xJson object
  let movies: xJson = new xJson('examples/databases/test', 'movies');
  
  // read data
  await movies.init();
})();
```
