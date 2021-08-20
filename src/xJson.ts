import { existsSync, mkdirSync, createReadStream, writeFileSync } from "fs";
import _, { isNumber } from 'lodash';
import path, { ParsedPath } from "path";

type Object = {
    [key: string]: any
};

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
        key: '',
        flags: [],
        primaryKey: 'id'
    };
    private timer: number = 0;
    private increment: number = 0;

    constructor(file: string, dataName?: string) {
        let parsedPath: ParsedPath = path.parse(path.win32.normalize(`${process.cwd()}/${file}`));
        if (parsedPath.ext.length !== 0) {
            this.config.ext = parsedPath.ext;
        }
        this.config.key = dataName ?? parsedPath.name;
        this.config.file = path.win32.normalize(`${parsedPath.dir}/${parsedPath.name}${this.config.ext}`);
  
        if (!existsSync(path.dirname(this.config.file))) {
            try {
                mkdirSync(path.dirname(this.config.file), { recursive: true });
            } catch(error) {
                throw new Error(`unable to create ${path.dirname(this.config.file)} directory.`);
            }
        }
    }

    public async init(data: T[] = [], flags: Flag[] = [Flag.rule_id_auto_increment]): Promise<void> {
        const obj: any = {};
        obj[this.config.key] = data;
        try {
            if (!existsSync(this.config.file)) {
                writeFileSync(this.config.file, JSON.stringify(obj, null, 4), { encoding: 'utf-8' });
            } 
            // read file content.
            let fileContent: any = await this.streamFile(this.config.file);
            if (!(this.config.key in fileContent)) {
                throw new Error(`the data key is not the right.`);
            }
            this.data = fileContent[this.config.key];
        } catch(err) {
            console.log(err);
            throw new Error(`Unable to read or create ${this.config.file}`);
        }

        this.config.flags = flags;
        if (flags.includes(Flag.rule_id_auto_increment)) {
            this.increment = this.calculateCurrentIncrement();
            if (!isNumber(this.increment)) {
                throw new Error('increment is not a number.');
            }
        }
    }

    private async streamFile(file: string): Promise<any> {
        let stream = createReadStream(file);
        let chunks: Uint8Array[] = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('err', (err) => reject(err));
            stream.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8'))));
        });
    }

    private calculateCurrentIncrement(): number {
        if (this.data.length == 0) {
            return 1;
        }
        if (!(this.data[0] as Object).hasOwnProperty(this.config.primaryKey)) {
            return 1;
        }
        return ((_.maxBy(this.data, (value: any) => value[this.config.primaryKey]) as any)[this.config.primaryKey] || 1) as number;
    }
}