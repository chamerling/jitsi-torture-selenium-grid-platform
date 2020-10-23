# Jitsi benchmark platform

The goal of this project is to setup a correct platform to benchmark Jitsi using jitsi-meet-torture and Selenium Grid.
To run "benchmarks", a platform running Selenium grid is needed. The current project provides docker-compose files and scripts to setup this platform correctly: Selenium Grid is launched on several machines, one running the Selenium Hub + some Selenium nodes, the others running only Selenium nodes which are registered in the Selenium Grid Hub.

## Installation

For each machine:

1. Install `git, docker, docker-compose, node` on your machine(s)
2. Clone this repository
    ```sh
    git clone https://github.com/chamerling/jitsi-torture-selenium-grid-platform.git
    ```
3. Create `/usr/share/jitsi/resources` folder
    ```sh
    mkdir /usr/share/jitsi/resources
    ```
4. Save files into `/usr/share/jitsi/resources`:
    ```sh
    cd /usr/share/jitsi/resources
    wget https://github.com/jitsi/jitsi-meet-torture/blob/master/resources/fakeAudioStream.wav?raw=true
    mv fakeAudioStream.wav?raw=true fakeAudioStream.wav
    wget https://media.xiph.org/video/derf/y4m/FourPeople_1280x720_60.y4m
    ```

On the machine which will run the Selenium Grid Hub

1. Install `git, docker, docker-compose, java8 and mvn`
2. Clone the `jitsi-meet-torture` repository
    ```sh
    git clone https://github.com/jitsi/jitsi-meet-torture.git
    ```
3. Repeat the same steps as for the Selenium nodes above in case you also want to run Selenium nodes on this machine

## Launch

### Selenium Grid Hub

This repository contains seleveral folders. To launch the Selenium Grid Hub, go to `./selenium/hub` then:

```sh
docker-compose up --scale chrome=10
```

This will launch Selenium Hub and 10 Selenium nodes running Chrome browser. Adapt if you need more or less. Each node will register to the hub automatically.
Docker will also launch a `google/cadvisor` container to monitor containers. This will be detailled later.

### Selenium Grid Nodes

You can launch the nodes by hand by giving the right parameters to `docker run` or you can use the little `node` script which allows to launch N nodes and register them in the hub automatically:

```sh
docker pull selenium/node-chrome:3.141.59-xenon
cd cli
NODE_SIZE=10 LOCAL_IP=192.168.1.2 HUB_HOST=192.168.1.1 NODE_PORT=5000 node ./bin/launch.js
```

Where

- NODE_SIZE (default 2) is the number of Selenium nodes to start
- LOCAL_IP (default localhost) is the local machine IP address the Selenium Hub can reach
- HUB_HOST (default localhost) is the hub IP address the current nodes will register to
- NODE_PORT (default 5000) is the first port used to create node. Will be incremented for each node in NODE_SIZE

The command above will launch 10 Selenium nodes with Chrome browser, expose node on http://192.168.1.2:5000 to http://192.168.1.2:5009 (10 nodes) and register them to the Selenium Grid hub running available at 192.168.1.1.

**Note**: It is important that the hub and the nodes ports are exposed and so reachable. If not, the nodes will be able to register but will not be able to launch anything if the hub can not call the APIs.

### jitsi-torture

While you can launch all the jitsi-torture tests by following the `README` from the jitsi-torture folder, we focus on launching the `MalleusJitsificus` test suite which will create N videoconference rooms with M attendees in each. This can be achieve from this command line:

```sh
mvn -Dthreadcount=1 -Dorg.jitsi.malleus.conferences=3 -Dorg.jitsi.malleus.participants=5 -Dorg.jitsi.malleus.senders=5 -Dorg.jitsi.malleus.duration=600 -Dorg.jitsi.malleus.room_name_prefix=openpaastest -Dremote.address="http://192.168.1.1:4444/wd/hub" -Djitsi-meet.tests.toRun=MalleusJitsificus -Dwdm.gitHubTokenName=jitsi-jenkins -Dremote.resource.path=/usr/share/jitsi -Djitsi-meet.instance.url=https://jitsi.localhost -Djitsi-meet.isRemote=true test
```

Some important points/explanations:

- This will create 3 conferences with 5 attendees in each for a period of 10 minutes by using the Selenium Grid hub running on http://192.168.1.1:4444/wd/hub and by using the Jitsi instance running on https://jitsi.localhost.
- The `remote.resource.path` parameter points to `/usr/share/jitsi` where we dowloaded the video and audio files before (these folders are mounted as volumes in the docker containers).They will be used by Chrome browsers to 'fake' audio and video streams (no webcam on Selenium nodes). By 'fake', it means that these are the streams which will be used and sent to remote attendees. If you want to test with higher/lower resolution, replace the `y4m` file with the ones you need, but keep the same name until jitsi-torture is not able to take a file name as input.
