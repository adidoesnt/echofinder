import { Client, type Message } from 'whatsapp-web.js';
import { type Logger as Log4js } from 'log4js';
import { Logger } from 'components/logger';
import qrcode from 'qrcode-terminal';
import puppeteer from 'puppeteer';

const { BOT_CHAT_IDS = '', DEBUG_MODE = 'TRUE' } = process.env;

export type MessageMetadata = {
    text: string;
    chatId: string;
    date: number;
    messageId: string;
    userId: string;
    firstName: string;
    lastName?: string;
};

export class WhatsApp {
    protected client: Client;
    protected logger: Log4js;
    protected chatIds: Array<string>;

    protected constructor() {
        this.logger = Logger.getLogger('Whatsapp');
        this.client = new Client({});
        this.chatIds = `${BOT_CHAT_IDS}`.split(',');
    }

    protected registerEvents() {
        this.client.on('qr', (qr) => {
            this.logger.info('received whatsapp qr code', qr);
            qrcode.generate(qr, { small: true });
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
        await puppeteer.launch({ headless: true });
        this.registerEvents();
        await this.client.initialize();
    }

    protected getFullName(name: string): Record<string, string | undefined> {
        const [firstName, lastName] = name.split(' ');
        return {
            firstName,
            lastName,
        };
    }

    private validateChatId(chatId: string) {
        if (DEBUG_MODE.toUpperCase() === 'TRUE') return true;
        if (!chatId) {
            this.logger.warn('Chat ID is required');
            return false;
        } else if (typeof chatId !== 'string' && typeof chatId !== 'number') {
            this.logger.warn('chatId must be a string or number');
            return false;
        } else if (this.chatIds.includes(chatId)) {
            this.logger.warn('Chat ID does not match bot configuration');
            return false;
        }
        return true;
    }

    protected getMessageMetadata(message: Message): MessageMetadata {
        const { from, body, timestamp, id, author, _data } =
            message as Message & { _data: { notifyName: string } };
        const { _serialized: messageId } = id;
        const { notifyName } = _data;
        const { firstName, lastName } = this.getFullName(notifyName);
        let metadata = {
            text: body,
            chatId: from,
            date: timestamp,
            messageId,
            userId: author as string,
            firstName: firstName as string,
            lastName,
        };
        return metadata;
    }

    protected async processMessage(
        message: Message,
    ): Promise<Message | undefined> {
        const { chatId } = this.getMessageMetadata(message);
        if (!this.validateChatId(chatId)) return;
        this.logger.info('Received whatsapp message', message);
    }
}
