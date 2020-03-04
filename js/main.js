
window.onload = function () {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
	try {
	    tizen.application.getCurrentApplication().exit();
	} catch (ignore) {
	}
    });

    // Sample code
    var textbox = document.querySelector('.contents');
    textbox.addEventListener("click", function(){
    	box = document.querySelector('#textbox');
    	box.innerHTML = box.innerHTML == "Basic" ? "Sample" : "Basic";
    });
    
    console.log("[ZK_TEST] 1");
    var localMsgPort = tizen.messageport.requestLocalMessagePort('UI_PORT');
    console.log("[ZK_TEST] 2");
    function onreceived(data, remoteMsgPort) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].value == 'SERVICE_EXIT') {
                localMsgPort.removeMessagePortListener(watchId);
                tizen.application.getCurrentApplication().exit();
            }
            if (data[i].value == 'SERVICE_PING') {
            	console.log('UI receive ping ');
            }
        }
    }
    var watchId = localMsgPort.addMessagePortListener(onreceived);
    console.log("[ZK_TEST] 3");
    
    tizen.application.launchAppControl(new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/service'), 'VJF80o4fXi.service', function() {
        console.log('Launch Service succeeded');

        var remoteMsgPort;
        console.log("[ZK_TEST] 4");
        setInterval(function(){
        	console.log("UI APP print;");
        	if(remoteMsgPort == undefined) {
                try {
                    remoteMsgPort = tizen.messageport.requestRemoteMessagePort('VJF80o4fXi.service', 'SERVICE_PORT');
                } catch (e) {
            		console.log("exception -> " + e.message);
            		remoteMsgPort = null;
            	}
        	}
        	remoteMsgPort.sendMessage([{key: 'key', value: 'SERVICE_PING'}]);
        }, 1000);
    }, function(e) {
        console.log('Launch Service failed: ' + e.message);
    });
};
