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