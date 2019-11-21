# selenium-grid

Launch Selenium Grid Hub and Nodes from docker-compose.

## Configure

Set environment in `node/.env` file:

- HUB_HOST: The hub IP address
- REMOTE_HOST: The public IP of the machine running the nodes

## Run

Launch 50 Chrome nodes:

```
sudo docker-compose up --scale chrome=50
```