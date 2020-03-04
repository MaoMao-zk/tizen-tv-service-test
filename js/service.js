
var remoteMsgPort;

console.error("before require");
const https = require('https');
console.error("after require");


module.exports.onStart = function() {
    console.log('service start');

    var localMsgPort = tizen.messageport.requestLocalMessagePort('SERVICE_PORT');

    function onreceived(data, remoteMsgPort) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].value == 'SERVICE_EXIT') {
                localMsgPort.removeMessagePortListener(watchId);
                tizen.application.getCurrentApplication().exit();
            }
            if (data[i].value == 'SERVICE_PING') {
            	console.log('service receive ping ');
            }
        }
    }
    var watchId = localMsgPort.addMessagePortListener(onreceived);
    
    setInterval(function(){
    	console.log("SERVICE APP print;");
    	if(remoteMsgPort == null) {
    		try {
        		remoteMsgPort = tizen.messageport.requestRemoteMessagePort('VJF80o4fXi.ServiceTest', 'UI_PORT');
    		} catch (e) {
    		    console.error("can't connect UI, " + e.message);
    		    remoteMsgPort = null;
			}
    	}
    	try {
        	remoteMsgPort.sendMessage([{key: 'key', value: 'SERVICE_PING'}]);
    	} catch (e) {
		    console.error("can't send to UI, " + e.message);
		}
    }, 1000);
    
    console.error("ZK_TEST before get http");
    https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', function(resp) {
        console.error("ZK_TEST got http");
        var data = '';

        // A chunk of data has been recieved.
        resp.on('data', function(chunk) {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', function() {
          console.error(JSON.parse(data).explanation);
        });
    }).on("error", function(err) {
      console.error("Error: " + err.message);
    });

        /*
    https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        console.error(JSON.parse(data).explanation);
      });

    }).on("error", (err) => {
      console.error("Error: " + err.message);
    });
    */
}