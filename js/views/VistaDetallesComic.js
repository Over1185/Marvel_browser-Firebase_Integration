Marvel.Views = Marvel.Views || {};

(function () {
    'use strict';

    Marvel.Views.VistaDetallesComic = Mn.ItemView.extend({
        template: '#VistaDetallesComicTmpl',
        
        initialize: function(options) {
            this.fromFavorites = options && options.fromFavorites;
            this.parentCollection = options && options.parentCollection;
        },
        
        events: {
            'click .btn-volver': 'volver',
            'click .btn-favorito-detalle': 'toggleFavorito'
        },
        
        templateHelpers: function() {
            return {
                isLoggedIn: Marvel.isLoggedIn,
                formattedDates: this.model.getFormattedDates(),
                formattedPrices: this.model.getFormattedPrices(),
                fromFavorites: this.fromFavorites
            };
        },
        
        volver: function() {
            if (this.fromFavorites) {
                // Volver a la vista de favoritos
                if (this.parentCollection) {
                    var vista = new Marvel.Views.VistaComics({
                        collection: this.parentCollection,
                        isFavoritesView: true
                    });
                    Marvel.vg.showChildView('listado', vista);
                } else {
                    // Si no tenemos la colección, recargar favoritos
                    Marvel.vg.getChildView('cabecera').mostrarMisComics();
                }
            } else {
                // Volver a mostrar los resultados de búsqueda
                if (Marvel.comics && Marvel.comics.length > 0) {
                    var vista = new Marvel.Views.VistaComics({
                        collection: Marvel.comics
                    });
                    Marvel.vg.showChildView('listado', vista);
                } else {
                    Marvel.vg.getRegion('listado').empty();
                }
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
            var $btn = $(e.currentTarget);
            var self = this;
            
            $btn.prop('disabled', true);
            
            // Verificar estado actual del favorito
            Marvel.Services.FirebaseService.isFavorite(comicId)
                .then(function(isFavorite) {
                    if (isFavorite || self.fromFavorites) {
                        // Eliminar de favoritos
                        return Marvel.Services.FirebaseService.removeFavorite(comicId)
                            .then(function() {
                                $btn.removeClass('favorito').text('♡ Añadir a favoritos');
                                
                                // Disparar evento para sincronizar otros botones
                                Backbone.trigger('comic:favoriteChanged', comicId, false);
                                
                                // Si viene de favoritos, volver a la lista
                                if (self.fromFavorites) {
                                    setTimeout(function() {
                                        self.volver();
                                    }, 500);
                                }
                            });
                    } else {
                        // Añadir a favoritos
                        return Marvel.Services.FirebaseService.addFavorite(self.model)
                            .then(function() {
                                $btn.addClass('favorito').text('♥ Eliminar de favoritos');
                                
                                // Disparar evento para sincronizar otros botones
                                Backbone.trigger('comic:favoriteChanged', comicId, true);
                            });
                    }
                })
                .catch(function(error) {
                    console.error('Error con favoritos:', error);
                    LoadingNotificationSystem.Notifications.error(
                        'Error al actualizar favoritos',
                        'No se pudo completar la operación. Inténtalo de nuevo.'
                    );
                })
                .finally(function() {
                    $btn.prop('disabled', false);
                });
        },
        
        onRender: function() {
            var self = this;
            
            // Si viene de favoritos, automáticamente es un favorito
            if (this.fromFavorites) {
                this.$('.btn-favorito-detalle').addClass('favorito').text('♥ Eliminar de favoritos');
            } else if (Marvel.isLoggedIn) {
                // Verificar si ya es favorito usando Firebase
                Marvel.Services.FirebaseService.isFavorite(this.model.get('id'))
                    .then(function(isFavorite) {
                        if (isFavorite) {
                            self.$('.btn-favorito-detalle').addClass('favorito').text('♥ Eliminar de favoritos');
                        } else {
                            self.$('.btn-favorito-detalle').removeClass('favorito').text('♡ Añadir a favoritos');
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