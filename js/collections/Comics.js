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
                return [];
            }
            
            return response.data.results;
        },
        
        buscar: function(titulo, limit, offset) {
            limit = limit || TAM_LISTADO;
            offset = offset || OFFSET_LISTADO;
            
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
