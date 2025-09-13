import Bee from "bee-queue";
import DummyJob from "../app/jobs/DummyJob";
import redisConf from "../config/redis";
import NewEmail from "../app/jobs/NewEmailJob";

const jobs = [DummyJob, NewEmail];

class Queue {
    constructor() {
        this.queues = {};
        this.init();
    }
    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConf
                }),
                handle,
            };
        });
    }
    add(queue, job) {
        return this.queues[queue].bee.createJob(job).save();
    }
    processQueue() {
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];
            bee.on("failed", this.handleFailure).process(handle);
        });
    }
    handleFailure(job, err) {
        if (process.env.NODE_ENV === "development") {
            console.error(`Queue ${job.queue.name}: FAILED`, err);
        }

    }
}

export default new Queue();