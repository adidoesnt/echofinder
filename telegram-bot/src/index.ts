import { Bot } from 'components/bot';
import { Server } from 'components/server';

const { NODE_ENV: env = 'DEV' } = process.env;

const bot = Bot.getInstance();
bot.initialize();

if (env !== 'DEV') {
    const server = Server.getInstance();
    server.setupBot(bot);
}
