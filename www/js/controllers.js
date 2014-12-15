angular.module('shoppinglist.controllers', ['shoppinglist.service'])

    .controller('AppController', function ($scope, $state, App, RemoteService, $ionicPopup) {
    	var userDetails = App.getUserDetails();
    	if (userDetails == null) {
    		$scope.name = '';
    	} else {
    		$scope.name = userDetails.first_name;
    	}
    	
    	// A delete confirm dialog
    	$scope.showConfirm = function(index) {
	          var confirmPopup = $ionicPopup.confirm({
	            title: 'Do you really want to logout?',
	            template: 'Please sync the data with server so that you can access them later. Ignore if already did that.'
	          });
	          confirmPopup.then(function(res) {	
	            if(res) {
	            	App.deleteStorage();
	                $state.go('app.login');
	            }
	          });
        };
    	
    	$scope.exitApp = function() {
    		if(AdMob) AdMob.showInterstitial();
    		ionic.Platform.exitApp();
    		//navigator.app.exitApp();
    	}
    })
    .controller('HelpController', function ($scope, $state, $ionicSlideBoxDelegate) {
    	$scope.slideHasChanged = function(index) {
    	    console.log(index);
    	}
    	
    	$scope.next = function() {
    		$scope.$broadcast('slideBox.nextSlide');
    	};
    	
    	$scope.prev = function() {
    		$scope.$broadcast('slideBox.prevSlide');
    	}
    })
    
    .controller('ForgotPasswordController', function ($scope, $state, App, RemoteService) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
        $scope.forgot = {};
        $scope.submitted = false;
        var userDetails = App.getUserDetails();
        $scope.sendCodeFrm = true;
        $scope.sendPasswordFrm = false;
        $scope.verifyForm = {};
        
    	$scope.sendForgotPassCode = function (codeFrm) {
    		if (codeFrm.$valid) {
    			App.showLoading('Please wait');
                RemoteService.sendForgotPassCode($scope.forgot.email).then(
            		function(responseData) {
                		jsonResponse = angular.fromJson(JSON.parse(responseData));
                		if (jsonResponse.status != "200") {
                			$scope.errorMsg = stackMessages(jsonResponse.message);
                			$scope.errorBlockShow = true;
                			App.hideLoading();
                		} else {
                			$scope.errorMsg = stackMessages(jsonResponse.message);
                			$scope.errorBlockShow = true;
                			$scope.sendCodeFrm = false;
                			$scope.sendPasswordFrm = true;
                			$scope.verifyForm.email = $scope.forgot.email;
                			App.hideLoading();
                		}
                		
                	},
                	function( errorMessage ) {
                		console.warn( errorMessage );
                		App.showToast('Network error occurred. Please try again.', 'long', 'center');
                		App.hideLoading();
                	}
                );
            } else {
                $scope.submitted = true;
            }
    	}
    	
    	$scope.submit = function(verificationFrm) {
            if (verificationFrm.$valid) {
            	App.showLoading('Please wait');
                RemoteService.forgotpassword($scope.verifyForm['email'], $scope.verifyForm['code']).then(
                	function(responseData) {
                		jsonResponse = angular.fromJson(JSON.parse(responseData));
                		if (jsonResponse.status != "200") {
                			$scope.errorMsg = stackMessages(jsonResponse.message);
                			$scope.errorBlockShow = true;
                			App.hideLoading();
                		} else {
                			App.showToast('We have sent new password on your email', 'long', 'center');
                			App.hideLoading();
                			$state.go('app.login');
                		}
                	},
                	function( errorMessage ) {
                		console.warn( errorMessage );
                		App.showToast('Network error occurred. Please try again.', 'long', 'center');
                		App.hideLoading();
                	}
                );
            } else {
                $scope.submitted = true;
            }
        }
    	
    })
    .controller('ChangepasswordController', function ($scope, $state, App, RemoteService) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
        $scope.userForm = {};
        $scope.submitted = false;
        var userDetails = App.getUserDetails();
        
    	$scope.changePassword = function (userFrm) {
    		if (userFrm.$valid) {
    			if ($scope.userForm.password != $scope.userForm.confirmpassword) {
    				$scope.errorMsg = stackMessages('Password mismatched');
    				$scope.errorBlockShow = true;
    			} else {
	    			App.showLoading('Please wait');
	                RemoteService.changePassword($scope.userForm.oldpassword, $scope.userForm.password, userDetails['api_key']).then(
	            		function(responseData) {
	                		jsonResponse = angular.fromJson(JSON.parse(responseData));
	                		if (jsonResponse.status != "200") {
	                			$scope.errorMsg = stackMessages(jsonResponse.message);
	                			$scope.errorBlockShow = true;
	                			App.hideLoading();
	                		} else {
	                			App.showToast('Password changed successfully', 'long', 'center');
	                			App.hideLoading();
	                			$state.go('app.listing');
	                		}
	                		
	                	},
	                	function( errorMessage ) {
	                		console.warn( errorMessage );
	                		App.showToast('Network error occurred. Please try again.', 'long', 'center');
	                		App.hideLoading();
	                	}
	                );
    			}
            } else {
                $scope.submitted = true;
            }
        };
    })
    .controller('LoginController', function ($rootScope, $scope, $state, RemoteService, App) {
    	var userDetails = App.getUserDetails();
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
        $scope.userForm = {};
        $scope.submitted = false;
        $scope.noUserExist = true;
        $scope.shoppingLists = App.getAllShoppinglist();
        // if user exist but email not verified redirect him
        if (userDetails != null && userDetails.email_verified == 0) {
        	$state.go('app.emailVerification');
        }
        // hide sign up button
        if (userDetails != null) {
        	$scope.noUserExist = false;
        }
        $scope.userLogin = function(userFrm) {
            if (userFrm.$valid) {
            	App.showLoading('Please wait');
                RemoteService.login($scope.userForm.email, $scope.userForm.password).then(
            		function(responseData) {
                		jsonResponse = angular.fromJson(JSON.parse(responseData));
                		if (jsonResponse.status != "200") {
                			$scope.errorMsg = stackMessages(jsonResponse.message);
                			$scope.errorBlockShow = true;
                			App.hideLoading();
                		} else {
                			jsonResponse.email_verified = 1;
                			jsonResponse.logged_in = 1;
                			jsonResponse.status = 1;
                			App.removeUserDetails();
                			App.deleteAllShoppinglist();
                			App.saveUserDetails(jsonResponse);
                			userDetails = App.getUserDetails();
                			
                			App.hideLoading();
                			App.showLoading('Syncing data');
                			// if local storage is empty then get Data from server
                    		RemoteService.getAllShoppinglistFromServer(userDetails['api_key']).then(
                            	function(responseData) {
                            		jsonResponse = angular.fromJson(JSON.parse(responseData));
                            		if (jsonResponse.status != "200") {
                            			App.showToast('Data did not sync. Please try again later.', 'long', 'center');
                            		} else {
                            			for(key in jsonResponse.data) {
                            				$scope.shoppingLists.unshift(jsonResponse.data[key]);
                            			}
                            			App.saveShoppinglist($scope.shoppingLists);
                            		}
                            		App.hideLoading();
                            		$rootScope.$broadcast('refreshData');
                            		$state.go('app.loading');
                            	},
                            	function( errorMessage ) {
                            		console.warn( errorMessage );
                            		App.showToast('Network error occurred. Please try again.', 'long', 'center');
                            		App.hideLoading();
                            		$state.go('app.loading');
                            	}
                            );
                		}

                	},
                	function( errorMessage ) {
                		console.warn( errorMessage );
                		App.showToast('Network error occurred. Please try again.', 'long', 'center');
                		App.hideLoading();
                	}
                );
            } else {
                $scope.submitted = true;
            }
        }
        
        if(userDetails != null && (userDetails.email_verified == 0 || userDetails.status == 0)) {
        	$scope.errorMsg.push({msg:'Please verify your email id.'});
        	$scope.userForm = {email:userDetails.email};
    		$scope.errorBlockShow = true;
    	}
    })
    
    .controller('SignupController', function ($scope, $state, RemoteService, App) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
    	
        $scope.loginPage = function() {
           $state.go('app.login');
        };
        if (App.getUserDetails() !== null) {
        	$state.go('app.login');
        }
        $scope.genders = [{ text: "Male", value: "1" },{ text: "Female", value: "0" }];
        $scope.userForm = {gender:"1"};
        $scope.submitted = false;
        $scope.submit = function(signupFrm) {
            if (signupFrm.$valid) {
            	App.showLoading('Please wait');
                RemoteService.signUp($scope.userForm).then(
                	function(responseData) {
                		jsonResponse = angular.fromJson(JSON.parse(responseData));
                		if (jsonResponse.status != "200") {
                			$scope.errorMsg = stackMessages(jsonResponse.message);
                			$scope.errorBlockShow = true;
                			App.hideLoading();
                		} else {
                			jsonResponse.data['logged_in'] = 0;
                			App.saveUserDetails(jsonResponse.data);
                			App.showToast('You have successfully signed up. Please verify your email id.', 'long', 'center');
                			App.hideLoading();
                			$state.go('app.emailVerification');
                		}

                	},
                	function( errorMessage ) {
                		console.warn( errorMessage );
                		App.showToast('Network error occurred. Please try again.', 'long', 'center');
                		App.hideLoading();
                	}
                );
            } else {
                $scope.submitted = true;
            }
        }

    })
    
    .controller('LoadingController', function($scope, $state, App, RemoteService) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
        $scope.userForm = {};
        $scope.shoppingLists = App.getAllShoppinglist();
    	var userDetails = App.getUserDetails();
        if (userDetails == null || userDetails.status == 0) {
            $state.go('app.login');
        } else {
        	if(userDetails.email_verified == 0) {
        		$state.go('app.emailVerification');
        	} else {
        		$state.go('app.listing');
        	}
        }
    })
    
    .controller('EmailVerifyController', function($scope, $state, App, RemoteService) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
        $scope.verifyForm = {};
        $scope.submitted = false;
    	var userDetails = App.getUserDetails(); 
    	
    	$scope.submit = function(verificationFrm) {
            if (verificationFrm.$valid) {
            	App.showLoading('Please wait');
                RemoteService.verifyEmail(userDetails['api_key'], $scope.verifyForm['code']).then(
                	function(responseData) {
                		jsonResponse = angular.fromJson(JSON.parse(responseData));
                		if (jsonResponse.status != "200") {
                			$scope.errorMsg = stackMessages(jsonResponse.message);
                			$scope.errorBlockShow = true;
                			App.hideLoading();
                		} else {
                			userDetails['email_verified'] = 1;
                			App.saveUserDetails(userDetails);
                			App.showToast('You have successfully verified your account.', 'long', 'center');
                			App.hideLoading();
                			$state.go('app.login');
                		}
                	},
                	function( errorMessage ) {
                		console.warn( errorMessage );
                		App.showToast('Network error occurred. Please try again.', 'long', 'center');
                		App.hideLoading();
                	}
                );
            } else {
                $scope.submitted = true;
            }
        }
    	
    	$scope.differentUser = function() {
    		App.deleteStorage();
            $state.go('app.login');
    	}
    	
    })
    
    
    .controller('SyncController', function($scope, $state, App, RemoteService) {
    	var shoppinglistSync = [];
    	var shoppinglistItemSync = [];
    	var userDetails = App.getUserDetails();
    	$scope.shoppingLists = App.getAllShoppinglist();
    	
    	// get the all data to be sync on server
    	for (i in $scope.shoppingLists) {
    		
    		// -- for shopping id is blank means its new shopping
    		if ($scope.shoppingLists[i].id_shoppinglist == '') {
    			shoppinglistSync.push($scope.shoppingLists[i]);
    		} else if($scope.shoppingLists[i].sync == 1) { // edit only shopping name
    			shoppinglistSync.push(
					{
						id_shoppinglist: $scope.shoppingLists[i].id_shoppinglist ,
						shoppinglist_name: $scope.shoppingLists[i].shoppinglist_name
					}
    			);
    		}
    		
    		// -- for items
    		for (inc in $scope.shoppingLists[i].items) {
    			if (
    					($scope.shoppingLists[i].id_shoppinglist != '')
    					&& (
    						($scope.shoppingLists[i].items[inc].id_shoppinglist_item == '') || 
    						($scope.shoppingLists[i].items[inc].sync == 1)
    					   )
    			) {
    				$scope.shoppingLists[i].items[inc]['id_shoppinglist'] = $scope.shoppingLists[i].id_shoppinglist;
    				shoppinglistItemSync.push($scope.shoppingLists[i].items[inc]);
    			}
    		}
    		
    	}
    	
    	syncDataReq = {
    		deleted_shoppinglist:App.getDeletedShoppinglist(), // collect deleted shoppnglist
    		deleted_items:App.getDeletedShoppinglistItems(), // collect deleted shoppinglist item
    		sync_shoppinglist:shoppinglistSync,
    		sync_items:shoppinglistItemSync
    	};
    	App.showLoading('Uploading');
    	RemoteService.syncDataFromServer(userDetails['api_key'], syncDataReq).then(
    		function(responseData) {
        		jsonResponse = angular.fromJson(JSON.parse(responseData));
        		if (jsonResponse.status != "200") {
        			$scope.errorMsg = stackMessages(jsonResponse.message);
        			$scope.errorBlockShow = true;
        			App.hideLoading();
        			App.showToast('Uploading fail. Please try again later.', 'long', 'center');
        			$state.go('app.listing');
        		} else {
        			App.deleteSyncStorage();
        			$scope.shoppingLists = App.getAllShoppinglist();
        			App.hideLoading();
        			App.showLoading('Downloading');
        			RemoteService.getAllShoppinglistFromServer(userDetails['api_key']).then(
                    	function(responseData) {
                    		jsonResponse = angular.fromJson(JSON.parse(responseData));
                    		if (jsonResponse.status != "200") {
                    			App.showToast('Downloading fail. Please try again later.', 'long', 'center');
                    			App.hideLoading();
                    			$state.go('app.listing');
                    		} else {
                    			for(key in jsonResponse.data) {
                    				$scope.shoppingLists.unshift(jsonResponse.data[key]);
                    			}
                    			App.saveShoppinglist($scope.shoppingLists);
                    		}
                    		App.hideLoading();
                    		$state.go('app.listing');
                    	},
                    	function( errorMessage ) {
                    		console.warn( errorMessage );
                    		App.showToast('Network error occurred. Please try again.', 'long', 'center');
                    		App.hideLoading();
                    		$state.go('app.listing');
                    	}
                    );
        		}
        	},
        	function( errorMessage ) {
        		console.warn( errorMessage );
        		App.showToast('Network error occurred. Please try again.', 'long', 'center');
        		App.hideLoading();
        		$state.go('app.listing');
        	}
        );
    })
    
    .controller('ListingController', function($rootScope, $scope, $state, $location, App, RemoteService, $ionicPopup) {
    	$scope.errorBlockShow = false;
    	$scope.errorMsg = [];
    	$scope.noShopping = true;
    	var userDetails = App.getUserDetails();
    	$scope.shoppingLists = App.getAllShoppinglist();

    	if ($scope.shoppingLists.length) {
    		$scope.noShopping = false;
    	}
    	$scope.showItems = function(index, item) {
    		App.setLastActiveIndex(index);
    		$location.path("showitems/"+index+"/"+item.shoppinglist_name);
    	}
        $scope.edit = function(shopping) {
        	var updateShoppingName = prompt('Change shopping name', shopping.shoppinglist_name);
            if(updateShoppingName) {
            	updateShopping(updateShoppingName, shopping);
            }
        }
        
       // A delete confirm dialog
        $scope.showConfirm = function(index) {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Want to delete this shopping?',
            template: 'All items of this shopping will be deleted.'
          });
          confirmPopup.then(function(res) {	
            if(res) {
            	onConfirm(index);
            }
          });
        };
        
        function onConfirm(indexForDelete) {
	    	shopping = $scope.shoppingLists[indexForDelete];
	    	// if shopping is not synched then delete whole shopping with its item
	    	// otherwise push shopping in deleted list and delete whole shopping with its item
	    	if (shopping.id_shoppinglist) {
	    		// push id in to be deleted shopping list
	    		var deletedShoppinglist = App.getDeletedShoppinglist();
	    		deletedShoppinglist.push(shopping.id_shoppinglist);
	    		App.saveDeletedShoppinglist(deletedShoppinglist);
	    	}
	    	$scope.shoppingLists.splice(indexForDelete, 1);
    		App.saveShoppinglist($scope.shoppingLists);
    		App.showToast('Shopping deleted successfully', 'long', 'center');
    	}
        
        $scope.newShopping = function() {
            var newShoppingName = prompt('Give a name for this shopping');
            if(newShoppingName) {
              createShopping(newShoppingName);
            }
        }
       
        var updateShopping = function(newShoppingName, shopping) {
        	shopping.shoppinglist_name = newShoppingName;
        	shopping.sync = 1; // make shopping to be sync to save on server
        	App.showToast('Shopping name updated', 'long', 'center');
        	App.saveShoppinglist($scope.shoppingLists);
        }
        
        var createShopping = function(newShoppingName) {
        	var newShoppinglist = App.newShoppinglist(newShoppingName);
        	$scope.shoppingLists.unshift(newShoppinglist);
        	App.saveShoppinglist($scope.shoppingLists);
        	App.showToast('New shopping created', 'long', 'center');
        	$location.path('showitems/0/' + newShoppingName);
        }
    })

    .controller('ShowItemController', function($scope, $state, $window, $stateParams, $ionicModal, App, $ionicPopup) {
    	$scope.pageTitle = $stateParams.shoppinglistname;
    	$scope.shoppingIndex = App.getLastActiveIndex();
    	$scope.shoppingLists = App.getAllShoppinglist();
    	$scope.submitted = false;
    	$scope.item = {unit:'pk'};
        $scope.editItem = {};
        var editIndex = null;
        $scope.units = {pk: 'Packet', kg: 'KG', gm: 'Gram', lt: 'Liter', ml: 'ML', un: 'Unit'};
    	
        $ionicModal.fromTemplateUrl('add-new-item.html', function(modal){
            $scope.itemModal = modal;
        },{
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        });
        //Be sure to cleanup the modal by removing it from the DOM
//        $scope.$on('$destroy', function() {
//          $scope.itemModal.remove();
//        });
//        
        $scope.showModal = function() {
        	$scope.submitted = false;
            $scope.itemModal.show();
        }
        
        $scope.hideModal = function() {
        	$scope.item = {unit:'pk'};
            $scope.itemModal.hide();
        }
        
        $ionicModal.fromTemplateUrl('edit-item.html', function(modal){
            $scope.itemEditModal = modal;
        },{
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        });
        
      //Be sure to cleanup the modal by removing it from the DOM
//        $scope.$on('$destroy', function() {
//          $scope.itemEditModal.remove();
//        });
//        
        $scope.showEditModal = function() {
        	$scope.submitted = false;
            $scope.itemEditModal.show();
        }
        
        $scope.hideEditModal = function() {
        	$scope.editItem = {};
            $scope.itemEditModal.hide();
        }
        

        $scope.picked = function(item, inc) {
            if (item.picked) {
                $("#picked_"+inc).html('<i class="icon ion-ios7-circle-outline custom-icon-pick"></i>');
                $("#badge_"+inc).removeClass('badge-assertive').addClass('badge-balanced');
                item.picked = 0;
                $scope.shoppingLists[$scope.shoppingIndex].remaining_item++;
                App.showToast('Item dropped successfully', 'short', 'top');
            } else {
                $("#picked_"+inc).html('<i class="icon ion-ios7-checkmark custom-icon-pick"></i>');
                $("#badge_"+inc).removeClass('badge-balanced').addClass('badge-assertive');
                item.picked = 1;
                $scope.shoppingLists[$scope.shoppingIndex].remaining_item--;
                App.showToast('Item picked successfully', 'short', 'top');
            }
            item.sync = 1;
            App.saveShoppinglist($scope.shoppingLists);
        }
        
        $scope.addItem = function(frmName, addAnother) {
        	if (frmName.$valid) {
	        	var newShoppinglist = App.newShoppinglistItem($scope.item.product_name, $scope.item.unit, $scope.item.quantity, $scope.item.notes);
	        	$scope.shoppingLists[$scope.shoppingIndex].items.unshift(newShoppinglist);
	        	$scope.shoppingLists[$scope.shoppingIndex].remaining_item++;
	        	App.saveShoppinglist($scope.shoppingLists);
	        	App.showToast('Item added successfully', 'short', 'center');
	        	if (!addAnother) {
	        		$scope.item = {unit:'pk'};
	        		$scope.hideModal();
	        	}
	        	$scope.submitted = false;
	        	$scope.item = {unit:'pk'};
        	} else {
        		$scope.submitted = true;
        	}
        }
        
        $scope.edit = function(item, index) {
        	$scope.editItem = {
        		id_shoppinglist_item: item.id_shoppinglist_item,
        		product_name: item.product_name,
        		quantity:item.quantity,
        		unit:item.unit,
        		picked:item.picked,
        		sync:1,
        		created_at:item.created_at,
        		notes: item.notes
        	};
        	editIndex = index;
        	$scope.showEditModal();
        }
        
      	$scope.editShoppingItem = function(frmName) {
    	   if (frmName.$valid) {
    		    $scope.shoppingLists[$scope.shoppingIndex]['items'][editIndex] = $scope.editItem;
	        	App.saveShoppinglist($scope.shoppingLists);
	        	editIndex = null;
	        	App.showToast('Item updated successfully', 'short', 'center');
	        	$scope.submitted = false;
	       	} else {
	       		$scope.submitted = true;
	       	}
    	   $scope.hideEditModal();
       }
      	
	  	function onConfirm(deleteIndex) {
	    	item = $scope.shoppingLists[$scope.shoppingIndex]['items'][deleteIndex];
	    	// if item is not synched then delete item
	    	// otherwise push item in deleted list
	    	if (item.id_shoppinglist_item) {
	    		// push id in to be deleted item list
	    		var deletedItems = App.getDeletedShoppinglistItems();
	    		deletedItems.push(item.id_shoppinglist_item);
	    		App.saveDeletedShoppinglistItems(deletedItems);
	    	}
	    	if (item.picked == 0) { // if item is not picked then descrease remaining_item of shopping
	    		$scope.shoppingLists[$scope.shoppingIndex].remaining_item--;
	    	}
	    	
	    	$scope.shoppingLists[$scope.shoppingIndex]['items'].splice(deleteIndex, 1);
    		App.saveShoppinglist($scope.shoppingLists);
    		App.showToast('Item deleted successfully', 'long', 'center');
		}
	  	
	  	// A delete confirm dialog
        $scope.showConfirm = function(index) {
          var confirmPopup = $ionicPopup.confirm({
            title: '',
            template: 'Want to delete this item?'
          });
          confirmPopup.then(function(res) {	
            if(res) {
            	onConfirm(index);
            }
          });
        };
        
    });

function stackMessages(msg) {
    var data = msg.split('^');
    var text = [{}];
    for (i = 0; i < data.length; i++) {
        text.push({msg:data[i]});
    }
    return text;
}