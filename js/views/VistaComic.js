Marvel.Views = Marvel.Views || {};

(function () {
    'use strict';

    Marvel.Views.VistaComic = Mn.ItemView.extend({
        template: '#VistaComicTmpl',
        
        events: {
            'click .btn-detalles': 'verDetalles',
            'click .btn-favorito': 'toggleFavorito'
        },
        
        templateHelpers: function() {
            return {
                isLoggedIn: Marvel.isLoggedIn,
                salePrice: this.model.getSalePrice(),
                saleDate: this.model.getSaleDate()
            };
        },
        
        verDetalles: function(e) {
            var comicId = $(e.currentTarget).data('id');
            var comic = this.model;
            
            var vistaDetallesModal = new Marvel.Views.VistaDetallesComicModal({
                model: comic
            });
            
            Marvel.vg.showChildView('modal', vistaDetallesModal);
            Marvel.vg.showModal();
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
            
            Marvel.Services.FirebaseService.isFavorite(comicId)
                .then(function(isFavorite) {
                    if (isFavorite) {
                        // Eliminar de favoritos
                        return Marvel.Services.FirebaseService.removeFavorite(comicId)
                            .then(function() {
                                $btn.removeClass('favorito').text('♡ Favorito');
                                
                                // Disparar evento para sincronizar otros botones
                                Backbone.trigger('comic:favoriteChanged', comicId, false);
                            });
                    } else {
                        // Añadir a favoritos
                        return Marvel.Services.FirebaseService.addFavorite(self.model)
                            .then(function() {
                                $btn.addClass('favorito').text('♥ Favorito');
                                
                                // Disparar evento para sincronizar otros botones
                                Backbone.trigger('comic:favoriteChanged', comicId, true);
                            });
                    }
                })
                .catch(function(error) {
                    console.error('Error con favoritos:', error);
                    alert('Error al actualizar favoritos');
                })
                .finally(function() {
                    $btn.prop('disabled', false);
                });
        },
        
        onRender: function() {
            // Actualizar el botón de favorito si está logueado
            if (Marvel.isLoggedIn) {
                var self = this;
                Marvel.Services.FirebaseService.isFavorite(this.model.get('id'))
                    .then(function(isFavorite) {
                        if (isFavorite) {
                            self.$('.btn-favorito').addClass('favorito').text('♥ Favorito');
                        } else {
                            self.$('.btn-favorito').removeClass('favorito').text('♡ Favorito');
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
                var $btn = this.$('.btn-favorito');
                if (isFavorite) {
                    $btn.addClass('favorito').text('♥ Favorito');
                } else {
                    $btn.removeClass('favorito').text('♡ Favorito');
                }
            }
        }
    });

})();
