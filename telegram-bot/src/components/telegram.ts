import Bot, { type Message } from 'node-telegram-bot-api';

const { TELEGRAM_BOT_TOKEN: token = '', NODE_ENV: env = 'DEV' } = process.env;

export class Telegram {
    private static instance: Telegram;
    protected bot: Bot;

    protected constructor() {
        this.bot = new Bot(token, { polling: env === 'DEV' });
    }

    static getInstance(): Telegram {
        if (!Telegram.instance) {
            Telegram.instance = new Telegram();
        }
        return Telegram.instance;
    }

    initialize(): void {
        this.bot.on('message', (message: Message) => {
            this.processMessage(message);
        });
    }

    async processMessage(message: Message): Promise<void> {
        const { text, chat } = message;
        const { id: chatId } = chat;
        this.bot.sendMessage(chatId, `Received message ${text}`);
    }
}
