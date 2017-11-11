reportsApp.directive('toggle', function() {
    return function(scope, elem, attrs) {
        scope.$on('event:toggle', function() {
            elem.slideToggle();
            $('.sign-image').toggleClass('sign-image-toggle');
        });
    };
});

reportsApp.directive('escKey', function () {
	return function (scope, element, attrs) {
		element.bind('keydown keypress', function (event) {
			if(event.which === 27) { // 27 = esc key
				scope.$apply(function (){
					scope.$eval(attrs.escKey);
				});
				event.preventDefault();
			}
		});
	};
});