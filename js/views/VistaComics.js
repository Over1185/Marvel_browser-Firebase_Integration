
//Vista pensada para mostrar una lista de comics.
//Pueden ser resultados de búsqueda o la lista de "mis comics"

Marvel.Views = Marvel.Views || {};

(function () {
    'use strict';

    //Es una colección de subvistas, no tiene HTML propio.
    //El HTML es la concatenación del de las subvistas
    Marvel.Views.VistaComics = Mn.CollectionView.extend({
        
        initialize: function(options) {
            this.isFavoritesView = options && options.isFavoritesView;
        },
        
        getChildView: function() {
            // Usar vista específica para favoritos si es la vista de "Mis Comics"
            return this.isFavoritesView ? Marvel.Views.VistaFavorito : Marvel.Views.VistaComic;
        },
        
        emptyView: Mn.ItemView.extend({
            template: '#VistaComicsVacioTmpl'
        })
    });

})();