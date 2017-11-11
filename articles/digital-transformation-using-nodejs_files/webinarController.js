reportsApp.controller('webinarController',['$scope','$rootScope','$http','webinarDataFactory','$stateParams',
 function($scope, $rootScope,$http,webinarDataFactory,$stateParams) { 
    
    $scope.emailWrapper = true;
    $scope.webinarContainer = false;
    $scope.EmailId = '';
    $stateParams.assetType='webinar';

     

    $scope.webinarData;
    //param.assetType
    webinarDataFactory.getReportData($stateParams,$scope.mode).then(function(response) {
        
        $scope.webinarData = response.data;
        console.log(response);
        $scope.webinarData.content.webinar.contents.pptURL[0] = "https://docs.google.com/gview?url="+$scope.webinarData.content.webinar.contents.pptURL[0]+"&embedded=true";
        //$scope.loaded = false;
        //console.log(JSON.stringify($scope.webinarData));
    });



    $scope.getCustomerEmailId = function(){

    	if($('#emailID').val() == ''){
    		$('.error').show();
    	}
    	else{
    		$('.error').hide();
    		$scope.EmailId = $scope.userEmailId;
    		$scope.emailWrapper = false;
    		$scope.webinarContainer = true;
            //console.log($scope.EmailId);
            
            $http({
              method: 'POST',
              url:'http://mcaas-public-api.mybluemix.net/api/v1.0/webinar/userdetails',
              headers: {'Content-Type':'application/json',
                        'emaild':$scope.EmailId,
                        'assetactionid':'UAID2016121510145616' },
            }).then(function successCallback(response) {
                //console.log('success'+JSON.stringify(response));
                
              }, function errorCallback(response) {
                //console.log('error'+response);
                
              }); 

    	}	
    }

    
    

  }]);

