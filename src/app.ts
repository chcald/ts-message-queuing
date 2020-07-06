import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Logger } from '../logger/logger'; // to log everything that happens to used instead of console log
import { Squiss } from 'squiss-ts';
import { Response, Request } from 'express';
import Idata  from './Idata'
const URL_SQS_QUEUE = `http://localhost`;
const SQS_PORT = `9324`;


const awsConfig = {
  accessKeyId: `dummy`,
  secretAccessKey: `dummy`,
  region: `dummy`,
  endpoint: `${URL_SQS_QUEUE}:${SQS_PORT}`,
};
const squiss = new Squiss({
  awsConfig,
  queueName: `my-sqs-queue`,
  bodyFormat: `json`,
  maxInFlight: 15,
});

class App {
  public express: express.Application;
  public logger: Logger;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.logger = new Logger();

    squiss
      .createQueue()
      .then((queueUrl: string) => {
        console.log(`created queue ${queueUrl}`);
      })
      .catch((err) => console.log(`Queue already exist`, err));

    squiss
      .start()
      .then(() => console.log(`connection start ok`))
      .catch((err) => console.log(err));
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.express.get(`/`, (req: Request, res: Response) => {
      res.send(`ts-message-queuing service works!!`);
    });

    // send messages route
    this.express.use(`/api`, (req: Request, res: Response) => {
      // check that the parameters are correct
      const data: Idata = JSON.parse(JSON.stringify(req.query));
      const messageToSend = {
        name: `message`,
        message: data,
      };
      // just in case need to pass some props
      const propsToSend = {};

      squiss.sendMessage(messageToSend, 0, propsToSend).then(() => console.log(`message sent correctly`));

      res.json(req.query);
    });

    // handle undefined routes
    this.express.use(`*`, (req: Request, res: Response) => {
      res.send(`Make sure url is correct!!!`);
    });
  }
}

export default new App().express;
