Marvel.Models = Marvel.Models || {};

(function () {
    'use strict';

    Marvel.Models.Comic = Backbone.Model.extend({
        
        initialize: function() {
            // Si el modelo fue creado desde datos de favoritos de Firebase,
            // asegurarnos de que los arrays necesarios estén disponibles
            if (this.get('comicId') && !this.get('id')) {
                this.set('id', this.get('comicId'));
            }
            
            // Si no tenemos arrays de prices y dates pero tenemos los valores calculados,
            // crear arrays básicos para mantener compatibilidad
            if (!this.get('prices') && this.get('salePrice')) {
                var priceValue = this.get('salePrice').replace('$', '').replace('No disponible', '0');
                this.set('prices', [{
                    type: 'printPrice',
                    price: parseFloat(priceValue) || 0
                }]);
            }
            
            if (!this.get('dates') && this.get('saleDate')) {
                var dateValue = this.get('saleDate');
                if (dateValue !== 'No disponible') {
                    // Convertir formato dd/mm/yyyy a fecha ISO
                    var parts = dateValue.split('/');
                    if (parts.length === 3) {
                        var isoDate = parts[2] + '-' + parts[1] + '-' + parts[0] + 'T00:00:00-0500';
                        this.set('dates', [{
                            type: 'onsaleDate',
                            date: isoDate
                        }]);
                    }
                }
            }
            
            // Asegurar que salePrice y saleDate estén calculados y disponibles
            this._ensurePriceAndDate();
        },
        
        // Método para asegurar que price y date estén calculados
        _ensurePriceAndDate: function() {
            // Si viene de Firebase y ya tiene valores, no recalcular
            if (this.get('_fromFirebase')) {
                var hasValidPrice = this.get('salePrice') && this.get('salePrice') !== 'No disponible';
                var hasValidDate = this.get('saleDate') && this.get('saleDate') !== 'No disponible';
                
                // Solo calcular si no hay valores válidos
                if (!hasValidPrice) {
                    var calculatedPrice = this._calculateSalePrice();
                    if (calculatedPrice !== 'No disponible') {
                        this.set('salePrice', calculatedPrice);
                    }
                }
                
                if (!hasValidDate) {
                    var calculatedDate = this._calculateSaleDate();
                    if (calculatedDate !== 'No disponible') {
                        this.set('saleDate', calculatedDate);
                    }
                }
                return;
            }
            
            // Comportamiento original para comics que no vienen de Firebase
            var currentPrice = this.get('salePrice');
            var currentDate = this.get('saleDate');
            
            // Solo calcular si no están disponibles o son valores por defecto
            if (!currentPrice || currentPrice === 'No disponible') {
                var calculatedPrice = this._calculateSalePrice();
                this.set('salePrice', calculatedPrice);
            }
            
            if (!currentDate || currentDate === 'No disponible') {
                var calculatedDate = this._calculateSaleDate();
                this.set('saleDate', calculatedDate);
            }
        },
        
        // Calcular precio sin usar el getter para evitar recursión
        _calculateSalePrice: function() {
            var prices = this.get('prices') || [];
            var printPrice = prices.find(function(p) { return p.type === 'printPrice'; });
            return printPrice ? '$' + printPrice.price : 'No disponible';
        },
        
        // Calcular fecha sin usar el getter para evitar recursión
        _calculateSaleDate: function() {
            var dates = this.get('dates') || [];
            var saleDate = dates.find(function(d) { return d.type === 'onsaleDate'; });
            
            if (!saleDate || !saleDate.date) return 'No disponible';
            
            var date = new Date(saleDate.date);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            
            var day = String(date.getDate()).padStart(2, '0');
            var month = String(date.getMonth() + 1).padStart(2, '0');
            var year = date.getFullYear();
            
            return day + '/' + month + '/' + year;
        },
        
        // Obtener precio de venta
        getSalePrice: function() {
            // Si ya tenemos el precio calculado (de Firebase), usarlo
            var savedPrice = this.get('salePrice');
            if (savedPrice && savedPrice !== 'No disponible') {
                return savedPrice;
            }
            
            // Si no, calcular desde el array de precios
            var prices = this.get('prices') || [];
            var printPrice = prices.find(function(p) { return p.type === 'printPrice'; });
            return printPrice ? '$' + printPrice.price : 'No disponible';
        },
        
        // Obtener fecha de venta formateada
        getSaleDate: function() {
            // Si ya tenemos la fecha calculada (de Firebase), usarla
            var savedDate = this.get('saleDate');
            if (savedDate && savedDate !== 'No disponible') {
                return savedDate;
            }
            
            // Si no, calcular desde el array de fechas
            var dates = this.get('dates') || [];
            var saleDate = dates.find(function(d) { return d.type === 'onsaleDate'; });
            
            if (!saleDate || !saleDate.date) return 'No disponible';
            
            var date = new Date(saleDate.date);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            
            var day = String(date.getDate()).padStart(2, '0');
            var month = String(date.getMonth() + 1).padStart(2, '0');
            var year = date.getFullYear();
            
            return day + '/' + month + '/' + year;
        },
        
        // Formatear todas las fechas
        getFormattedDates: function() {
            var self = this;
            var dates = this.get('dates') || [];
            
            // Si no hay dates array pero tenemos saleDate, crear una entrada básica
            if (dates.length === 0 && this.get('saleDate') && this.get('saleDate') !== 'No disponible') {
                return [{
                    type: 'Fecha de venta',
                    date: this.get('saleDate')
                }];
            }
            
            return dates.map(function(dateItem) {
                return {
                    type: self.translateDateType(dateItem.type),
                    date: self.formatDate(dateItem.date)
                };
            });
        },
        
        // Formatear todos los precios
        getFormattedPrices: function() {
            var self = this;
            var prices = this.get('prices') || [];
            
            // Si no hay prices array pero tenemos salePrice, crear una entrada básica
            if (prices.length === 0 && this.get('salePrice') && this.get('salePrice') !== 'No disponible') {
                var priceValue = this.get('salePrice').replace('$', '');
                var price = parseFloat(priceValue) || 0;
                if (price > 0) {
                    return [{
                        type: 'Precio impreso',
                        price: price
                    }];
                }
            }
            
            return prices.map(function(priceItem) {
                return {
                    type: self.translatePriceType(priceItem.type),
                    price: priceItem.price
                };
            });
        },
        
        translateDateType: function(type) {
            var translations = {
                'onsaleDate': 'Fecha de venta',
                'focDate': 'Fecha FOC',
                'unlimitedDate': 'Fecha unlimited',
                'digitalPurchaseDate': 'Fecha de compra digital'
            };
            return translations[type] || type;
        },
        
        translatePriceType: function(type) {
            var translations = {
                'printPrice': 'Precio impreso',
                'digitalPurchasePrice': 'Precio digital'
            };
            return translations[type] || type;
        },
        
        formatDate: function(dateString) {
            if (!dateString) return 'No disponible';
            
            var date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            
            var day = String(date.getDate()).padStart(2, '0');
            var month = String(date.getMonth() + 1).padStart(2, '0');
            var year = date.getFullYear();
            
            return day + '/' + month + '/' + year;
        }
    });

})();
