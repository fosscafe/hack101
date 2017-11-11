angular.module('angular-highlight', []).directive('highlight', function() {
	var matchCount = 0;
	var newCheckKeyword = '';
	var component = function(scope, element, attrs) {
		
		if (!attrs.highlightClass) {
			attrs.highlightClass = 'angular-highlight';
		}
		var count = 0;
		var replacer = function(match, item) {
			count++;
			var temp = matchCount+count;
			return '<span class="'+attrs.highlightClass+'" id="highlightId'+temp+'">'+match+'</span>';
		}
		
		
		var tokenize = function(keywords) {
			keywords = keywords.replace(new RegExp('^ | $','g'), '');
			return keywords;
		}

		scope.$watch('keywords', function(newKeyword, oldKeyword) {
			if(newCheckKeyword == '' || newCheckKeyword != newKeyword){
				newCheckKeyword = newKeyword;
				matchCount = 0;
				count = 0;
				scope.sendCount({count: matchCount});
			}
			//console.log("scope.keywords",scope.keywords);
			if (!scope.keywords || scope.keywords == '') {
				element.html(scope.highlight);
				return false;
			}
			
			var tokenized	= tokenize(scope.keywords);
			// Modified to skip HTML tags - Shankar Venugopal - 31 August 2016
			var regex 		= new RegExp(tokenized+'(?!([^<]+)?>)', 'gmi');

			// Find the words
			var html = scope.highlight.replace(regex, replacer);
			
			//var htmlCount = scope.highlight.match(regex, replacer);
			
			element.html(html);
			matchCount = matchCount+count;
			scope.sendCount({count: matchCount});
			count = 0;
		});
		
	}
	return {
		link: 			component,
		replace:		false,
		scope:			{
			highlight:	'=',
			keywords:	'=',
			sendCount: '&'
			
		}
	};
});
