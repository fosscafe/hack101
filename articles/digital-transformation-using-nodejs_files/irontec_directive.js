(function() {
	'use strict';
	
	reportsApp.directive('irontecSimpleChat', ['$timeout', SimpleChat]);
	
	function SimpleChat($timeout) {
		var directive = {
			restrict: 'EA',
			templateUrl: 'templates/chatTemplate.html',
			replace: true,
			transclude: true,
			scope: {
				messages: '=',
				singleComment: '=',
				username: '=',
				myUserId: '=',
				showChild: '=',
				sortOrder: '=',
				toggleView: '=',
				inputPlaceholderText: '@',
				replyPlaceholderText: '@',
				submitButtonText: '@',
				replyButtonText: '@',
				title: '@',
				theme: '@',
				submitFunction: '&',
				submitReply: '&',
				imageUpload: '&',
				visible: '=',
				infiniteScroll: '&',
                expandOnNew: '=',
                onMicClick: '&',
                closeChat: '&',
                goToParentList: '&',
                sortChat: '&',
                showChildDiv: '&',
                showHide: '&',
                writingMessage: '=',
                commenterEmail:'=',
                commenterName:'=',
                commenterRole:'='
			},
			link: link,
			controller: ChatCtrl,
			controllerAs: 'vm'
		};

		function link(scope, element) {
			if (!scope.inputPlaceholderText) {
				scope.inputPlaceholderText = 'Write your message here...';
			}

			if (!scope.replyPlaceholderText) {
				scope.replyPlaceholderText = 'Write your reply here...';
			}

			if (!scope.submitButtonText || scope.submitButtonText === '') {
				scope.submitButtonText = 'Comment';
			}

			if (!scope.replyButtonText || scope.replyButtonText === '') {
				scope.replyButtonText = 'Reply';
			}

			if (!scope.title) {
				scope.title = 'Chat';
			}

			scope.$msgContainer = $('.msg-container-base'); // BS angular $el jQuery lite won't work for scrolling
			scope.$chatInput = $(element).find('.chat-input');

			scope.$watch('messages', function(updatedMessages) {
				//console.log("---value changed---");
				//scope.$apply(function() {
        			scope.messages = updatedMessages;
    			//});
			});

			var elWindow = scope.$msgContainer[0];
			scope.$msgContainer.bind('scroll', _.throttle(function() {
				var scrollHeight = elWindow.scrollHeight;
				if (elWindow.scrollTop <= 10) {
					scope.historyLoading = true; // disable jump to bottom
					//scope.$apply(scope.infiniteScroll);
					$timeout(function() {
						scope.historyLoading = false;
						if (scrollHeight !== elWindow.scrollHeight) // don't scroll down if nothing new added
							scope.$msgContainer.scrollTop(360); // scroll down for loading 4 messages
					}, 150);
				}
			}, 300));
		}

		return directive;
	}

	ChatCtrl.$inject = ['$scope', '$timeout'];

	function ChatCtrl($scope, $timeout) {
		var vm = this;

        vm.isHidden = true;
		vm.messages = $scope.messages;
		vm.singleComment = $scope.singleComment;
		vm.username = $scope.username;
		vm.myUserId = $scope.myUserId;
		vm.showChild = $scope.showChild;
		vm.sortOrder = $scope.sortOrder;
		vm.toggleView = $scope.toggleView;
		vm.inputPlaceholderText = $scope.inputPlaceholderText;
		vm.replyPlaceholderText = $scope.replyPlaceholderText;
		vm.submitButtonText = $scope.submitButtonText;
		vm.replyButtonText = $scope.replyButtonText;
		vm.title = $scope.title;
		vm.theme = 'chat-th-' + $scope.theme;
		vm.panelStyle = {'display': 'block'};
		vm.chatButtonClass= 'fa-expand icon_minim';		               
		vm.commenterEmail=$scope.commenterEmail;
        vm.commenterName=$scope.commenterName;
        vm.commenterRole=$scope.commenterRole;

		vm.toggle = show_comments;
		vm.close = close;
			
		$scope.$watch('visible', function() { // make sure scroll to bottom on visibility change w/ history items
			$timeout(function() {
				$scope.$chatInput.focus();
			}, 250);
		});
		
		// $scope.$watch('messages', function() {
		// 	// if (!$scope.historyLoading) scrollToBottom(); // don't scrollToBottom if just loading history
  //  //          if ($scope.expandOnNew && vm.isHidden) {
  //  //              toggle();
  //  //          }
		// });

		function scrollToBottom() {
			$timeout(function() { // use $timeout so it runs after digest so new height will be included
				$scope.$msgContainer.scrollTop($scope.$msgContainer[0].scrollHeight);
			}, 200, false);
		}

		function close() {
			$scope.visible = false;
		}

		function toggle() {
			if(vm.isHidden) {
				vm.chatButtonClass = 'fa-angle-double-down icon_minim';
				vm.panelStyle = {'display': 'block;'};
				vm.isHidden = false;
			} else {
				vm.chatButtonClass = 'fa-expand icon_minim';
				vm.panelStyle = {'display': 'none'};
				vm.isHidden = true;
			}
		}	

		function show_comments() {
			vm.chatButtonClass = 'fa-expand icon_minim';
			vm.panelStyle = {'display': 'block;'};
			vm.isHidden = false;
			scrollToBottom();
		}		
	}
})();
