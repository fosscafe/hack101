reportsApp.controller("mintelReportController",
						['$scope','$window','$timeout','$location',
						 '$anchorScroll','$stateParams','$state',
						 'reportsDataFactory','$filter','errorMapperService','reportsService',
						function($scope,$window,$timeout, 
								$location, $anchorScroll,$stateParams,
								$state,reportsDataFactory,
								$filter,errorMapperService,reportsService){
	   	 $scope.loaded = false;
		 $scope.respdata = {};
		 $scope.mintelVideo={};

		
		 reportsDataFactory.getReportData($stateParams).success(function(data) {
		 console.log('report resp is ' + data);
		 var reportDate;
	     $scope.respdata = data;
	      
	     if(data.goLiveDate!='undefined'){
	    	 $scope.reportDate =new Date((data.goLiveDate).replace("IST",""));
		  }
		  $scope.mintelVideo = data.content.report.video.videoURL;
		  $scope.figureMap = reportsService.getAllFigures(data);
		  $scope.loaded = true;
		  if($scope.respdata.assetInfo.vadInfo.socialSharingExists==true){
					 console.log("social sharing true");
					 	$scope.socialmediaurls = $scope.respdata.assetInfo.vadContent.socialSharingURLs;
					 	
					 
				 }
		  }).error(function (data, status) {
			    
		  }).catch(function (error) {
			   
			  console.log("Error:"+error);
			  $window.alert(error);
			  $window.alert(error.status + ':' + errorMapperService.getErrorMessage(error.status));
		  });
		
		 $scope.navigateFigureDiv=function(id){
			 
			 $location.hash(id);
		     $anchorScroll();
		 };

		  $scope.navigateTitleDiv=function(id){
			 id = $filter('removeSpaces')(id);
			 $location.hash(id);
		     $anchorScroll();
		 };
		
		
		$scope.displayCalloutData=function(index){
			console.log('display call out data' + index);
			var calloutdataId = 'calloutdata' + index;
			document.getElementById(calloutdataId).style.display= 'block';

			var calloutHeaderId = 'calloutHeader'+ index;
			document.getElementById(calloutHeaderId).style.display= 'none';
		};
		
		
		$scope.hideCalloutData=function(index){
			console.log('hide call out data' + index);
			var calloutdataId = 'calloutdata' + index;
			document.getElementById(calloutdataId).style.display= 'none';

			var calloutHeaderId = 'calloutHeader'+ index;
			document.getElementById(calloutHeaderId).style.display= 'block';
			
		};

		$scope.socialMediaIcons = false;
		$scope.showSocialMedia = function(){$scope.socialMediaIcons = true;}
		$scope.hideSocialMedia = function(){$scope.socialMediaIcons = false;}


		$scope.navigateToFB=function(url){

			/*var fbDialog=window.open('https://www.facebook.com/sharer/sharer.php?picture=http://mcaas-dev-icm-assets-ui.mybluemix.net/templates/images/forrester_logo.png&description='+encodeURIComponent("WHY READ THIS REPORT")+'&title='+$scope.respdata.content.report.title+'&summary='+$scope.respdata.content.report.abstract+'&u='+encodeURIComponent($scope.socialmediaurls.facebookAssetURL),    			  			*/
				var fbDialog=window.open('https://www.facebook.com/sharer/sharer.php?description='+'&title='+$scope.respdata.content.report.contents.title+'&u='+encodeURIComponent($scope.socialmediaurls.facebookAssetURL),
    			'facebook-share-dialog', 
    			'width=626,height=436');
				
    			return false;
			   };


		$scope.navigateToTwitter=function(url){
			var tweetDialog=
				window.open('https://twitter.com/intent/tweet?&url='+encodeURIComponent($scope.socialmediaurls.twitterAssetURL)+'&text='+encodeURIComponent($scope.respdata.content.report.contents.title),
				'twitter-share-dialog', 
				'width=626,height=436'
				);	
				return false;
			};

		$scope.navigateToLinkedIn=function(shareurl){
			//http://www.linkedin.com/shareArticle?mini=true&url=http://stackoverflow.com/questions/10713542/how-to-make-custom-linkedin-share-button/10737122&title=How%20to%20make%20custom%20linkedin%20share%20button&summary=some%20summary%20if%20you%20want&source=stackoverflow.com
			var linkedInDialog=
					window.open('http://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent($scope.socialmediaurls.linkedinAssetURL)+'&title='+encodeURIComponent($scope.respdata.content.report.contents.title)+'&source=Forrester',
					'LinkedIn-share-dialog', 
					'width=626,height=436'
					);	
					return false;
			};

		$scope.navigateToEmail=function(shareurl){
			$scope.mailLink="mailto:"
				/*+ "?cc=",*/
             	+ "?subject="+$scope.respdata.content.report.contents.title
             	+ "&body=See what I just read about "+$scope.respdata.content.report.contents.title+ "%0D%0ADiscover more by visiting "+encodeURIComponent($scope.socialmediaurls.emailAssetURL);
             	//window.open(mailLink);
             	//window.location.href = mailLink;
		};
		
}])