Marvel.Views = Marvel.Views || {};

(function () {
    'use strict';

    Marvel.Views.VistaDetallesComicModal = Mn.ItemView.extend({
        template: '#VistaDetallesComicModalTmpl',
        
        initialize: function(options) {
            this.isFavorite = false;
            this.checkFavoriteStatus();
        },
        
        events: {
            'click .btn-favorito-detalle': 'toggleFavorito'
        },
        
        templateHelpers: function() {
            return {
                isLoggedIn: Marvel.isLoggedIn,
                formattedDates: this.model.getFormattedDates(),
                formattedPrices: this.model.getFormattedPrices(),
                isFavorite: this.isFavorite
            };
        },
        
        checkFavoriteStatus: function() {
            var self = this;
            if (Marvel.isLoggedIn) {
                Marvel.Services.FirebaseService.isFavorite(this.model.get('id'))
                    .then(function(isFavorite) {
                        self.isFavorite = isFavorite;
                        self.render();
                    })
                    .catch(function(error) {
                        console.error('Error verificando favorito:', error);
                    });
            }
        },
        
        toggleFavorito: function(e) {
            if (!Marvel.isLoggedIn) {
                LoadingNotificationSystem.Notifications.warning(
                    'Inicia sesión requerido',
                    'Debes iniciar sesión para añadir favoritos',
                    4000
                );
                return;
            }
            
            var comicId = this.model.get('id');
            var comicTitle = this.model.get('title');
            var $btn = $(e.currentTarget);
            var self = this;
            
            $btn.prop('disabled', true);
            
            // Mostrar loading
            LoadingNotificationSystem.Loading.show(
                'Actualizando favoritos...',
                'Guardando cambios en tu lista'
            );
            
            Marvel.Services.FirebaseService.isFavorite(comicId)
                .then(function(isFavorite) {
                    if (isFavorite) {
                        // Eliminar de favoritos
                        return Marvel.Services.FirebaseService.removeFavorite(comicId)
                            .then(function() {
                                LoadingNotificationSystem.Loading.hide();
                                self.isFavorite = false;
                                $btn.removeClass('favorito').text('♡ Añadir a favoritos');
                                
                                LoadingNotificationSystem.Notifications.success(
                                    'Favorito eliminado',
                                    `"${comicTitle}" se eliminó de tus favoritos`,
                                    3000
                                );
                                
                                // Disparar evento para sincronizar otros botones
                                Backbone.trigger('comic:favoriteChanged', comicId, false);
                            });
                    } else {
                        // Añadir a favoritos
                        return Marvel.Services.FirebaseService.addFavorite(self.model)
                            .then(function() {
                                LoadingNotificationSystem.Loading.hide();
                                self.isFavorite = true;
                                $btn.addClass('favorito').text('♥ Eliminar de favoritos');
                                
                                LoadingNotificationSystem.Notifications.success(
                                    '¡Agregado a favoritos!',
                                    `"${comicTitle}" se añadió a tu lista de favoritos`,
                                    4000
                                );
                                
                                // Disparar evento para sincronizar otros botones
                                Backbone.trigger('comic:favoriteChanged', comicId, true);
                            });
                    }
                })
                .catch(function(error) {
                    LoadingNotificationSystem.Loading.hide();
                    console.error('Error con favoritos:', error);
                    
                    LoadingNotificationSystem.Notifications.error(
                        'Error con favoritos',
                        'No se pudo actualizar la lista de favoritos. Intenta nuevamente.',
                        0
                    );
                })
                .finally(function() {
                    $btn.prop('disabled', false);
                });
        },
        
        onRender: function() {
            var self = this;
            
            if (Marvel.isLoggedIn) {
                // Verificar estado de favorito y actualizar botón
                Marvel.Services.FirebaseService.isFavorite(this.model.get('id'))
                    .then(function(isFavorite) {
                        self.isFavorite = isFavorite;
                        var $btn = self.$('.btn-favorito-detalle');
                        if (isFavorite) {
                            $btn.addClass('favorito').text('♥ Eliminar de favoritos');
                        } else {
                            $btn.removeClass('favorito').text('♡ Añadir a favoritos');
                        }
                    })
                    .catch(function(error) {
                        console.error('Error verificando favorito:', error);
                    });
            }
            
            // Escuchar cambios en favoritos para sincronizar
            this.listenTo(Backbone, 'comic:favoriteChanged', this.onFavoriteChanged);
        },
        
        onFavoriteChanged: function(comicId, isFavorite) {
            // Si el cambio es para este comic, actualizar el botón
            if (comicId === this.model.get('id')) {
                this.isFavorite = isFavorite;
                var $btn = this.$('.btn-favorito-detalle');
                if (isFavorite) {
                    $btn.addClass('favorito').text('♥ Eliminar de favoritos');
                } else {
                    $btn.removeClass('favorito').text('♡ Añadir a favoritos');
                }
            }
        }
    });

})();
