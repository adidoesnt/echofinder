import { type Logger as Log4js } from 'log4js';
import Bot, { type Message } from 'node-telegram-bot-api';
import { Logger } from 'components/logger';

const { TELEGRAM_BOT_TOKEN: token = '', NODE_ENV: env = 'DEV' } = process.env;

export class Telegram {
    private static instance: Telegram;
    protected bot: Bot;
    private logger: Log4js;

    protected constructor() {
        this.bot = new Bot(token, { polling: env === 'DEV' });
        this.logger = Logger.getLogger('Telegram');
    }

    static getInstance(): Telegram {
        if (!Telegram.instance) {
            Telegram.instance = new Telegram();
        }
        return Telegram.instance;
    }

    initialize(): void {
        this.logger.info('initialising bot');
        this.bot.on('message', (message: Message) => {
            this.processMessage(message);
        });
    }

    async processMessage(message: Message): Promise<void> {
        const { text, chat } = message;
        this.logger.info(`processing message ${text}`);
        const { id: chatId } = chat;
        this.bot.sendMessage(chatId, `Received message ${text}`);
    }
}
