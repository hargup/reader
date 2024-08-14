import { CloudHTTPv2 } from './decorators';
import { Ctx } from './types';
import { Logger } from './logger';
import { OutputServerEventStream } from './output-stream';
import { RPCReflect } from './rpc-reflect';
import { injectable } from 'tsyringe';

@injectable()
export class AsyncContext {
    private storage: Map<string, any> = new Map();

    set(key: string, value: any) {
        this.storage.set(key, value);
    }

    get(key: string): any {
        return this.storage.get(key);
    }
}

export class InsufficientBalanceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InsufficientBalanceError';
    }
}

export function Param(name: string, options?: any): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
        // Implementation details would go here
    };
}

@injectable()
export class FirebaseStorageBucketControl {
    bucket: any;

    constructor() {
        this.bucket = {
            file: (fileName: string) => ({
                exists: async () => [true]
            })
        };
    }

    async uploadFile(filePath: string, destination: string): Promise<string> {
        console.log(`Mock: Uploading file from ${filePath} to ${destination}`);
        return `https://storage.googleapis.com/mock-bucket/${destination}`;
    }

    async downloadFile(filePath: string, destination: string): Promise<void> {
        console.log(`Mock: Downloading file from ${filePath} to ${destination}`);
    }

    async deleteFile(filePath: string): Promise<void> {
        console.log(`Mock: Deleting file ${filePath}`);
    }

    async fileExists(filePath: string): Promise<boolean> {
        console.log(`Mock: Checking if file ${filePath} exists`);
        return true;
    }

    async saveFile(filePath: string, content: Buffer, options?: any): Promise<void> {
        console.log(`Mock: Saving file ${filePath}`);
    }

    async signDownloadUrl(filePath: string, expirationTime: number): Promise<string> {
        console.log(`Mock: Signing download URL for ${filePath}`);
        return `https://storage.googleapis.com/mock-bucket/${filePath}?token=mock-signed-url`;
    }
}

export {
    CloudHTTPv2,
    Ctx,
    Logger,
    OutputServerEventStream,
    RPCReflect,
};

export const loadModulesDynamically = (path: string) => {
    // Simplified implementation
    console.log(`Loading modules from ${path}`);
};

export const registry = {
    exportAll: () => ({}),
    exportGrouped: () => ({}),
    allHandsOnDeck: async () => {},
};
