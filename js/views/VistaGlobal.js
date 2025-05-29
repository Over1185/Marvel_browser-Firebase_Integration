Marvel.Views = Marvel.Views || {};

(function () {
    'use strict';

    Marvel.Views.VistaGlobal = Mn.LayoutView.extend({
        template: false,
        el: 'body',
        regions: {
            cabecera: '#cabecera',
            formBusqueda: "#formBusqueda",
            carousel: '#carousel-container',
            listado: '#listado',
            modal: '#modal-body'
        },
        
        events: {
            'click #modal-overlay': 'onModalOverlayClick',
            'click #modal-close': 'closeModal'
        },
        
        showModal: function() {
            $('#modal-overlay').addClass('active');
        },
        
        closeModal: function() {
            $('#modal-overlay').removeClass('active');
            this.getRegion('modal').empty();
        },
        
        onModalOverlayClick: function(e) {
            if (e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        }
    });
})();
