import ping from "ping";
import { logger } from "components/logger";

const { SERVER_LIST = "", PING_INTERVAL = "300000" } = process.env;
const { defaultLogger, errorLogger } = logger;
const servers: Array<string> = SERVER_LIST.split(",");
const pingInterval = Number(PING_INTERVAL);

const pingServers = () => {
    servers.forEach((server: string) => {
        ping.promise
            .probe(server)
            .then((result) => {
                const { alive } = result;
                if (alive) {
                    const { time } = result;
                    defaultLogger.info(
                        `Received response from ${server} (Round-trip time: ${time} ms)`
                    );
                } else {
                    errorLogger.error(`No response from ${server}`);
                }
            })
            .catch((error) => {
                errorLogger.error(`Error pinging ${server}: ${error}`);
            });
    });
};

setInterval(pingServers, pingInterval);
