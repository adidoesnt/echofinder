import { Client, type Message } from 'whatsapp-web.js';
import { type Logger as Log4js } from 'log4js';
import { Logger } from 'components/logger';
import { generate } from 'qrcode-terminal';
import { launch } from 'puppeteer';

export class WhatsApp {
    protected client: Client;
    protected logger: Log4js;

    protected constructor() {
        this.logger = Logger.getLogger('Whatsapp');
        this.client = new Client({});
    }

    protected registerEvents() {
        this.client.on('qr', (qr) => {
            this.logger.info('received whatsapp qr code', qr);
            generate(qr, { small: true });
        });
        this.client.on('authenticated', (session) => {
            this.logger.info('successfully authenticated session', session);
        });
        this.client.on('auth_failure', (message) => {
            this.logger.error('session authentication unsuccessful', message);
        });
        this.client.on('ready', () => {
            this.logger.info('whatsapp client is ready');
        });
        this.client.on('disconnected', (reason) => {
            this.logger.info('whatsapp client was disconnected', reason);
        });
        this.client.on('message', async (message) => {
            await this.processMessage(message);
        });
    }

    async initialize() {
        await launch({ headless: true });
        this.registerEvents();
        await this.client.initialize();
    }

    protected async processMessage(message: Message) {
        this.logger.info('received whatsapp message', message);
    }
}
