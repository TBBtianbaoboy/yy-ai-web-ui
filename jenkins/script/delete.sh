#!/bin/sh
docker stop jenkins && docker rm jenkins
docker rmi opt_jenkins:latest
