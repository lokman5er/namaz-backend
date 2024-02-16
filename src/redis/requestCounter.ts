import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";

const client = createClient();

client.on("error", (err: Error) => console.log("request client error", err));

(async () => {
    await client.connect();
})();

async function countRequests(req: Request, res: Response, next: NextFunction) {
    const key: string = `requests:${req.path}`;
    try {
        const count = await client.incr(key);
        console.log(`request count for ${req.path}: ${count}`);
    } catch (err) {
        console.error("redis error", err);
    }
    next();
}

export { countRequests,client };
