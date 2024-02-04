import { type Message } from 'whatsapp-web.js';
import { WhatsApp } from 'components/whatsapp';

const { BOT_CHAT_IDS = '', DEBUG_MODE = 'TRUE' } = process.env;

export class Bot extends WhatsApp {
    private static instance: Bot;
    private chatIds: Array<string>;

    private constructor() {
        super();
        this.chatIds = `${BOT_CHAT_IDS}`.split(',');
    }

    static getInstance() {
        if (!Bot.instance) {
            Bot.instance = new Bot();
        }
        return Bot.instance;
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

    protected async processMessage(message: Message) {
        if (!this.validateChatId(message.from)) return;
        this.logger.info('Received whatsapp message', message);
    }
}
