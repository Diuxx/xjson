import { xJson } from "../src/xJson";


(async () => {
    let movies: xJson = new xJson('examples/databases/test', 'movies');
    await movies.init();

    console.log(' -- done --');
    console.log(movies.data[0]);


})();