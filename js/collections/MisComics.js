Marvel.Collections = Marvel.Collections || {};

(function () {
    'use strict';

    Marvel.Collections.MisComics = Backbone.Collection.extend({
        model: Marvel.Models.Comic,
        
        // Añadir un comic a favoritos usando Firebase
        addComic: function(comic) {
            var self = this;
            return Marvel.Services.FirebaseService.addFavorite(comic)
                .then(function() {
                    // Añadir a la colección local
                    if (!self.findWhere({id: comic.get('id')})) {
                        self.add(comic);
                    }
                });
        },
        
        // Eliminar un comic de favoritos usando Firebase
        removeComic: function(comicId) {
            var self = this;
            return Marvel.Services.FirebaseService.removeFavorite(comicId)
                .then(function() {
                    // Eliminar de la colección local
                    var comic = self.findWhere({id: comicId});
                    if (comic) {
                        self.remove(comic);
                    }
                });
        },
        
        // Verificar si un comic está en favoritos
        isComicFavorite: function(comicId) {
            return Marvel.Services.FirebaseService.isFavorite(comicId);
        },
        
        // Cargar favoritos desde Firebase
        loadFavorites: function() {
            var self = this;
            return Marvel.Services.FirebaseService.getFavorites()
                .then(function(favorites) {
                    // Convertir favoritos a modelos de comics con todos los datos
                    var comicsData = favorites.map(function(fav) {
                        // Crear datos básicos del comic
                        var comicData = {
                            id: fav.comicId,
                            title: fav.title,
                            description: fav.description,
                            thumbnail: fav.thumbnail,
                            // Incluir arrays originales para detalles completos
                            prices: fav.prices || [],
                            dates: fav.dates || [],
                            creators: fav.creators || {}
                        };
                        
                        // Calcular salePrice siempre desde los datos disponibles
                        var salePrice = 'No disponible';
                        
                        // 1. Usar valor guardado en Firebase si existe y es válido
                        if (fav.salePrice && fav.salePrice !== 'No disponible' && fav.salePrice !== '') {
                            salePrice = fav.salePrice;
                        } 
                        // 2. Calcular desde array de precios
                        else if (fav.prices && fav.prices.length > 0) {
                            var printPrice = fav.prices.find(function(p) { return p.type === 'printPrice'; });
                            if (printPrice && printPrice.price && printPrice.price > 0) {
                                salePrice = '$' + printPrice.price;
                            }
                        }
                        
                        comicData.salePrice = salePrice;
                        
                        // Calcular saleDate siempre desde los datos disponibles
                        var saleDate = 'No disponible';
                        
                        // 1. Usar valor guardado en Firebase si existe y es válido
                        if (fav.saleDate && fav.saleDate !== 'No disponible' && fav.saleDate !== '') {
                            saleDate = fav.saleDate;
                        }
                        // 2. Calcular desde array de fechas
                        else if (fav.dates && fav.dates.length > 0) {
                            var onSaleDate = fav.dates.find(function(d) { return d.type === 'onsaleDate'; });
                            if (onSaleDate && onSaleDate.date) {
                                var date = new Date(onSaleDate.date);
                                if (!isNaN(date.getTime())) {
                                    var day = String(date.getDate()).padStart(2, '0');
                                    var month = String(date.getMonth() + 1).padStart(2, '0');
                                    var year = date.getFullYear();
                                    saleDate = day + '/' + month + '/' + year;
                                }
                            }
                        }
                        
                        comicData.saleDate = saleDate;
                        
                        return comicData;
                    });
                    
                    self.reset(comicsData);
                    
                    return comicsData;
                })
                .catch(function(error) {
                    return [];
                });
        }
    });

})();
