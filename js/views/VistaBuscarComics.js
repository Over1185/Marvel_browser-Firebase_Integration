Marvel.Views = Marvel.Views || {};

(function () {
    'use strict';

    Marvel.Views.VistaBuscarComics = Mn.ItemView.extend({
        template: '#VistaBuscarComicsTmpl',
        
        // Flag para evitar búsquedas múltiples
        isSearching: false,
        
        events: {
            'click #botonBuscar': 'buscarComics',
            'keypress #titulo': 'onEnterKey',
            'submit form': 'onFormSubmit',
            'input #titulo': 'onInputChange',
            'keyup #titulo': 'onInputChange'
        },
        
        onEnterKey: function(e) {
            if (e.which === 13) { // Enter key
                e.preventDefault();
                this.buscarComics();
            }
        },
        
        onFormSubmit: function(e) {
            e.preventDefault();
            this.buscarComics();
        },
        
        buscarComics: function() {
            // Evitar búsquedas múltiples
            if (this.isSearching) {
                LoadingNotificationSystem.Notifications.warning(
                    'Búsqueda en progreso',
                    'Ya hay una búsqueda en curso, por favor espera',
                    3000
                );
                return;
            }
            
            var titulo = this.$('#titulo').val();
            if (!titulo.trim()) {
                LoadingNotificationSystem.Notifications.warning(
                    'Campo requerido',
                    'Por favor, introduce un título para buscar',
                    4000
                );
                return;
            }
            
            // Marcar como búsqueda en progreso
            this.isSearching = true;
            
            // Mostrar loading de página completa
            LoadingNotificationSystem.Loading.show(
                'Buscando comics...',
                `Buscando "${titulo}" en la base de datos de Marvel`
            );
            
            // Crear nueva colección de comics para los resultados
            Marvel.comics = new Marvel.Collections.Comics();
            
            var self = this;
            
            // Escuchar cuando se complete la búsqueda
            Marvel.comics.once('sync', function(collection, response) {
                self.isSearching = false;
                LoadingNotificationSystem.Loading.hide();
                
                if (collection.length === 0) {
                    // No se encontraron resultados
                    LoadingNotificationSystem.Notifications.info(
                        'Sin resultados',
                        `No se encontraron comics que coincidan con "${titulo}"`,
                        5000
                    );
                    // Mostrar el carrusel nuevamente cuando no hay resultados
                    self.showCarousel();
                } else {
                    // Se encontraron resultados
                    LoadingNotificationSystem.Notifications.success(
                        '¡Búsqueda exitosa!',
                        `Se encontraron ${collection.length} comics`,
                        3000
                    );
                    
                    // Mostrar resultados después de un breve delay
                    setTimeout(function() {
                        var vista = new Marvel.Views.VistaComics({
                            collection: Marvel.comics
                        });
                        // Mostrar resultados en la posición del carrusel
                        Marvel.vg.showChildView('carousel', vista);
                    }, 500);
                }
            });
            
            // Manejar errores
            Marvel.comics.once('error', function(collection, response) {
                self.isSearching = false;
                LoadingNotificationSystem.Loading.hide();
                var errorMsg = response.statusText || response.responseJSON?.message || 'Error desconocido al buscar comics';
                
                LoadingNotificationSystem.Notifications.error(
                    'Error en la búsqueda',
                    `Error al buscar: ${errorMsg}`,
                    0 // No auto-dismiss para errores
                );
                
                // Mostrar el carrusel nuevamente en caso de error
                self.showCarousel();
            });
            
            // Realizar la búsqueda
            Marvel.comics.buscar(titulo);
        },
        
        showCarousel: function() {
            // Mostrar el carrusel nuevamente
            var vistaCarousel = new Marvel.Views.VistaCarousel();
            Marvel.vg.showChildView('carousel', vistaCarousel);
        },
        
        onInputChange: function() {
            // Limpiar mensajes previos cuando el usuario empiece a escribir
            // Ya no es necesario con el sistema de notificaciones popup
        }
    });

})();
