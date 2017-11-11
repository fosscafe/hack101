reportsApp.service('errorMapperService', function(){

	this.errorMap = {};

	this.errorMap['404']=' resource not found ';
	
	this.getErrorMessage = function(code){

		return this.errorMap[code];
		    
		};
	 
});
