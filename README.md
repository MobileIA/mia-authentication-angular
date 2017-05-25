# MobileIA Authentication AngularJS

## Introducción
Esta es una librería para facilitar el login y registro de usuarios usando la plataforma MobileIA Lab, desarrollada sobre AngularJS para su facil implementación.

## Comienzo

    1. Clonar codigo desde Git:
```bash
    $ git clone https://github.com/MobileIA/mia-authentication-angular.git --recursive
```

    2. Incluir archivo angular-mia-authentication.js en tu HTML.

    3. Agregar modulo mobileiaAuthentication a la configuración de tu aplicación AngularJS.
```js
    angular.module('app', ['mobileiaAuthentication']);
```

    4. Configurar el APP_ID.
```js
    angular.module('app').config(function(mobileiaAuthProvider){
        mobileiaAuthProvider.init('APP_ID');
    });
```