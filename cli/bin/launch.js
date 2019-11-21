#!/usr/bin/env node

const util = require("util");
const { exec } = require("child_process");
const execPromise = util.promisify(exec);
const image = "selenium/node-chrome:3.141.59-xenon";

const NODE_SIZE = process.env.NODE_SIZE || 2;
const LOCAL_IP = process.env.LOCAL_IP || "localhost";
const HUB_PORT = process.env.HUB_PORT || 4444;
const HUB_HOST = process.env.HUB_HOST || "localhost";
const NODE_PORT = process.env.NODE_PORT || 5000;

const commands = Array(Number(NODE_SIZE)).fill(null).map((u, i) => `docker run -d -p ${Number(NODE_PORT) + i}:5555 -e HUB_HOST=${HUB_HOST} -e HUB_PORT=${HUB_PORT} -e REMOTE_HOST=http://${LOCAL_IP}:${Number(NODE_PORT) + i} -v /dev/shm:/dev/shm -v /usr/share/jitsi:/usr/share/jitsi ${image}`);

Promise.all(commands.map(command => {
  console.log(command);
  return execPromise(command).then(({stderr, stdout}) => {
    if (stderr) {
      console.error("Failed to launch container", stderr);
    }

    console.log("Container created", stdout);
  })
}));