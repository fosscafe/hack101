//social media redirect.js
var cookieId=getTenantId()+getTenantUserId()+getAssetId();
var reportCookie=JSON.parse(getCookie(cookieId));
setCookie("cookieId",cookieId);

var defaultCookieValue={
	"status":"",
	"referralurl":window.document.referrer
}

if(getCookie(cookieId)==null){	
	setCookie(cookieId,JSON.stringify(defaultCookieValue));
}
var newCookieValue={
	"status":"new",
	"referralurl":window.document.referrer
};
var completeCookieValue={
	"status":"new",
	"referralurl":window.document.referrer
};
var finalCookieValue={
	"status":"complete",
	"referralurl":window.document.referrer
};
/*console.log(reportCookie);*/	
/*code for mf redirect starts*/
var genericCookieValue={
	"isReferrer":"true",
	"referralurl":window.document.referrer
};

function enableSocialMediaCookiesForMF(){
	
	setCookie(cookieId,JSON.stringify(genericCookieValue));
	setCookie('referralurl',window.document.referrer);
	
}

/*code for mf redirect ends*/
function enableSocialMediaCookies(){
		/*console.log(reportCookie);*/
		if((reportCookie==null)){			
			setCookie(cookieId,JSON.stringify(newCookieValue));
			setCookie('referralurl',window.document.referrer);
		}else if(reportCookie.status=='new'){				
			setCookie(cookieId,JSON.stringify(completeCookieValue));
		}else if(reportCookie.status=="complete"){			
			setCookie(cookieId,JSON.stringify(finalCookieValue));
		}
	
	
	/*if((getCookie('status')!='new')&&(getCookie('status')!='complete')){
		setCookie("status","new");
		setCookie("referralurl",window.document.referrer); //add window.document.referrer instead of hardcoded string
	}else if((getCookie('status')=="new")){		
		setCookie("referralurl",getCookie('referralurl'));
		setCookie("status","complete");
	}else if((getCookie('status')=="complete")){
		setCookie("referralurl",window.document.referrer);
		setCookie("status","complete");
	}*/
	/*if((getCookie('status')!='new')&&(getCookie('status')!='complete')){
		setCookie("status","new");
		if(window.document.referrer==''){
			setCookie("referralurl","via email");
		}else{
			setCookie("referralurl",window.document.referrer);
		}
		 //add window.document.referrer instead of hardcoded string
	}else if((getCookie('status')=="new")){		
		if(window.document.referrer==''){
			setCookie("referralurl","via email");
		}else{
			setCookie("referralurl",window.document.referrer);
		}*/
		/*setCookie("status","complete");*/
	/*}else if((getCookie('status')=="complete")){
		if(window.document.referrer==''){
			setCookie("referralurl","via email");
		}else{
			setCookie("referralurl",window.document.referrer);
		}
		setCookie("status","complete");
	}*/
}
/*alert(getCookie('status'));
alert(getCookie('referralurl'));*/

/*console.log(JSON.parse(getCookie(cookieId)).status);*/
/*if((getCookie('status')==null)){	
	setCookie("status","");
	setCookie("referralurl","");
}*/


/*alert(getCookie('status'));
alert(getCookie('referralurl'));*/
function setCookie (name, value) {
	var argv = setCookie.arguments;
	var argc = setCookie.arguments.length;
	var expires = (2 < argc) ? argv[2] : null;
	var path = (3 < argc) ? argv[3] : null;
	var domain = (4 < argc) ? argv[4] : null;
	var secure = (5 < argc) ? argv[5] : false;
	document.cookie = name + "=" + escape (value) +
	((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
	((path == null) ? "" : ("; path=" + path)) +
	((domain == null) ? "" : ("; domain=" + domain)) +
	((secure == true) ? "; secure" : "");
}
function getCookies(){
  var pairs = document.cookie.split(";");
  var cookies = {};
  for (var i=0; i<pairs.length; i++){
    var pair = pairs[i].split("=");
    cookies[pair[0]] = unescape(pair[1]);
  }
  return cookies;
}
function getCookie (name) {
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen) {
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg)
			return getCookieVal (j);
			i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0) 
			break; 
	}
	return null;
}
function getCookieVal (offset) {
	var endstr = document.cookie.indexOf (";", offset);
	if (endstr == -1)
		endstr = document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
}