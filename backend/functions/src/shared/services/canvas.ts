import { AsyncService } from 'civkit';
import { singleton } from 'tsyringe';
import { Logger } from '../logger';

@singleton()
export class CanvasService extends AsyncService {
    logger = new Logger('CHANGE_LOGGER_NAME')

    constructor() {
        super();
    }

    override async init() {
        this.logger.info('CanvasService initialized');
        this.emit('ready');
    }

    async loadImage(url: string): Promise<any> {
        console.log(`Mock: Loading image from ${url}`);
        return { width: 1000, height: 1000 };
    }

    fitImageToSquareBox(img: any, size: number): any {
        console.log(`Mock: Fitting image to square box of size ${size}`);
        return { width: size, height: size };
    }

    async canvasToBuffer(canvas: any, format: string): Promise<Buffer> {
        console.log(`Mock: Converting canvas to buffer with format ${format}`);
        return Buffer.from('mock image data');
    }
}
