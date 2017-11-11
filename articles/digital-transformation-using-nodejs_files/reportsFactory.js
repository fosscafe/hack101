reportsApp.factory('reportsDataFactory',['$http','urlMapperService',function($http,urlMapperService) {
	var getReportData = function(param,mode) {
		var url = urlMapperService.getUrl('brokerUrl');
		var editor = param.editor; 
		var permission = param.permission;
	    var editorUrl ='';
	    var permissionUrl ='';

		if(editor){
			editorUrl = 'editor=' + editor + '&';
		}
		
		if(permission){
			permissionUrl = 'permission=' + permission + '&';
		}
		
       if(mode==='edit'){
    	   url += editorUrl + permissionUrl + '&';
       }else if(mode==='approval'){
    	   url += editorUrl + permissionUrl + '&';
       }
        
		/*var referrer=document.referrer;
		console.log("referrer is"+referrer);*/
		var targetUrl = url + 'tenantId='+param.tenantId 
							+ '&tenantUserId=' + param.tenantUserId
							+ '&assetId=' + param.assetId
							+ '&assetType=' + param.assetType
							
	    return $http.get(targetUrl);
	  };
  return {
	  getReportData: getReportData
	  
  };
  
}]);

reportsApp.factory('mindfieldsReportsPartialFactory',['$http','urlMapperService',function($http,urlMapperService) {
	var getPartialData = function(param,mode) {
		var url = urlMapperService.getUrl('brokerUrl_v3');
        var targetUrl = url + 'tenantId='+param.tenantId + '&tenantUserId=' + param.tenantUserId + '&assetId=' + param.assetId + '&assetType=' + param.assetType + '&filter=partial';					
	    return $http.get(targetUrl);
	};
  	return {
		getPartialData: getPartialData
  	};
}]);


reportsApp.factory('mindfieldsReportsDataFactory',['$http','urlMapperService',function($http,urlMapperService) {
	var getReportData = function(param,tocrefID) {
		var url = urlMapperService.getUrl('brokerUrl_v3');
		var targetUrl = url + 'tenantId='+param.tenantId + '&tenantUserId=' + param.tenantUserId + '&assetId=' + param.assetId + '&assetType=' + param.assetType + '&filter=sections' + '&id=' + tocrefID;
	    return $http.get(targetUrl);
	};
	return {
		getReportData: getReportData	  
	};
}]);


 /*TO download the pdf from forrester API*/
