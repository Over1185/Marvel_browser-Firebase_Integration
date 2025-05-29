// Environment Configuration Loader
// IMPORTANTE: Copia este archivo como EnvConfig.js y configura con tus credenciales reales
(function() {
    'use strict';

    window.ENV = {
        // Marvel API Configuration
        // Obtén estas credenciales en: https://developer.marvel.com/account
        MARVEL: {
            PUBLIC_KEY: 'your_marvel_public_key_here',
            PRIVATE_KEY: 'your_marvel_private_key_here',
            API_URL: 'https://gateway.marvel.com/v1/public/comics'
        },

        // Firebase Configuration  
        // Obtén estas credenciales en: Firebase Console > Project Settings > General
        FIREBASE: {
            API_KEY: 'your_firebase_api_key_here',
            AUTH_DOMAIN: 'your-project.firebaseapp.com',
            PROJECT_ID: 'your-project-id',
            STORAGE_BUCKET: 'your-project.firebasestorage.app',
            MESSAGING_SENDER_ID: 'your_messaging_sender_id',
            APP_ID: 'your_firebase_app_id_here'
        },

        // Application Settings
        APP: {
            NAME: 'Marvel Comics Browser',
            VERSION: '1.0.0',
            ENVIRONMENT: 'development'
        }
    };

    // Función para obtener configuración de Marvel
    window.getMarvelConfig = function() {
        return {
            API_URL: window.ENV.MARVEL.API_URL,
            PUBLIC_KEY: window.ENV.MARVEL.PUBLIC_KEY,
            PRIVATE_KEY: window.ENV.MARVEL.PRIVATE_KEY
        };
    };

    // Función para obtener configuración de Firebase
    window.getFirebaseConfig = function() {
        return {
            apiKey: window.ENV.FIREBASE.API_KEY,
            authDomain: window.ENV.FIREBASE.AUTH_DOMAIN,
            projectId: window.ENV.FIREBASE.PROJECT_ID,
            storageBucket: window.ENV.FIREBASE.STORAGE_BUCKET,
            messagingSenderId: window.ENV.FIREBASE.MESSAGING_SENDER_ID,
            appId: window.ENV.FIREBASE.APP_ID
        };
    };

    // Función para obtener configuración de la aplicación
    window.getAppConfig = function() {
        return {
            name: window.ENV.APP.NAME,
            version: window.ENV.APP.VERSION,
            environment: window.ENV.APP.ENVIRONMENT
        };
    };

    // Modo de desarrollo para logs
    window.isDevelopment = function() {
        return window.ENV.APP.ENVIRONMENT === 'development';
    };

})();
