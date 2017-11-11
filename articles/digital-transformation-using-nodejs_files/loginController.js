reportsApp.controller('LoginController',
    ['$scope', '$rootScope', '$location', '$window','AuthenticationService','$http','$state',
    function ($scope, $rootScope, $location,window, AuthenticationService,$http,$state) {

        $rootScope.isLoggedIn = false;
        $rootScope.chatBotVisibilty = false;

        //tabs
        $scope.tab = 1;
        $scope.setTab = function(newTab){$scope.tab = newTab;};
        $scope.isSet = function(tabNum){return $scope.tab === tabNum;};

         //show login modal for login and register
        $scope.displayLogin = function(){
            $scope.tab = 1;
        }

        $scope.displayRegister = function(){
            $scope.tab = 2;
        }
        
        // reset login status
        AuthenticationService.ClearCredentials();

        var currenturl = document.location.href ;
        console.log(currenturl);
        


        $scope.login = function () {
            $scope.dataLoading = true;
            $rootScope.loginThroughNormal = true;
            AuthenticationService.Login($scope.username, $scope.password,$rootScope.platformTenantId, function(response) {
                //console.log(JSON.stringify(response));
                if(response.status) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                     $('.modal-backdrop').fadeOut();
                     $('body').removeClass('modal-open');
                     $rootScope.isLoggedIn = true;
                     $rootScope.chatBotVisibilty = true;
                  
                     
                    var response_data = response.success[0].data;
                    var urlparams = {
                        "tenantId"      : response_data.tenantid,
                        "tenantUserId"  : response_data.userid,
                        "assetId"       : response_data.assetid,
                        "assetType"     : 'reports',
                        "userkey"       : response_data.multiuserkey,
                        "type"			:'premium'
                    };
                    localStorage.setItem("mindfieldsTenantId", response_data.tenantid);
                    localStorage.setItem("mindfieldsTenantUserId", response_data.userid);
                    localStorage.setItem("mindfieldsAssetId", response_data.assetid);
                    localStorage.setItem("mindfieldsUserkey", response_data.multiuserkey);
                    
                    
                    $state.go('mindfields',urlparams);
                    loggedinuserId = $rootScope.loggedinuserId;
                    tenantId =  $rootScope.tenantId;
                    //enableTracker(loggedinuserId,tenantId,uuid);
                    console.log('success');

                } else {
                    /*response.errors.forEach(function(res) {
                        $scope.error = res.message;
                        $scope.dataLoading = false;
                    })*/   
                    console.log(response);
                }
            });
        };
        
        
    }]);
    
reportsApp.directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.registerUserForm.password.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
})