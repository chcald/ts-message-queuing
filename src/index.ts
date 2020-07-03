import * as http from 'http';
import App from './app';
import { Logger } from '../logger/logger';
import { Squiss, Message } from 'squiss-ts';

const awsConfig = {
  accessKeyId: `dummy`,
  secretAccessKey: `dummy`,
  region: `dummy`,
  endpoint: `http://localhost:9325`
};

const squiss = new Squiss({
  awsConfig,
  queueName: 'my-sqs-queue',
  bodyFormat: 'json',
  maxInFlight: 15
});

const port = 5001;

App.set(`port`, port);
const server = http.createServer(App);
server.listen(port);

const logger = new Logger();

squiss.on('message', (message: Message) => {
  console.log(`${message.body.name} says: ${JSON.stringify(message.body.message)} and has attripute p1 with value ${message.attributes.p1}`);
  message.del();
});

squiss.start().then(()=> console.log('sqs started')).catch((err)=>console.log('imposible to connect',err))


server.on(`listening`, function (): void {
  const addr = server.address();
  const bind = typeof addr === `string` ? `pipe ${addr}` : `port ${addr ? addr.port : `no port`}`;
  logger.info(`Listening on ${bind}`);
});



module.exports = App;
