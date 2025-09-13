import "dotenv/config";
import express from "express";
import routes from "./routes";
import "./database";
import Youch from "youch";
import "express-async-errors";
import * as Sentry from "@sentry/node";
import sentryConf from "./config/sentry";

class App {
    constructor() {
        this.server = express();
        Sentry.init(sentryConf);
        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }
    middlewares() {
        Sentry.profiler.startProfiler();
        this.server.use(express.json());

    }
    routes() {
        Sentry.setupExpressErrorHandler(this.server);
        this.server.use(routes);
    }
    exceptionHandler() {
        this.server.use(async (err, req, res, next) => {
            if (process.env.NODE_ENV === "development") {
                const erros = await new Youch(err, req).toJSON();
                return res.status(500).json(erros);
            }
            return res.status(500).json({ error: "Internal server error" });
        });
    }
}

export default new App().server;
