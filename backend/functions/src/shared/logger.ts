import { injectable } from 'tsyringe';

@injectable()
export class Logger {
    constructor(private name: string) {}

    info(message: string, ...args: any[]) {
        console.log(`[${this.name}] INFO:`, message, ...args);
    }

    warn(message: string, ...args: any[]) {
        console.warn(`[${this.name}] WARN:`, message, ...args);
    }

    error(message: string, ...args: any[]) {
        console.error(`[${this.name}] ERROR:`, message, ...args);
    }

    child(options: { service: string }) {
        return new Logger(`${this.name}:${options.service}`);
    }
}