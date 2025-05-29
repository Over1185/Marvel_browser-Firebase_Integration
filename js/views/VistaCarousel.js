Marvel.Views = Marvel.Views || {};

(function () {
    'use strict';

    Marvel.Views.VistaCarousel = Mn.ItemView.extend({
        template: '#VistaCarouselTmpl',
        className: 'comic-carousel',
        id: 'featured-comics',
        
        initialize: function() {
            // El carrusel es estático, no necesita escuchar eventos
        },
        
        templateHelpers: function() {
            return {
                carouselImages: this.getCarouselImages()
            };
        },
        
        getCarouselImages: function() {
            var images = [];
            // Crear 3 ciclos de las 10 imágenes para scroll infinito suave
            for (var cycle = 0; cycle < 3; cycle++) {
                for (var i = 1; i <= 10; i++) {
                    images.push({
                        src: 'assets/portada-' + i + '.webp',
                        alt: 'Comic Marvel ' + i
                    });
                }
            }
            return images;
        },
        
        onRender: function() {
            // El carrusel se renderiza una vez y no cambia
        }
    });

})();
