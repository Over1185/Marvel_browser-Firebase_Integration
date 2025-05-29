
var Marvel = {
    // Inicializar con configuración por defecto, será sobrescrita por EnvConfig
    Constants: {
        API_URL: 'https://gateway.marvel.com/v1/public/comics'
    },
    
    // Función para inicializar configuración desde variables de entorno
    initConfig: function() {
        if (typeof getMarvelConfig === 'function') {
            var marvelConfig = getMarvelConfig();
            this.Constants.API_URL = marvelConfig.API_URL;
            this.Constants.PUBLIC_KEY = marvelConfig.PUBLIC_KEY;
            this.Constants.PRIVATE_KEY = marvelConfig.PRIVATE_KEY;
        }
    },
    
    // Función para generar hash MD5 requerido por Marvel API
    generateHash: function(timestamp, privateKey, publicKey) {
        return CryptoJS.MD5(timestamp + privateKey + publicKey).toString();
    },
    
    // Función para obtener parámetros de autenticación de Marvel
    getMarvelAuthParams: function() {
        var timestamp = new Date().getTime();
        var hash = this.generateHash(timestamp, this.Constants.PRIVATE_KEY, this.Constants.PUBLIC_KEY);
        return {
            ts: timestamp,
            apikey: this.Constants.PUBLIC_KEY,
            hash: hash
        };
    },
    
    // Estado de autenticación del usuario
    user: null,
    isLoggedIn: false,
    
    // Funciones fallback para localStorage (cuando Firebase no está configurado)
    addFavorite: function(comic) {
        var favorites = this.getFavorites();
        var comicData = {
            id: comic.get('id'),
            title: comic.get('title'),
            description: comic.get('description'),
            thumbnail: comic.get('thumbnail')
        };
        
        // Evitar duplicados
        if (!favorites.find(function(fav) { return fav.id === comicData.id; })) {
            favorites.push(comicData);
            localStorage.setItem('marvelFavorites', JSON.stringify(favorites));
        }
        return Promise.resolve();
    },
    
    removeFavorite: function(comicId) {
        var favorites = this.getFavorites();
        favorites = favorites.filter(function(fav) { return fav.id !== comicId; });
        localStorage.setItem('marvelFavorites', JSON.stringify(favorites));
        return Promise.resolve();
    },
    
    getFavorites: function() {
        var stored = localStorage.getItem('marvelFavorites');
        return stored ? JSON.parse(stored) : [];
    },
    
    isFavorite: function(comicId) {
        var favorites = this.getFavorites();
        return favorites.some(function(fav) { return fav.id === comicId; });
    }
};


//Para poder usar Mustache con Marionette
Backbone.Marionette.Renderer.render = function(template,data) {
    return Mustache.render($(template).html(),data);
}

$('document').ready(function() {
    // Inicializar configuración desde variables de entorno
    Marvel.initConfig();
    
    // Inicializar Firebase
    Marvel.Services.FirebaseService.init();
    
    // Inicializar la vista global
    Marvel.vg = new Marvel.Views.VistaGlobal();
    
    // Mostrar cabecera, formulario de búsqueda y carrusel
    Marvel.vg.showChildView('cabecera', new Marvel.Views.VistaCabecera());
    Marvel.vg.showChildView('formBusqueda', new Marvel.Views.VistaBuscarComics());
    Marvel.vg.showChildView('carousel', new Marvel.Views.VistaCarousel());
});
