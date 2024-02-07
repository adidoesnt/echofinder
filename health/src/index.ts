import axios, { AxiosError } from "axios";
import { logger } from "components/logger";

const { SERVER_LIST = "", PING_INTERVAL = "300000" } = process.env;
const { defaultLogger, errorLogger } = logger;
const servers: Array<string> = SERVER_LIST.split(",");
const pingInterval = Number(PING_INTERVAL);

const pingServers = async () => {
    const promises = servers.map(async (server: string) => {
        defaultLogger.info(`Checking server health ${server}`);
        try {
            await axios.get(server);
        } catch (error) {
            if((error as AxiosError).response?.status) {
                defaultLogger.info(`Server at ${server} is healthy.`);
            } else {
                errorLogger.error(`Server at ${server} is down.`);
            }
        }
    });
    await Promise.all(promises);
};

setInterval(pingServers, pingInterval);
