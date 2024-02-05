import express, { type Express, type Request, type Response } from 'express';
import { json } from 'body-parser';
import type { Bot } from './bot';
import { type Logger as Log4js } from 'log4js';
import { Logger } from './logger';

const { PORT: port, TELEGRAM_BOT_TOKEN: token = '' } = process.env;

export class Server {
    static instance: Server;
    private app: Express;
    private readonly port: string | number;
    private logger: Log4js;

    private constructor() {
        this.logger = Logger.getLogger('Server');
        this.logger.info('Initialising server');
        this.app = express();
        this.port = port ?? 3000;
        this.app.use(json());
        this.app.get('/health', (_: Request, res: Response) => {
            res.status(200).send('OK');
        });
        this.app.listen(this.port, () => {
            this.logger.info(`Server running on port ${this.port}`);
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
