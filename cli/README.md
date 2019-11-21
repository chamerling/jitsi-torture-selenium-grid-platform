## Install

```
npm install
```

## Run

```
NODE_SIZE=10 LOCAL_IP=192.168.1.2 HUB_HOST=192.168.3.4 NODE_PORT=5000 node ./bin/launch.js
```

Where:

- NODE_SIZE (default 2) is the number of Selenium nodes to start
- LOCAL_IP (default localhost) is the local machine IP address the Selenium Hub can reach
- HUB_HOST (default localhost) is the hub IP address the current nodes will register to
- NODE_PORT (default 5000) is the first port used to create node. Will be incremented for each node in NODE_SIZE