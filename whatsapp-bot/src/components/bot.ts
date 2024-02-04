import { type Message } from 'whatsapp-web.js';
import { WhatsApp } from 'components/whatsapp';
import { MESSAGE } from 'constants/message';

export class Bot extends WhatsApp {
    private static instance: Bot;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!Bot.instance) {
            Bot.instance = new Bot();
        }
        return Bot.instance;
    }

    protected async processMessage(message: Message) {
        this.logger.info('received whatsapp message', message);
        const { text, chatId, messageId } = this.getMessageMetadata(message);
        const tokens = text.split(' ');
        const command = tokens[0];
        let reply: string = "";
        console.log({ text, chatId, messageId });
        switch (command) {
            case '/start':
            case '/help':
                reply = MESSAGE.HELP;
                break;
            default:
                await this.saveMessage(message);
        }
        if (reply.trim() !== "") {
            this.logger.info("sending reply", reply);
            return await this.client.sendMessage(chatId, reply, {
                quotedMessageId: messageId,
            });
        } else {
            return;
        }
    }

    async saveMessage(message: Message): Promise<void> {
        const metadata = this.getMessageMetadata(message);
        this.logger.info(metadata);
    }
}