reportsApp.factory('pdfDownloadFactory',['$http','$window','urlMapperService', function($http, $window,urlMapperService) {
	var getPdf = function(param) {
		var targetUrl = urlMapperService.getUrl('pdfDownloadUrl');
		var pdfAssetId=(param.assetId).replace(/'/g, '');
		var targetUrl = "https://mcaas-public-api.mybluemix.net/api/v1.0/download/pdf";
	    return $http.get(targetUrl,{
	    				responseType: 'arraybuffer'});
	};
	return {
	  getPdf: getPdf
  };
}]);
 

reportsApp.factory("reportMappingFactory", function(){
	
	var factory = {};
	                   
	factory.tabsData = [{"title": "quick scan","url": "one.tpl.html"},{"title": "full report","url": "two.tpl.html"}]
		
	return factory;
});

/*TO get the social media urls functionality*/
reportsApp.factory('socialDataFactory',['$http','urlMapperService', function($http,urlMapperService) {
	var getSocialMediaUrls = function(param) {
		var url = urlMapperService.getUrl('socialMediaUrl');
		/*var referrer=document.referrer;
		console.log("referrer is"+referrer);*/
		var targetUrl = url + 'tenantId='+param.tenantId 
							+ '&tenantUserId=' + param.tenantUserId
							+ '&assetId=' + param.assetId
							+ '&type=assetURL'
							
	    return $http.get(targetUrl.replace(/'/g, ''));
	  };
  return {
	  getSocialMediaUrls: getSocialMediaUrls
	  
  };
  
}]);


// URL Mask - API to get URL mapped JSON
// Shankar Venugopal - 20 July 2016
//
//reportsApp.value('mcaasUrlDecodeObjStore','{"mcaasUrlDecode":[{"tenantID":{"5":"5"},"tenantUserID":{"777":"equinix"},"assetID":{"\'RES77777\'":"interconnectionSolutions"},"assetType":{"reports":"reports"}},{"tenantID":{"6":"6"},"tenantUserID":{"888":"equinix1"},"assetID":{"\'RES88888\'":"interconnectionSolutions1"},"assetType":{"reports":"reports"}}]}');
reportsApp.factory('urlMaskMappingFactory',['$http','urlMapperService', function($http,urlMapperService) {
	var getURLMaskMap = function(param) {
		var url = urlMapperService.getUrl('urlMaskMapper');
		var targetUrl = url + 'tenantId='+ param.tenantId 
							+ '&tenantUserId=' + param.tenantUserId
							+ '&assetId=' + param.assetId;

							
	    return $http.get(targetUrl);
	};
	return {
	  getURLMaskMap: getURLMaskMap 
	};
}]);

// HEATMAP_ZONE - API to get heatmap zone data
// Shankar Venugopal - 26 Sep 2016
//
reportsApp.factory('heatmapZoneFactory',['$http','urlMapperService', function($http,urlMapperService) {
	var getheatmapZone = function(param) {
	    var url = urlMapperService.getUrl('heatmapURL');
	    var targetUrl = url + 'tenantId='+ param.tenantId 
	    	+ '&tenantuserId=' + param.tenantUserId
	        + '&assetId=' + param.assetId.replace(/["']/g, "")
	        + '&visualtype=heatmap';

	        return $http.get(targetUrl);
	    };
    return {
        getheatmapZone: getheatmapZone 
    };
}]);


// HEATMAP_ZONE - API to get heatmap click data
// Shankar Venugopal - 26 Sep 2016
//
reportsApp.factory('heatmapClickFactory',['$http','urlMapperService', function($http,urlMapperService) {
	var getheatmapClick = function(param) {
        var url = urlMapperService.getUrl('heatmapURL');
        var targetUrl = url + 'tenantId='+ param.tenantId 
            + '&tenantuserId=' + param.tenantUserId
            + '&assetId=' + param.assetId.replace(/["']/g, "")
            + '&visualtype=heatmapClicks';

            return $http.get(targetUrl);
        };
    return {
        getheatmapClick: getheatmapClick 
    };
}]);

// Get figure in Base64 form
// Shankar Venugopal - 08 Oct 2016
//
reportsApp.factory('figureBase64Factory',['$http','$q','urlMapperService', function($http,$q,urlMapperService) {
	var recursiveFlag=0;
	var getFigureBase64 = function(param, mf_fig_id) {
		var deferred = $q.defer();
		
        var url = urlMapperService.getUrl('brokerUrl_v2');
        var targetUrl = url + 'tenantId='+ param.tenantId 
            + '&tenantuserId=' + param.tenantUserId
            + '&assetId=' + param.assetId
            + '&assetType=' + param.assetType
            + '&encodedImages=true'
            + '&figuresId=' + mf_fig_id;

            
            
            $http.get(targetUrl).success(function(data){
		 		deferred.resolve(data);
		    }).error(function(response){
	    		if(recursiveFlag <=3){
	    			recursiveFlag=recursiveFlag+1;
	    			getFigureBase64(param, mf_fig_id);
	    		}
		    });
            return deferred.promise;
        };
        
    return {
        getFigureBase64: getFigureBase64 
    };
}]);


// Get figure ids
// Shankar Venugopal - 08 Oct 2016
//
reportsApp.factory('figureIdsFactory',['$http','$q','urlMapperService', function($http,$q,urlMapperService) {
	var recursiveFlag=0;
	var countTime=0;
	
	
	var getFigureIds = function(param) {
		 var deferred = $q.defer();
		var url = urlMapperService.getUrl('brokerUrl_v2');
        var targetUrl = url + 'tenantId='+ param.tenantId 
            + '&tenantuserId=' + param.tenantUserId
            + '&assetId=' + param.assetId
            + '&assetType=' + param.assetType
            + '&figuresId=' + "All";
        	
	        setTimeout(function () {   
	    		countDelay();
	    	}, 1000)
        	var response=$http.get(targetUrl).success(function(data){
		 		deferred.resolve(data);
		    }).error(function(response){
	    		if(recursiveFlag <=3){
	    			recursiveFlag=recursiveFlag+1;
		    		getFigureIds(param);
	    		}
		    });
            return deferred.promise;
        };
        
      function countDelay(){
    	  countTime=countTime+1;
    	  if(countTime ==30 && recursiveFlag <=3){
    		  countTime=0; 
    		  recursiveFlag=recursiveFlag+1;
    		  getFigureIds(param);
    	  }
      }
      
    return {
        getFigureIds: getFigureIds 
    };
}]);


//
// Chatbot API call service
//
reportsApp.factory('publicCollaborationJSONService', ['$http', '$q', 'urlMapperService', function($http, $q, urlMapperService){

    var jsonService = function (action, param, data,cmtrefid,type) {
    	
    	var url = urlMapperService.getUrl('conversationsURL');
    	//var targetUrl = url + 'tenantId='+ param.tenantId + '&userid=' + param.tenantUserId + '&assetid=' + param.assetId;
		

    	String.prototype.unquotedsingle = function (){ return this.replace (/(^')|('$)/g, '')}
    	String.prototype.unquotedDouble = function (){ return this.replace (/(^")|("$)/g, '')}
		param.assetId=param.assetId.unquotedsingle();
		param.assetId=param.assetId.unquotedDouble();
		
		var reportType='Premium';
        if($('#reportType').val()=="Basic"){
            reportType='Basic';

        }
		var params = { 
		    "tenantid": param.tenantId,
		    "userid": param.tenantUserId,
		    "assetid": param.assetId,
		    "conversationsitems":data,
		    "type":type,
		    "cmtrefid":cmtrefid,
		    "reporttype": reportType,
		}

		targetUrl = url+'tenantid='+param.tenantId+'&userid='+param.tenantUserId+'&assetid='+param.assetId;
      	//return $http.put(targetUrl, params);

      	if(action == 'post'){
      		var deferred = $q.defer();
	        var response=$http.post(targetUrl, params).success(function(result){
				deferred.resolve(result);
			}).error(function(response){
				deferred.reject(response);
			});
			return deferred.promise;     		
      	} else if(action == 'put'){
      		
      		var deferred = $q.defer();
	        var response=$http.put(targetUrl, params).success(function(result){
				deferred.resolve(result);
			}).error(function(response){
				deferred.reject(response);
			});
			return deferred.promise;     		
      	} else if(action == 'asc' || action == 'desc'){
      		var deferred = $q.defer();
      		targetUrl = targetUrl + '&order=' + action;
      		var response=$http.get(targetUrl).success(function(result){
				deferred.resolve(result);
			}).error(function(response){
				deferred.reject(response);
			});      		
			return deferred.promise;     		
      	} else {
      		var deferred = $q.defer();
      		var response=$http.get(targetUrl).success(function(data){
				deferred.resolve(data);
			}).error(function(response){
				deferred.reject(response);
			}); 
			return deferred.promise;     		
      	}
   	}

    return {
        jsonService: jsonService 
    };
}]);

reportsApp.factory('quizFactory',['$http','urlMapperService', function($http,urlMapperService) {
	var getQuizData = function($stateParams,answerArr,method) {
    	var url = urlMapperService.getUrl('quizUrl');
    	
    	$stateParams.assetId=$stateParams.assetId.replace("'", "");
    	$stateParams.assetId=$stateParams.assetId.replace("'", "");
    	
    	if(method=='get'){
    		var headers= {"mode":"quiz", "tenantid": $stateParams.tenantId,"tenantuserid": $stateParams.tenantUserId,"assetid": $stateParams.assetId};
	    	return $http({method: 'GET', url: url, headers: headers});	
    	}
    	if(method=='post'){
    		var headers= { "tenantid": $stateParams.tenantId,"tenantuserid": $stateParams.tenantUserId,"assetid": $stateParams.assetId,'assetactionid':localStorage.getItem('tenantUserActionID')};
	    	//return $http({method: 'POST', url: url, headers: headers,data:answerArr});	
	    	return $http({method: 'POST',url:url, data:answerArr, headers:headers})
	    	.then(function(response) {
			  console.log(response)
			});
    	}
    	if(method=='anlytics'){
    		
    		var quizUrlVisualization = urlMapperService.getUrl('quizUrlVisualization');
    		var headers= {"mode":"quiz", "tenantid": $stateParams.tenantId,"tenantuserid": $stateParams.tenantUserId,"assetid": $stateParams.assetId,"questionKey":answerArr[0].questionKey};
	    	return $http({method: 'GET', url: quizUrlVisualization, headers: headers});	
    	}
	    
	}
    return {
        getQuizData: getQuizData 
    };

}]);

//factory for Webinar
reportsApp.factory('webinarDataFactory',['$http','urlMapperService',function($http,urlMapperService) {
	var getReportData = function(param,mode) {
		var url = urlMapperService.getUrl('brokerUrlWebinar');
		var editor = param.editor; 
		var permission = param.permission;
	    
		/*var referrer=document.referrer;
		console.log("referrer is"+referrer);*/
		var targetUrl = url + 'tenantId='+param.tenantId 
							+ '&tenantUserId=' + param.tenantUserId
							+ '&assetId=' + param.assetId
							+ '&assetType=' + param.assetType
							
	    return $http.get(targetUrl);
	  };
  return {
	  getReportData: getReportData
	  
  };
  
}]);
