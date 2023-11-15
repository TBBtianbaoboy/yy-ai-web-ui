#!/bin/sh
cd ../jenkins_mount/updates
sed -i 's#http://www.google.com#https://www.baidu.com#g' default.json
sed -i 's#https://updates.jenkins.io/download#http://updates.jenkins.io/download#g' default.json
echo "recover successful!"

echo "restart jenkins..."
cd ../../script
if [ -f 'restart_jenkins.sh' ];then
	./restart_jenkins.sh
	echo "restart jenkins successful!"
else
	echo "restart jenkins faild"
fi

