import { describe, it, expect, spyOn, beforeAll, mock } from 'bun:test';
import { Bot } from 'components/bot';
import { Server } from 'components/server';
import request from 'supertest';

describe('Server', () => {
    let server: Server;
    let bot: Bot;

    spyOn(Bot.prototype, 'processUpdate').mockResolvedValue({
        status: 200,
    } as unknown as never);

    beforeAll(() => {
        // @ts-ignore
        bot = new Bot();
        server = Server.getInstance();
        server.setupBot(bot);
    });

    it('should return OK for GET /health', async () => {
        // @ts-ignore
        const response = await request(server.app).get('/health');
        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    });
});
