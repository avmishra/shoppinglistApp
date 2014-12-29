angular.module('shoppinglist', ['ionic', 'shoppinglist.controllers','ngCordova','shoppinglist.admob','openfb'])

	.config(function ($stateProvider, $urlRouterProvider) {
	    $stateProvider
	        .state('app', {
	            url: "/",
	            abstract: true,
	            templateUrl: "partials/menu.html",
	            controller: "AppController"
	        })
	        .state('app.login', {
	            url: "login",
	            views: {
	                'shoppingContent': {
	                    templateUrl: "partials/login.html",
	                    controller: "LoginController"
	                }
	            }
	        })
	        .state('app.signup', {
	            url: "signup",
	            views: {
	                'shoppingContent': {
	                    templateUrl: "partials/signup.html",
	                    controller: "SignupController"
	                }
	            }
	        })
	        .state('app.forgotpassword', {
	            url: "forgotpassword",
	            views: {
	                'shoppingContent': {
	                    templateUrl: "partials/forgot-password.html",
	                    controller: "ForgotPasswordController"
	                }
	            }
	        })
	        .state('app.listing', {
	            url: "listing",
	            views: {
	                'shoppingContent': {
	                    templateUrl: "partials/listing.html",
	                    controller: "ListingController"
	                }
	            }
	        })
	        .state('app.showitems', {
	            url: "showitems/:id/:shoppinglistname",
	            views: {
	                'shoppingContent': {
	                    templateUrl: "partials/showitem.html",
	                    controller: "ShowItemController"
	                }
	            }
	        })
	        .state('app.aboutus', {
	            url: "aboutus",
	            views: {
	                'shoppingContent': {
	                    templateUrl: "partials/about-us.html",
	                    controller: "AppController"
	                }
	            }
	        })
	        .state('app.changepassword', {
	            url: "changepassword",
	            views: {
	                'shoppingContent': {
	                    templateUrl: "partials/changepassword.html",
	                    controller: "ChangepasswordController"
	                }
	            }
	        })
	        .state('app.sync', {
	            url: "sync",
	            views: {
	                'shoppingContent': {
	                	templateUrl: "partials/sync.html",
	                    controller: "SyncController"
	                }
	            }
	        })
	        .state('app.help', {
	            url: "help",
	            views: {
	                'shoppingContent': {
	                	templateUrl: "partials/help.html",
	                    controller: "HelpController"
	                }
	            }
	        })
	        .state('app.emailVerification', {
	            url: "emailVerification",
	            views: {
	                'shoppingContent': {
	                	templateUrl: "partials/emailVerification.html",
	                    controller: "EmailVerifyController"
	                }
	            }
	        })
	        .state('app.loading', {
	            url: "loading",
	            views: {
	                'shoppingContent': {
	                    templateUrl: "partials/loading.html",
	                    controller: "LoadingController"
	                }
	            }
	        });
	
	// fallback route
	$urlRouterProvider.otherwise('/loading');
	
	})

	.factory('App', function($rootScope, $cordovaToast, $ionicLoading) {
	  return {
		getAllShoppinglist: function() {
			var allShopping = window.localStorage.getItem('shoppinglist');
		    if(allShopping) {
		    	return angular.fromJson(allShopping);
		    }
		    return [];
		},
		newShoppinglist: function(shoppingName) {
			var date = new Date();
			return {
				shoppinglist_name: shoppingName,
				id_shoppinglist: '',
				items: [],
				remaining_item: 0,
				sync: 0,
				created_at: date.getFullYear() + '-' + (date.getMonth()+1) + '-' +date.getDate()
			};
	    },
	    deleteAllShoppinglist: function() {
			window.localStorage.removeItem('shoppinglist');
		},
	    saveShoppinglist: function(shoppingLists) {
	    	window.localStorage.setItem('shoppinglist',angular.toJson(shoppingLists));
	    },
	    getDeletedShoppinglist: function(){
	    	var allDeletedShopping = window.localStorage.getItem('deleted_shoppinglist');
		    if(allDeletedShopping) {
		    	return angular.fromJson(allDeletedShopping);
		    }
		    return [];
	    },
	    saveDeletedShoppinglist: function(allDeletedShopping) {
			window.localStorage.setItem('deleted_shoppinglist',angular.toJson(allDeletedShopping));
		},
		deleteStorage: function () {
			this.removeUserDetails();
            this.deleteAllShoppinglist();
			window.localStorage.removeItem('deleted_shoppinglist');
			window.localStorage.removeItem('deleted_items');
			window.localStorage.removeItem('lastActiveProject');
		},
		deleteSyncStorage: function () {
			this.deleteAllShoppinglist();
			window.localStorage.removeItem('deleted_shoppinglist');
			window.localStorage.removeItem('deleted_items');
			window.localStorage.removeItem('lastActiveProject');
		},
	    newShoppinglistItem: function(productName, unit, quantity, notes) {
	    	var date = new Date();
	    	return {
	    		id_shoppinglist_item: '',
				product_name: productName,
				unit: unit,
				quantity: quantity,
				notes: notes,
				picked: 0,
				sync: 0,
				created_at: date.getFullYear() + '-' + (date.getMonth()+1) + '-' +date.getDate()
			};
	    },
	    getDeletedShoppinglistItems: function(){
	    	var allDeletedItems = window.localStorage.getItem('deleted_items');
		    if(allDeletedItems) {
		    	return angular.fromJson(allDeletedItems);
		    }
		    return [];
	    },
	    saveDeletedShoppinglistItems: function(allDeletedItems) {
			window.localStorage.setItem('deleted_items',angular.toJson(allDeletedItems));
		},
	    
	    getUserDetails: function() {
	    	var userString = window.localStorage.getItem('user');
		    if(userString) {
		    	return angular.fromJson(userString);
		    }
		    return null;
		},
		saveUserDetails: function(userDetails) {
			window.localStorage.setItem('user',angular.toJson(userDetails));
		},
		removeUserDetails: function() {
			window.localStorage.removeItem('user');
		},
		getLastActiveIndex: function() {
			return parseInt(window.localStorage['lastActiveProject']) || 0;
	    },
	    setLastActiveIndex: function(index) {
	    	window.localStorage['lastActiveProject'] = index;
	    },
	    showToast: function(msg, duration, position){
	    	//$cordovaToast.show(msg, duration, position);
	    },
	    showLoading : function(msg){
	    	$ionicLoading.show({
    	      template: msg + '...'
    	    });
	    },
	    hideLoading : function() {
	    	$ionicLoading.hide();
	    }
	  }
	})
    .run(function ($rootScope, $state, $window, App, $ionicPlatform, $ionicSideMenuDelegate, AdMob, OpenFB) {
    	//window.localStorage.removeItem('user');
    	//window.localStorage.removeItem('shoppinglist');
    	//window.localStorage.removeItem('deleted_shoppinglist');
    	//window.localStorage.removeItem('deleted_items');
    	OpenFB.init('378306805627739');
    	
    	$rootScope.$on('OAuthException', function() {
            $state.go('app.login');
        });
    	
    	$ionicPlatform.registerBackButtonAction(function () {
    	    $ionicSideMenuDelegate.toggleLeft();
    	}, 100);
    	
        $rootScope.$on('$stateChangeStart', function(event, toState) {
        	var userDetails = App.getUserDetails();
        	$rootScope.logged_in = false;
        	//console.log(userDetails);
            if (toState.name !== "app.login" && toState.name !== "app.logout"
            	&& toState.name !== "app.loading" && toState.name !== "app.signup"
            	&& toState.name !== "app.emailVerification" && toState.name !== "app.aboutus"
            	&& toState.name !== "app.forgotpassword" && toState.name !== "app.help"
            	&& (userDetails == null || userDetails.logged_in == 0)) {
                //console.log('You are not logged in');
                $state.go('app.login');
                event.preventDefault();
            }
            // hide session menu item
            if (userDetails !== null && userDetails.logged_in == 1) {
            	$rootScope.logged_in = true;
            	$rootScope.userName = userDetails['first_name'];
            }
        });

    }) ;
