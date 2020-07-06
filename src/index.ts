import * as http from 'http';
import App from './app';
import { Logger } from '../logger/logger';

const port = 5001;

App.set(`port`, port);
const server = http.createServer(App);
server.listen(port);

const logger = new Logger();

server.on(`listening`, function (): void {
  const addr = server.address();
  const bind = typeof addr === `string` ? `pipe ${addr}` : `port ${addr ? addr.port : `no port`}`;
  logger.info(`Listening on ${bind}`);
});

module.exports = App;
