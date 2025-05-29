# Marvel Comics Browser

Una aplicación web moderna para explorar y gestionar tu colección personal de comics de Marvel.

## 📱 Características

- **Búsqueda de Comics**: Explora miles de comics de Marvel usando la API oficial
- **Sistema de Favoritos**: Guarda tus comics favoritos y accede a ellos fácilmente
- **Autenticación de Usuarios**: Sistema seguro de login/registro con Firebase
- **Carrusel Dinámico**: Visualiza portadas destacadas de comics
- **Vista Modal de Detalles**: Información completa de cada comic
- **Diseño Responsive**: Optimizado para todos los dispositivos
- **Interfaz Moderna**: Diseño atractivo con gradientes y efectos visuales

## 🛠️ Tecnologías Utilizadas

### Frontend

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con gradientes y animaciones
- **JavaScript (ES5)** - Lógica de la aplicación
- **jQuery** - Manipulación del DOM
- **Backbone.js** - Framework MVC
- **Marionette.js** - Extensión de Backbone para vistas complejas
- **Mustache.js** - Motor de plantillas

### Backend/Servicios

- **Firebase Auth** - Autenticación de usuarios
- **Firebase Firestore** - Base de datos para favoritos
- **Marvel API** - Datos de comics oficiales

## 📁 Estructura del Proyecto

```
marvel-comics-browser/
├── index.html                 # Página principal
├── styles/
│   └── main.css              # Estilos principales
├── js/
│   ├── main.js               # Inicialización de la app
│   ├── collections/          # Colecciones Backbone
│   │   ├── Comics.js         # Colección de comics
│   │   └── MisComics.js      # Colección de favoritos
│   ├── models/
│   │   └── Comic.js          # Modelo de comic
│   ├── services/
│   │   └── FirebaseService.js # Servicios de Firebase
│   ├── utils/
│   │   ├── EnvConfig.example.js      # Configuración de ejemplo de las variables de entorno
│   │   └── LoadingNotificationSystem.js # Sistema de notificaciones
│   ├── vendor/               # Librerías externas
│   │   ├── backbone.js
│   │   ├── backbone.marionette.min.js
│   │   ├── jquery.js
│   │   ├── mustache.js
│   │   └── underscore.js
│   └── views/                # Vistas de la aplicación
│       ├── VistaBuscarComics.js
│       ├── VistaCabecera.js
│       ├── VistaCarousel.js
│       ├── VistaComic.js
│       ├── VistaComics.js
│       ├── VistaDetallesComicModal.js
│       ├── VistaFavorito.js
│       ├── VistaGlobal.js
│       ├── VistaLogin.js
│       └── VistaRegister.js
└── assets/                   # Recursos estáticos
    ├── Icon.png
    └── portada-*.webp        # Imágenes del carrusel
```

## 🚀 Instalación y Configuración

### 1. Clona el repositorio

```bash
git clone [url-del-repositorio]
cd marvel-comics-browser
```

### 2. Configura las claves de API

Crea un archivo `js/utils/EnvConfig.js` basado en `EnvConfig.example.js`:

```javascript
Marvel.Config = {
    MARVEL_PUBLIC_KEY: 'tu_clave_publica_marvel',
    MARVEL_PRIVATE_KEY: 'tu_clave_privada_marvel',
    FIREBASE_CONFIG: {
        apiKey: "tu_api_key_firebase",
        authDomain: "tu-proyecto.firebaseapp.com",
        projectId: "tu-proyecto",
        storageBucket: "tu-proyecto.appspot.com",
        messagingSenderId: "123456789",
        appId: "tu_app_id"
    }
};
```

### 3. Obtén las claves necesarias

**Marvel API:**

1. Regístrate en [Marvel Developer Portal](https://developer.marvel.com/)
2. Obtén tu clave pública y privada

**Firebase:**

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (Email/Password)
3. Configura Firestore Database
4. Obtén la configuración del proyecto

### 4. Ejecuta el servidor local

```bash
# Con Python 3
python3 -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server -p 8000

# Con PHP
php -S localhost:8000
```

### 5. Accede a la aplicación

Abre tu navegador en `http://localhost:8000`

## 📖 Uso de la Aplicación

### Búsqueda de Comics

1. Usa el formulario de búsqueda en la página principal
2. Ingresa el nombre de un comic o personaje
3. Explora los resultados mostrados

### Sistema de Favoritos

1. Regístrate o inicia sesión con tu email
2. Haz clic en "♡ Favorito" en cualquier comic
3. Accede a "Mis Comics" desde el menú superior
4. Gestiona tu colección personal

### Detalles de Comics

- Haz clic en "Ver detalles" para información completa
- Ve precios, fechas, descripciones y más
- Añade a favoritos directamente desde el modal

## 🎨 Características de Diseño

- **Gradientes Modernos**: Paleta de colores inspirada en Marvel
- **Animaciones Suaves**: Transiciones y efectos hover
- **Carrusel Infinito**: Scroll automático de portadas
- **Modal Responsivo**: Diseño adaptativo para todos los dispositivos
- **Estados Visuales**: Feedback claro para acciones del usuario

## 🔧 Funcionalidades Técnicas

### Arquitectura MVC

- **Models**: Representación de datos de comics
- **Views**: Componentes de interfaz reutilizables
- **Collections**: Gestión de listas de comics

### Sistema de Eventos

- Sincronización automática entre vistas
- Actualizaciones en tiempo real de favoritos
- Manejo de estados de autenticación

### Optimizaciones

- Carga diferida de imágenes
- Cacheo de resultados de API
- Compresión de assets estáticos

## 🤝 Contribuciones

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🚨 Notas Importantes

- **Límites de API**: La Marvel API tiene límites de uso diario
- **Configuración**: Las claves de API no deben compartirse públicamente
- **Navegadores**: Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

1. Revisa los [Issues existentes](../../issues)
2. Crea un nuevo Issue con detalles del problema
3. Incluye información del navegador y pasos para reproducir

---

**Desarrollado con ❤️ para fans de Marvel Comics**
