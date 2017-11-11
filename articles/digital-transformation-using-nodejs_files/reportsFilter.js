
reportsApp.filter('removeSpaces', [function() {
    return function(string) {
    	string = angular.uppercase(string);
        if (!angular.isString(string)) {
            return string;
        }
        
        return string.replace(/[\s]/g, '');
    };
}]);

//Pandu added filter for video player ng-src issue
reportsApp.filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);
//Pandu added filter for video player ng-src issue


reportsApp.filter('capitalize', function() {
    return function(input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  });

 
reportsApp.filter('dateFormatter', [function() {
	    return function(string) {
	    	console.log("string",string);
	    	var dateChange=string;
	    	console.log(dateChange);
	    	var parts = dateChange.split('/');
	    	console.log("parts:::::::",parts);
	        if (3 !== parts.length) {
	            return null;
	        }
	        var year = parseInt(parts[2], 10);
	        var month = parseInt(parts[0], 10);
	        var day = parseInt(parts[1], 10);

	        if (month < 1 || year < 1 || day < 1) {
	            return null;
	        }    
	        var formattedDate=year+(month-1)+day;
	        console.log( "formatted date is :",(year, (month - 1), day));
	        
	        return formattedDate;
	    };
	}]);

reportsApp.filter('spacetounderscore',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '_');    
        }
    }
});

reportsApp.filter('linebreaktospace',function() {
    return function(input) {
        if (input) {
            return input.replace(/<br\/>/g, ' ');    
        }
    }
});

reportsApp.filter('removecolon',function() {
    return function(input) {
        if (input) {
            return input.replace(/:/g, '');    
        }
    }
});

//added for webinar audio - https://stackoverflow.com/questions/15728424/html5-video-is-not-working-with-angularjs-ng-src-tag
reportsApp.filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);


reportsApp.filter("whitelistURL", ['$sce', function ($sce) {
        return function (mediaPpt) {
            return $sce.trustAsResourceUrl(mediaPpt);
        };
    }]);

//TLP toc filters
reportsApp.filter('spacetounderscore',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '_');    
        }
    }
});

reportsApp.filter('linebreaktospace',function() {
    return function(input) {
        if (input) {
            return input.replace(/<br\/>/g, ' ');    
        }
    }
});

reportsApp.filter('removecolon',function() {
    return function(input) {
        if (input) {
            return input.replace(/:/g, '');    
        }
    }
});