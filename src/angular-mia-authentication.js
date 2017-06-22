(function() {
    'use strict';

    angular
        .module('mobileiaAuthentication', [
            'LocalStorageModule'
        ])
        .provider('mobileiaAuth', mobileiaAuthProvider);

    function mobileiaAuthProvider() {
        var apiId = null;
        var currentUser = null;
        var baseUrl = 'http://auth.mobileia.com/';
        
        this.init = function(api_key){
            apiId = api_key;
        };
        
        this.$get = mobileiaAuth;
        
        mobileiaAuth.$inject = ['$http', 'localStorageService', '$rootScope'];
        
        function mobileiaAuth($http, localStorageService, $rootScope) {
            // Buscar y validar si hay un usuarios logueado
            loadUserIfExist();
            
            var service = {
                currentUser: currentUser,
                isLogged: isLogged,
                getAppId: getAppId,
                getUserId: getUserId,
                getAccessToken: getAccessToken,
                onAuthStateChanged: onAuthStateChanged,
                createUser: createUser,
                updateUser: updateUser, 
                signInWithEmailAndPassword: signInWithEmailAndPassword,
                sendPasswordResetEmail: sendPasswordResetEmail,
                signOut: signOut
            };

            return service;

            function loadUserIfExist(){
                var access_token = localStorageService.get('access_token');
                if(access_token){
                    $http.post(baseUrl + 'me', {
                        app_id: parseInt(apiId),
                        access_token: access_token
                    }).then(function success(response){
                        currentUser = response.data;
                        $rootScope.currentUser = currentUser;
                    }, function error(response){
                        console.log('error');
                        console.log(response);
                    });
                }
            };
            
            function isLogged(){
                // Obtener Access token guardado
                var access_token = localStorageService.get('access_token');
                // Si existe una sesion enviar un alerta
                if(access_token){
                    return true;
                }
                
                return false;
            };
            
            function getAppId(){
                return apiId;
            };
            
            function getUserId(){
                return localStorageService.get('user_id');
            };
            
            function getAccessToken(){
                return localStorageService.get('access_token');
            };

            function onAuthStateChanged(){return apiId;};

            function createUser(params){
                // Verificar si ya existe una sesion
                if(isLogged()){
                    console.log('Ya hay una sesion iniciada');
                    return false;
                }
                
                $http.post(baseUrl + 'user/create', {
                    app_id: parseInt(apiId),
                    email: params.email,
                    password: params.password,
                    firstname: params.firstname,
                    lastname: params.lastname,
                    platform: 2
                }).then(function success(response){
                    // Llamar al callback
                    params.callback(true);
                }, function error(response){
                    // Validar si la respuesta fue correcta
                    if(response.data.status){
                        params.callback(false, { code: response.data.status, message: response.data.detail, title: response.data.title });
                        return false;
                    }
                    // Mandar error general
                    params.callback(false, { code: -1, message: "Error inesperado" });
                });
            };
            
            function updateUser(params){
                var access_token = localStorageService.get('access_token');
                if(access_token){
                    $http.post(baseUrl + 'edit', {
                        app_id: parseInt(apiId),
                        access_token: access_token,
                        email: params.email,
                        firstname: params.firstname,
                        lastname: params.lastname,
                        photo: params.photo,
                        phone: params.phone
                    }).then(function success(response){
                        // Llamar al callback
                        params.callback(true);
                    }, function error(response){
                        console.log('error');
                        console.log(response);
                    });
                }
            };

            function signInWithEmailAndPassword(params){
                // Verificar si ya existe una sesion
                if(isLogged()){
                    console.log('Ya hay una sesion iniciada');
                    return false;
                }
                
                $http.post(baseUrl + 'oauth', {
                    grant_type: "password",
                    app_id: parseInt(apiId),
                    email: params.email,
                    password: params.password
                }).then(function success(response){
                    // Guardar access_token y userId
                    localStorageService.set('access_token', response.data.access_token);
                    localStorageService.set('refresh_token', response.data.refresh_token);
                    localStorageService.set('user_id', response.data.user_id);
                    // Llamar al callback
                    params.callback(true);
                }, function error(response){
                    // Validar si la respuesta fue correcta
                    if(response.data.status){
                        params.callback(false, { code: response.data.status, message: response.data.detail, title: response.data.title });
                        return false;
                    }
                    // Mandar error general
                    params.callback(false, { code: -1, message: "Error inesperado" });
                });
            };

            function sendPasswordResetEmail(){};

            function signOut(){
                // Eliminamos AccessToken
                localStorageService.remove('access_token');
                // Elimimanamos todo
                localStorageService.clearAll();
            };
        }
    }
})();