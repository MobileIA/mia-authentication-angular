(function() {
    'use strict';

    angular
        .module('mobileiaAuthentication', [
            'LocalStorageModule'
        ])
        .provider('mobileiaAuth', mobileiaAuthProvider);

    function mobileiaAuthProvider() {
        var apiId = null;
        var currentUser = {firstname: 'Anoninomo'};
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
                onAuthStateChanged: onAuthStateChanged,
                createUser: createUser,
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
                        console.log(currentUser);
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

            function onAuthStateChanged(){return apiId;};

            function createUser(){};

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
                }/*, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }*/).then(function success(response){
                    console.log('success');
                    console.log(response.data);
                    // Guardar access_token y userId
                    localStorageService.set('access_token', response.data.access_token);
                    localStorageService.set('refresh_token', response.data.refresh_token);
                    localStorageService.set('access_token', response.data.user_id);
                    
                }, function error(response){
                    console.log('error');
                    console.log(response);
                });
            };

            function sendPasswordResetEmail(){};

            function signOut(){};
        }
    }
})();