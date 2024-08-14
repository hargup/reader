import { AsyncService } from 'civkit';
import { singleton } from 'tsyringe';
import { Logger } from '../logger';

@singleton()
export class SecretExposer extends AsyncService {
    logger = new Logger('CHANGE_LOGGER_NAME')

    BRAVE_SEARCH_API_KEY: string = 'mock_brave_search_api_key';

    constructor() {
        super();
    }

    override async init() {
        // Mock initialization
        this.logger.info('SecretExposer initialized');
        this.emit('ready');
    }
}
