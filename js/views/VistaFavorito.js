Marvel.Views = Marvel.Views || {};

(function () {
    'use strict';

    Marvel.Views.VistaFavorito = Mn.ItemView.extend({
        template: '#VistaFavoritoTmpl',
        tagName: 'div',
        className: 'comic-item-wrapper',
        
        events: {
            'click .btn-detalles': 'verDetalles',
            'click .btn-eliminar-favorito': 'eliminarFavorito'
        },
        
        templateHelpers: function() {
            // Asegurar que salePrice y saleDate estén disponibles para el template
            var salePrice = this.model.get('salePrice') || this.model.getSalePrice();
            var saleDate = this.model.get('saleDate') || this.model.getSaleDate();
            
            console.log('VistaFavorito templateHelpers:', {
                title: this.model.get('title'),
                salePrice: salePrice,
                saleDate: saleDate,
                modelSalePrice: this.model.get('salePrice'),
                getSalePrice: this.model.getSalePrice()
            });
            
            return {
                isLoggedIn: Marvel.isLoggedIn,
                salePrice: salePrice,
                saleDate: saleDate
            };
        },
        
        verDetalles: function() {
            var vistaDetallesModal = new Marvel.Views.VistaDetallesComicModal({
                model: this.model
            });
            Marvel.vg.showChildView('modal', vistaDetallesModal);
            Marvel.vg.showModal();
        },
        
        eliminarFavorito: function() {
            var self = this;
            var comicId = this.model.get('id');
            var comicTitle = this.model.get('title');
            
            // Usar la nueva notificación de confirmación interactiva
            LoadingNotificationSystem.Notifications.confirm({
                title: '¿Eliminar favorito?',
                message: `¿Estás seguro de que quieres eliminar "${comicTitle}" de tus favoritos?`,
                confirmText: 'Eliminar',
                cancelText: 'Cancelar',
                onConfirm: function() {
                    self.procederEliminarFavorito(comicId, comicTitle);
                },
                onCancel: function() {
                    // No hacer nada, solo cerrar la notificación
                }
            });
        },
        
        procederEliminarFavorito: function(comicId, comicTitle) {
            var self = this;
            
            // Mostrar loading
            LoadingNotificationSystem.Loading.show(
                'Eliminando favorito...',
                'Actualizando tu lista de favoritos'
            );
            
            Marvel.Services.FirebaseService.removeFavorite(comicId)
                .then(function() {
                    LoadingNotificationSystem.Loading.hide();
                    
                    // Notificación de éxito
                    LoadingNotificationSystem.Notifications.success(
                        'Favorito eliminado',
                        `"${comicTitle}" se eliminó de tus favoritos`,
                        3000
                    );
                    
                    // Eliminar de la colección padre
                    if (self.model.collection) {
                        self.model.collection.remove(self.model);
                    }
                    self.destroy();
                })
                .catch(function(error) {
                    LoadingNotificationSystem.Loading.hide();
                    console.error('Error eliminando favorito:', error);
                    
                    LoadingNotificationSystem.Notifications.error(
                        'Error al eliminar',
                        'No se pudo eliminar el comic de favoritos. Intenta nuevamente.',
                        0
                    );
                });
        }
    });

})();
