// Servicio para manejar la comunicación con Firebase
Marvel.Services = Marvel.Services || {};

(function () {
    'use strict';

    Marvel.Services.FirebaseService = {
        
        // Configuración de Firebase - será cargada desde variables de entorno
        config: {},
        
        // Función para cargar configuración desde variables de entorno
        loadConfig: function() {
            if (typeof getFirebaseConfig === 'function') {
                this.config = getFirebaseConfig();
            }
        },
        
        // Inicializar Firebase
        init: function() {
            try {
                // Cargar configuración desde variables de entorno
                this.loadConfig();
                
                if (!firebase.apps.length) {
                    firebase.initializeApp(this.config);
                }
                this.auth = firebase.auth();
                this.firestore = firebase.firestore();
                
                // Configurar el observador de autenticación
                this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
                
                return true;
            } catch (error) {
                return false;
            }
        },
        
        // Manejar cambios en el estado de autenticación
        onAuthStateChanged: function(user) {
            if (user) {
                Marvel.user = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email
                };
                Marvel.isLoggedIn = true;
                
                // Actualizar la cabecera si existe
                if (Marvel.vg && Marvel.vg.getChildView('cabecera')) {
                    Marvel.vg.getChildView('cabecera').render();
                }
            } else {
                Marvel.user = null;
                Marvel.isLoggedIn = false;
                
                // Actualizar la cabecera si existe
                if (Marvel.vg && Marvel.vg.getChildView('cabecera')) {
                    Marvel.vg.getChildView('cabecera').render();
                }
            }
        },
        
        // Registrar usuario
        register: function(email, password) {
            if (this.auth) {
                return this.auth.createUserWithEmailAndPassword(email, password);
            } else {
                // Fallback a localStorage para desarrollo
                return this.fallbackRegister(email, password);
            }
        },
        
        // Login del usuario
        login: function(email, password) {
            if (this.auth) {
                return this.auth.signInWithEmailAndPassword(email, password);
            } else {
                // Fallback a localStorage para desarrollo
                return this.fallbackLogin(email, password);
            }
        },
        
        // Logout del usuario
        logout: function() {
            if (this.auth) {
                return this.auth.signOut();
            } else {
                // Fallback a localStorage
                Marvel.user = null;
                Marvel.isLoggedIn = false;
                localStorage.removeItem('marvelUser');
                localStorage.removeItem('marvelFavorites');
                
                if (Marvel.vg && Marvel.vg.getChildView('cabecera')) {
                    Marvel.vg.getChildView('cabecera').render();
                }
                
                return Promise.resolve();
            }
        },
        
        // Añadir comic a favoritos en Firestore
        addFavorite: function(comic) {
            if (this.firestore && Marvel.user) {
                var comicId = comic.get('id');
                if (!comicId) {
                    return Promise.reject(new Error('Comic ID is required'));
                }
                
                var comicData = {
                    comicId: comicId,
                    title: comic.get('title'),
                    description: comic.get('description'),
                    thumbnail: comic.get('thumbnail'),
                    // Guardar el precio y fecha calculados del modelo
                    salePrice: comic.getSalePrice ? comic.getSalePrice() : 'No disponible',
                    saleDate: comic.getSaleDate ? comic.getSaleDate() : 'No disponible',
                    // Guardar también los arrays originales para poder acceder a toda la información
                    prices: comic.get('prices') || [],
                    dates: comic.get('dates') || [],
                    creators: comic.get('creators') || {},
                    addedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                return this.firestore
                    .collection('users')
                    .doc(Marvel.user.uid)
                    .collection('favorites')
                    .doc(String(comicId))
                    .set(comicData);
            } else {
                // Fallback a localStorage
                return Marvel.addFavorite(comic);
            }
        },
        
        // Eliminar comic de favoritos
        removeFavorite: function(comicId) {
            if (!comicId) {
                return Promise.reject(new Error('Comic ID is required'));
            }
            
            if (this.firestore && Marvel.user) {
                return this.firestore
                    .collection('users')
                    .doc(Marvel.user.uid)
                    .collection('favorites')
                    .doc(String(comicId))
                    .delete();
            } else {
                // Fallback a localStorage
                return Marvel.removeFavorite(comicId);
            }
        },
        
        // Obtener favoritos del usuario
        getFavorites: function() {
            if (this.firestore && Marvel.user) {
                return this.firestore
                    .collection('users')
                    .doc(Marvel.user.uid)
                    .collection('favorites')
                    .get()
                    .then(function(querySnapshot) {
                        var favorites = [];
                        querySnapshot.forEach(function(doc) {
                            favorites.push(doc.data());
                        });
                        return favorites;
                    });
            } else {
                // Fallback a localStorage
                return Promise.resolve(Marvel.getFavorites());
            }
        },
        
        // Verificar si un comic está en favoritos
        isFavorite: function(comicId) {
            if (!comicId) {
                return Promise.resolve(false);
            }
            
            if (this.firestore && Marvel.user) {
                return this.firestore
                    .collection('users')
                    .doc(Marvel.user.uid)
                    .collection('favorites')
                    .doc(String(comicId))
                    .get()
                    .then(function(doc) {
                        return doc.exists;
                    });
            } else {
                // Fallback a localStorage
                return Promise.resolve(Marvel.isFavorite(comicId));
            }
        },
        
        // Métodos fallback para desarrollo sin Firebase configurado
        fallbackRegister: function(email, password) {
            // Simular registro exitoso
            var user = {
                uid: 'demo-' + Date.now(),
                email: email,
                displayName: email
            };
            
            localStorage.setItem('marvelUser', JSON.stringify(user));
            
            Marvel.user = user;
            Marvel.isLoggedIn = true;
            
            return Promise.resolve({ user: user });
        },
        
        fallbackLogin: function(email, password) {
            // Simular login exitoso
            var user = {
                uid: 'demo-' + email.replace('@', '-'),
                email: email,
                displayName: email
            };
            
            localStorage.setItem('marvelUser', JSON.stringify(user));
            
            Marvel.user = user;
            Marvel.isLoggedIn = true;
            
            return Promise.resolve({ user: user });
        }
    };

})();
