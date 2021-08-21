import { existsSync, mkdirSync, createReadStream, writeFileSync, createWriteStream } from "fs";
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
    private config: Object = {
        file: '',
        ext: '.json',
        path: '.',
        key: '', // json array key name.
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

    public async add(...data: T[]) {
        data.forEach((d: Object) => {
            if (this.config.flags.includes(Flag.rule_id_auto_increment)) {
                d[this.config.primaryKey] = ++this.increment;
            }
            this.data.push(d as T);
        });
    }

    public async write(): Promise<void> {
        await this.writeFile();
    }

    private async writeFile(): Promise<void> {
        let length: number = this.data.length - 1;
        let stream = createWriteStream(this.config.file);
        return new Promise((resolve, reject) => {
            stream.once('open', (fd) => {
                stream.write('{\r\n');
                stream.write(`  "${this.config.key}": [\r\n`);
                this.data.forEach((e, i) => {
                    let data: string = JSON.stringify(e, null, 2).split('\n').map(str => '    '.concat(str)).join('\r\n');
                    if (i < length) {
                        data += ',';
                    }
                    data += '\r\n';
                    stream.write(`${data}`);
                });
                stream.write('  ]\r\n');
                stream.write('}');
                stream.end();
            });
            stream.on('err', (err) => reject(err));
            stream.on('end', () => resolve());
        });
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
            return 0;
        }
        if (!this.availableForIncrement(this.data[0])) {
            return 0;
        }
        return ((_.maxBy(this.data, (value: Object) => value[this.config.primaryKey]) as any)[this.config.primaryKey] || 0) as number;
    }

    private availableForIncrement(data: Object): boolean {
        return data.hasOwnProperty(this.config.primaryKey);
    }
}