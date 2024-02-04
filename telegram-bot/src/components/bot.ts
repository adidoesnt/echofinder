import { type Logger as Log4js } from 'log4js';
import Client, { type Message } from 'node-telegram-bot-api';
import { Logger } from 'components/logger';
import { MESSAGE } from 'constants/message';
import { ERROR } from 'constants/error';
import { ApiClient } from './apiClient';

const { TELEGRAM_BOT_TOKEN: token = '', NODE_ENV: env = 'DEV' } = process.env;

export class Bot {
    private static instance: Bot;
    protected client: Client;
    protected logger: Log4js;
    private apiClient: ApiClient;

    protected constructor() {
        this.client = new Client(token, { polling: env === 'DEV' });
        this.apiClient = ApiClient.getInstance();
        this.logger = Logger.getLogger('Bot');
    }

    static getInstance(): Bot {
        if (!Bot.instance) {
            Bot.instance = new Bot();
        }
        return Bot.instance;
    }

    initialize(): void {
        this.logger.info('Initialising bot');
        this.client.onText(/\/(start|help)/, (message: Message) => {
            this.help(message);
        });
        this.client.on('message', (message: Message) => {
            this.saveMessage(message);
        });
    }

    getMessageMetadata(message: Message): Record<string, any> {
        const { text, chat, date, message_id, from } = message;
        const { id } = chat;
        let metadata: Record<string, any> = {
            message_content: text,
            chat_id: `${id}`,
            sent_at: new Date(date).toISOString(),
            message_id: `${message_id}`,
        };
        if (from) {
            const {
                id: sender_id,
                first_name: firstname,
                last_name: lastname,
                username,
            } = from;
            metadata = {
                ...metadata,
                sender_id: `${sender_id}`,
                firstname,
                lastname,
                username,
            };
        } else {
            const error = new Error(ERROR.NO_FROM);
            this.logger.error(error);
        }
        return metadata;
    }

    async help(message: Message) {
        const { chatId } = this.getMessageMetadata(message);
        this.client.sendMessage(chatId, MESSAGE.HELP);
    }

    async saveMessage(message: Message): Promise<void> {
        const metadata = this.getMessageMetadata(message);
        this.logger.info(
            `Saving message with metadata:`,
            JSON.stringify(metadata),
        );
        try {
            await this.apiClient.post('/messages', [metadata]);
        } catch (error) {
            this.logger.error(error);
        }
    }
}
