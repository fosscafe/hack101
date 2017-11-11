'use strict';

/**
* Factory for Dashboard
*/

reportsApp.factory('ChatRecordFactory', ['$http', '$rootScope', function($http, $rootScope) {

      // REST Service URL to manage Dashboard
	
	 
    // var client = new BinaryClient('ws://localhost:9001');
	var client;
     var recording = false;
     
      return {
    	  	client: client,
		      record: function(scope,context,searchType, callback) {
		    	  //client.on('open', function() {
		    	  	var handler = $rootScope.$on('notifying-service-event', callback);
		            scope.$on('$destroy', handler);	
		    	  	window.Stream = client.createStream();
		    	  	  
		    	  	recording = true;
	    	    	
	    	    	if (!navigator.getUserMedia)
	    	    	      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	    	    	    if (navigator.getUserMedia) {
	    	    	      navigator.getUserMedia({audio:true}, success, function(e) {
	    	    	        alert('Error capturing audio.');
	    	    	      });
	    	    	    } else alert('getUserMedia not supported in this browser.');
		    	  
		    	    function success(e) {
		    	     /*   var audioContext = window.AudioContext || window.webkitAudioContext;
		    	        var context = new audioContext();
*/
		    	        // the sample rate is in context.sampleRate
		    	        var audioInput = context.createMediaStreamSource(e);

		    	        var bufferSize = 2048;
		    	        var recorder = context.createScriptProcessor(bufferSize, 1, 1);

		    	        recorder.onaudioprocess = function(e){
		    	          if(!recording) return;
		    	          var left = e.inputBuffer.getChannelData(0);
		    	     //     console.log('left ',left);



		    	        /*  setTimeout(function(){ 

                             	window.Stream.write(convertoFloat32ToInt16(left));

		    	           }, 3000);

		    	           
*/
                          var buffVal = convertoFloat32ToInt16(left);
                          if(buffVal && buffVal.byteLength > 0){

                             window.Stream.write(buffVal);


                          }
		    	          //window.Stream.end();
		    	         
		    	          
		    	        }

		    	        audioInput.connect(recorder)
		    	        recorder.connect(context.destination); 
		    	      }


		    	    function convertoFloat32ToInt16(buffer) {
		    	        var l = buffer.length;
		    	        var buf = new Int16Array(l)

		    	        while (l--) {
		    	          buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
		    	        }
		    	        return buf.buffer
		    	      }
		    	    
		    	    window.Stream.on('data', function(data){
		    	    	console.log('google response ',data);
		    	    	if(searchType == 'chatBotSearch' && data.length > 0){
		    	    		scope.writingMessage = scope.writingMessage+data;
		    	    	} else if(searchType == 'normalSearch' && data.length > 0){
		    	    		scope.searchText = scope.searchText+data;
		    	    	}
		    	    	
				    	scope.$apply();
		    	    });
		    	    
		    	    return handler;
		      },
		      
		      /*notify: function() {
		            $rootScope.$emit('notifying-service-event');
		      }*/
		      
		     
      };
      
      return $this;
}]);
