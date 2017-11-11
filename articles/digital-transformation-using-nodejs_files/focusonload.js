//focusonload.js

/*added by rajesh to add common functions to execute every time report loads */
var url=window.location.href;
var finalURL=url.split('#');
var userParams=finalURL[1].split('/');

function getTenantId(){  
  return userParams[2];
}
function getTenantUserId(){
  return userParams[3];
}
function getAssetId(){
  var assetId=decodeURI(userParams[4]);
  return assetId.replace(/'/g, "");
}
function includeTracker(){
        if(window.location.href.indexOf("editor") > -1) {
            
        }else{
            
            var sc = document.createElement('script');
          sc.src = 'utils/tracker.js';
          sc.type = 'text/javascript';
          if(typeof sc['async'] !== 'undefined') {
             sc.async = true;
          }  
          document.getElementsByTagName('head')[0].appendChild(sc);
        }

    }



function disableResponsiveness(){
    if(window.location.href.indexOf("editor") > -1) {
      
        $('.animated_div').css('display','none');
        $('.page-container').removeClass('page-container');
        $('.content-wrapper-body').css('width','693px  !important');
        
    }else{
      $('.content-wrapper-body').addClass('content-wrapper-body-mobile');
      

    }

}

function enableTracker(tenantId,userId,assetId){
    
    


     var sc = document.createElement('script');
          sc.src = 'utils/tracker.js';
          sc.type = 'text/javascript';
          if(typeof sc['async'] !== 'undefined') {
             sc.async = true;
          }  
          document.getElementsByTagName('head')[0].appendChild(sc);
          localStorage.setItem('tenantId',tenantId);
          localStorage.setItem('userId',userId);
          localStorage.setItem('assetId',assetId);

}
var userip;
 function writeLocalStorage() {
  			var absUrl =  window.location.href;
	    	var referrer = window.document.referrer;
	    	var localIp;
	    	//insert IP addresses into the local storage
            getIPs(function(ip){
                
                //local IPs
                if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/))
                    localIp=ip;
                localStorage.setItem('localIp',localIp);
            });
           /* alert(absUrl);
            alert(referrer);
            alert(localIp);*/
	    	localStorage.setItem('absurl',absUrl);
	    	localStorage.setItem('referrer', referrer);
	    	localStorage.setItem('userIp', userip);
            

		}

		function getIPs(callback){
                var ip_dups = {};
                //compatibility for firefox and chrome
                var RTCPeerConnection = window.RTCPeerConnection
                    || window.mozRTCPeerConnection
                    || window.webkitRTCPeerConnection;
                var useWebKit = !!window.webkitRTCPeerConnection;
                //bypass naive webrtc blocking using an iframe
                if(!RTCPeerConnection){
                    //NOTE: you need to have an iframe in the page right above the script tag
                    //
                    //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
                    //<script>...getIPs called in here...
                    //
                    var win = iframe.contentWindow;
                    RTCPeerConnection = win.RTCPeerConnection
                        || win.mozRTCPeerConnection
                        || win.webkitRTCPeerConnection;
                    useWebKit = !!win.webkitRTCPeerConnection;
                }
                //minimal requirements for data connection
                var mediaConstraints = {
                    optional: [{RtpDataChannels: true}]
                };
                var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
                //construct a new RTCPeerConnection
                var pc = new RTCPeerConnection(servers, mediaConstraints);
                function handleCandidate(candidate){
                    //match just the IP address
                    var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
                   try{
                	   var ip_addr = ip_regex.exec(candidate)[1];
                   
                   
                    //remove duplicates
                    if(ip_dups[ip_addr] === undefined)
                        callback(ip_addr);
                    ip_dups[ip_addr] = true;
                    
                   }catch(e){
                	   //console.log(JSON.stringify(e));
                   }
                }
                //listen for candidate events
                pc.onicecandidate = function(ice){
                    //skip non-candidate events
                    if(ice.candidate)
                        handleCandidate(ice.candidate.candidate);
                };
                //create a bogus data channel
                pc.createDataChannel("");
                //create an offer sdp
                pc.createOffer(function(result){
                    //trigger the stun server request
                    pc.setLocalDescription(result, function(){}, function(){});
                }, function(){});
                //wait for a while to let everything done
                setTimeout(function(){
                    //read candidate info from local description
                    var lines = pc.localDescription.sdp.split('\n');
                    lines.forEach(function(line){
                        if(line.indexOf('a=candidate:') === 0)
                            handleCandidate(line);
                    });
                }, 1000);
            }
       