//browser compatability.js

$(document).ready(function(){

  if(document.all && !window.atob){
    alert("YOU ARE USING A WEB BROWSER NOT SUPPORTED BY THIS WEBSITE. This means that some functionality may not work as intended.This may result in strange behaviors when browsing around.Use or upgrade/install Internet Explorer Ver IE 11.0 and higher or Google Chrome or Mozilla Firefox or Safari to take full advantage of this  website.Thank you!");
  }
  if (document.all && document.querySelector && !document.addEventListener) {
    //alert('IE8');
    alert("YOU ARE USING A WEB BROWSER NOT SUPPORTED BY THIS WEBSITE. This means that some functionality may not work as intended.This may result in strange behaviors when browsing around.Use or upgrade/install Internet Explorer Ver IE 11.0 and higher or Google Chrome or Mozilla Firefox or Safari to take full advantage of this  website.Thank you!");
	}

	if (document.all && !document.querySelector) {
    //alert('IE7 or older');
    alert("YOU ARE USING A WEB BROWSER NOT SUPPORTED BY THIS WEBSITE. This means that some functionality may not work as intended.This may result in strange behaviors when browsing around.Use or upgrade/install Internet Explorer Ver IE 11.0 and higher or Google Chrome or Mozilla Firefox or Safari to take full advantage of this  website.Thank you!");
	}
  if (document.all) {
    alert("YOU ARE USING A WEB BROWSER NOT SUPPORTED BY THIS WEBSITE. This means that some functionality may not work as intended.This may result in strange behaviors when browsing around.Use or upgrade/install Internet Explorer Ver IE 11.0 and higher or Google Chrome or Mozilla Firefox or Safari to take full advantage of this  website.Thank you!");    
	}

});

