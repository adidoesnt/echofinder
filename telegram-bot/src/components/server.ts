import express, { type Express } from 'express';
import { json } from 'body-parser';
import type { Bot } from './bot';

const { PORT: port = 3000, TELEGRAM_BOT_TOKEN: token = '' } = process.env;

export class Server {
    static instance: Server;
    private app: Express;
    private readonly port: number;

    private constructor() {
        this.app = express();
        this.port = Number(port);
        this.app.use(json());
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    setupBot(bot: Bot): void {
        this.app.post(`/${token}`, (req, res) => {
            bot.processUpdate(req, res);
            res.sendStatus(200);
        });
    }
}
