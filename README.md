# TS-message-queuing
Service that receives messages from REST and puts them in the SQS queue

Example message to send:

http://localhost:5001/api?name=Cristian&email=cristianhcalderon@gmail.com&amount=2000&currency=ARG

```
CMD [ "./wait.sh" , "lcoalhost:3000", "--", "node", "index.js" ]
```
