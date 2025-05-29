Marvel.Views = Marvel.Views || {};

(function () {
    'use strict';

    Marvel.Views.VistaCabecera = Mn.ItemView.extend({
        template: '#VistaCabeceraTmpl',
        
        events: {
            'click #btn-login': 'showLogin',
            'click #btn-logout': 'logout',
            'click #btn-mis-comics': 'showMisComics'
        },
        
        templateHelpers: function() {
            return {
                isLoggedIn: Marvel.isLoggedIn,
                username: Marvel.user ? (Marvel.user.displayName || Marvel.user.email) : ''
            };
        },
        
        showLogin: function() {
            var vistaLogin = new Marvel.Views.VistaLogin();
            Marvel.vg.showChildView('modal', vistaLogin);
            Marvel.vg.showModal();
        },
        
        logout: function() {
            var self = this;
            Marvel.Services.FirebaseService.logout().then(function() {
                self.render();
                // Limpiar la vista principal
                Marvel.vg.getRegion('listado').empty();
                // Disparar evento para actualizar otras vistas
                Backbone.trigger('user:loginChanged', false);
            });
        },
        
        showMisComics: function() {
            if (Marvel.isLoggedIn) {
                // Mostrar indicador de carga
                Marvel.vg.showChildView('carousel', new Mn.ItemView({
                    template: function() {
                        return '<div class="loading">Cargando tus comics favoritos...</div>';
                    }
                }));
                
                var misComics = new Marvel.Collections.MisComics();
                
                misComics.loadFavorites().then(function() {
                    var vista = new Marvel.Views.VistaComics({
                        collection: misComics,
                        isFavoritesView: true
                    });
                    Marvel.vg.showChildView('carousel', vista);
                }).catch(function(error) {
                    console.error('Error al cargar favoritos:', error);
                    Marvel.vg.showChildView('carousel', new Mn.ItemView({
                        template: function() {
                            return '<div class="error">Error al cargar favoritos: ' + error.message + '</div>';
                        }
                    }));
                });
            } else {
                LoadingNotificationSystem.Notifications.warning(
                    'Inicia sesión requerido',
                    'Debes iniciar sesión para ver tus comics favoritos',
                    4000
                );
            }
        }
    });

})();
