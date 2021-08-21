import { xJson } from "../src/xJson";

interface User {
    id: number;
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

    // use internal add method to use xJson options like auto increment.
    users.add({ firstName: 'Nicolas' });
    
    // You can also use pure JS to add data.
    users.data.push({ firstName: 'Nicolas' });

    // save all modifications in target file.
    users.write();
})();