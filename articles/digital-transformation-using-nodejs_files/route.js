/*
reportsApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	
	    $urlRouterProvider.otherwise('/assets');
	
		$stateProvider.state('assets',{
			
							url: '/assets/:tenantId/:tenantUserId/:assetId/:assetType',
							controller : 'foresterReportController',
							templateUrl : 'templates/forester-report.html'
						
				  	})


 }]);


	

	
*/

	reportsApp.config(function($stateProvider,$urlRouterProvider){

	$urlRouterProvider.otherwise('/assets');

	$stateProvider.state('foresterTEI',{
	                
	                url: '/assets/{tenantId:[5]}/:tenantUserId/:assetId/:assetType',
	                controller : 'teiReportsController',
	                templateUrl : 'templates/teiTemplate.html'

	}).state('forester',
	{              
	                url: '/assets/{tenantId:[2]}/:tenantUserId/:assetId/reports',
	                controller : 'foresterReportController',
	               	templateUrl : 'templates/forester-report.html'
	                
	}).state('mintel',{

					url: '/assets/{tenantId:[4]}/:tenantUserId/:assetId/:assetType',
					controller : 'mintelReportController',
					templateUrl : 'templates/mintel-report.html'		
	}).state('idgenterprise',
	{              
	                url: '/assets/{tenantId:[8]}/:tenantUserId/:assetId/:assetType',
	                controller : 'tlpController',
	                templateUrl : 'templates/forester-tlp-report.html'
	                
	}).state('webinar',
	{              
	                url: '/assets/{tenantId:[2]}/:tenantUserId/:assetId/webinar',
	                controller : 'webinarController',
	                templateUrl : 'templates/forresterWebinar.html'
	                
	});

});


//Pandu added for mindsfields login
/*reportsApp.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
  
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/mindfieldsLogin' && !$rootScope.globals.currentUser) {
                $location.path('/mindfieldsLogin');
                $rootScope.isLoggedIn = false;
            } else {
            	$rootScope.isLoggedIn = true;

            }
        });
    }]);*/