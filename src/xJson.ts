import { existsSync, mkdirSync } from "fs";
import path, { ParsedPath } from "path";

/**
 * 
 * 
 */
export enum Flag {
    rule_no_duplicate = 1,
    rule_id_generated,
    rule_id_auto_increment
}

/**
 * 
 * 
 */
export class xJson<T = unknown> {
    public data: T[] = [];
    private config: {[key: string]: any} = {
        file: '',
        ext: '.json',
        path: '.',
        // json array key name.
        key: ''
    };
    private timer: number = 0;

    constructor(file: string, dataName?: string) {
        let parsedPath: ParsedPath = path.parse(path.win32.normalize(`${process.cwd()}/${file}`));
        if (parsedPath.ext.length !== 0) {
            this.config.ext = parsedPath.ext;
        }
        this.config.key = dataName ?? parsedPath.name;
        this.config.file = path.win32.normalize(`${parsedPath.dir}/${parsedPath.name}${this.config.ext}`);
  
        if(!existsSync(path.dirname(this.config.file))) {
            try {
                mkdirSync(path.dirname(this.config.file), { recursive: true });
            } catch(error) {
                throw new Error(`unable to create ${path.dirname(this.config.file)} directory.`);
            }
        }
    }
}