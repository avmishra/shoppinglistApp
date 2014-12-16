angular.module('shoppinglist.service', [])

        .service(
                "RemoteService",
                function ($http, $q) {

// Return public API.
                    return({
                        login: userLogin,
                        buildUrl: buildUrl,
                        signUp: signUp,
                        getAllShoppinglistFromServer: getAllShoppinglistFromServer,
                        changePassword: changePassword,
                        syncDataFromServer: syncDataFromServer,
                        verifyEmail: verifyEmail,
                        sendForgotPassCode: sendForgotPassCode,
                        forgotpassword: forgotpassword,
                        facebookSignup: facebookSignup
                    });
                    
                    function buildUrl(pageName) {
                    	var host = "http://192.168.0.105/avmishra/shoppinglist/web/app_dev.php/v1/";
                    	//var host = "";
                    	//console.log(host + pageName);
                    	return host + pageName;
                    }
                    
                    function facebookSignup(signupData) {
                    	var request = $http({
                            method: "post",
                            url: buildUrl("users/facebook_signup"),
                            data: signupData
                        });
                    	return(request.then(handleSuccess, handleError));
                    }
                    
                    function sendForgotPassCode(email) {
                    	var request = $http({
                            method: "post",
                            url: buildUrl("users/sendforgotpasswordcode"),
                            data: {
                            	email: email
                            }
                        });
                    	return(request.then(handleSuccess, handleError));
                    }
                    
                    function forgotpassword(email, code) {
                    	var request = $http({
                            method: "post",
                            url: buildUrl("users/forgotpassword"),
                            data: {
                            	email: email,
                            	code: code
                            }
                        });
                    	return(request.then(handleSuccess, handleError));
                    }
                    
                    function verifyEmail(apiKey, code) {
                    	var request = $http({
                            method: "post",
                            url: buildUrl("users/verify"),
                            data: {
                            	code: code
                            },
                            params: {
                                api_key: apiKey
                            }
                        });
                    	return(request.then(handleSuccess, handleError));
                    }
                    
                    function syncDataFromServer(apiKey, data) {
                    	var request = $http({
                            method: "post",
                            url: buildUrl("shoppinglists/sync"),
                            data: {
                            	data: data
                            },
                            params: {
                                api_key: apiKey
                            }
                        });
                    	return(request.then(handleSuccess, handleError));
                    }
                    
                    function changePassword(oldpass, newpass, apiKey) {
                    	var request = $http({
                            method: "post",
                            url: buildUrl("users/changepassword"),
                            data: {
                            	oldpass: oldpass,
                            	newpass: newpass
                            },
                            params: {
                                api_key: apiKey
                            }
                        });
                        
                        return(request.then(handleSuccess, handleError));
                    }
                    
                    function signUp(signupData) {
                    	var request = $http({
                            method: "post",
                            url: buildUrl("users/signup"),
                            data: signupData
                        });
                        
                        return(request.then(handleSuccess, handleError));
                    }
                    
                    function userLogin(email, pass) {
                        var request = $http({
                            method: "post",
                            url: buildUrl("users/login"),
                            data: {
                                email: email,
                                password: pass
                            }
                        });
                        return(request.then(handleSuccess, handleError));

                    }
                    
                    function getAllShoppinglistFromServer(apiKey) {
                    	var request = $http({
                            method: "get",
                            url: buildUrl("shoppinglists/list"),
                            params: {
                                api_key: apiKey
                            }
                        });
                        
                        return(request.then(handleSuccess, handleError));
                    }
                    
                    function handleError(response) {
                        if (!angular.isObject(response.data) || !response.data.message) {
                            return($q.reject("An unknown error occurred."));
                        }
                        return($q.reject(response.data.message));

                    }
                    function handleSuccess(response) {
                        return(response.data);

                    }

                }
        );
