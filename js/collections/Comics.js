/*global Marvel, Backbone*/

Marvel.Collections = Marvel.Collections || {};

(function () {
    'use strict';

    var TAM_LISTADO = 20;
    var OFFSET_LISTADO = 0;

    Marvel.Collections.Comics = Backbone.Collection.extend({
        model: Marvel.Models.Comic,
        url: Marvel.Constants.API_URL,
        
        parse: function(response, options) {
            // Verificar que la respuesta tenga la estructura esperada
            if (!response.data || !response.data.results) {
                console.error('Respuesta inesperada de la API:', response);
                return [];
            }
            
            console.log(`API respondió con ${response.data.results.length} comics de ${response.data.total} totales`);
            return response.data.results;
        },
        
        buscar: function(titulo, limit, offset) {
            limit = limit || TAM_LISTADO;
            offset = offset || OFFSET_LISTADO;
            
            console.log(`Buscando comics con título que empiece por: "${titulo}"`);
            
            var authParams = Marvel.getMarvelAuthParams();
            var params = $.extend({
                titleStartsWith: titulo,
                limit: limit,
                offset: offset
            }, authParams);
            
            return this.fetch({
                data: $.param(params),
                reset: true // Asegurar que se limpien los resultados anteriores
            });
        }
    });

})();
