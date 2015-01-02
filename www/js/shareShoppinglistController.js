controllerModule.controller('ShareShoppinglistController', ["$scope", "$state", "$stateParams", "App", "RemoteService", function ($scope, $state, $stateParams, App, RemoteService) {
	$scope.errorBlockShow = false;
	$scope.successBlockShow = false;
	$scope.errorMsg = [];
	$scope.successMsg = '';
    $scope.share = {};
    $scope.submitted = false;
    var userDetails = App.getUserDetails();
    shoppinglistId = $stateParams.shoppinglistId;
    
	$scope.submit = function(shareShoppinglistFrm) {
        if (shareShoppinglistFrm.$valid) {
        	App.showLoading('Please wait');
        	$scope.errorBlockShow = false;
        	$scope.successBlockShow = false;
        	$scope.errorMsg = [];
        	$scope.successMsg = '';
            RemoteService.shareShoppinglist($scope.share.email, shoppinglistId, userDetails['api_key']).then(
            	function(responseData) {
            		jsonResponse = angular.fromJson(JSON.parse(responseData));
            		if (jsonResponse.status != "200") {
            			$scope.errorMsg = stackMessages(jsonResponse.message);
            			$scope.errorBlockShow = true;
            			App.hideLoading();
            		} else {
            			$scope.successMsg = stackMessages(jsonResponse.message);
            			$scope.successBlockShow = true;
            			$scope.share.email = '';
            			App.hideLoading();
            		}
            	},
            	function( errorMessage ) {
            		App.showToast('Network error occurred. Please try again.', 'long', 'center');
            		App.hideLoading();
            	}
            );
        } else {
            $scope.submitted = true;
        }
    }
	
}]);