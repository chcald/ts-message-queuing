import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Logger } from '../logger/logger';


class App {
  public express: express.Application;
  public logger: Logger;
  public squiss: any;

  // array to hold users
  public covertedValues: any[];

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.covertedValues = [{ amout: 2000, currency: `dolar`, toConvert: `peso`, userName: `username1` }];
    this.logger = new Logger();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.express.get(`/`, (req, res, next) => {
      res.send(`Typescript App works!!`);
    });

    // covertedValues route
    this.express.use(`/api`, (req, res) => {
      res.json(this.covertedValues);
    
    });

    // handle undefined routes
    this.express.use(`*`, (req, res, next) => {
      res.send(`Make sure url is correct!!!`);
    });
  }
}

export default new App().express;
