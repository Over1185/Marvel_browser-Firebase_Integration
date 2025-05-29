# Marvel Comics Browser

**Languages:** [Español](README.md) | **English**

A modern web application to explore and manage your personal Marvel comics collection.

## 📱 Features

- **Comics Search**: Explore thousands of Marvel comics using the official API
- **Favorites System**: Save your favorite comics and access them easily
- **User Authentication**: Secure login/register system with Firebase
- **Dynamic Carousel**: Visualize featured comic covers
- **Modal Detail View**: Complete information for each comic
- **Responsive Design**: Optimized for all devices
- **Modern Interface**: Attractive design with gradients and visual effects

## 🛠️ Technologies Used

### Frontend

- **HTML5** - Semantic structure
- **CSS3** - Modern styles with gradients and animations
- **JavaScript (ES5)** - Application logic
- **jQuery** - DOM manipulation
- **Backbone.js** - MVC framework
- **Marionette.js** - Backbone extension for complex views
- **Mustache.js** - Template engine

### Backend/Services

- **Firebase Auth** - User authentication
- **Firebase Firestore** - Database for favorites
- **Marvel API** - Official comics data

## 📁 Project Structure

```text
marvel-comics-browser/
├── index.html                 # Main page
├── styles/
│   └── main.css              # Main styles
├── js/
│   ├── main.js               # App initialization
│   ├── collections/          # Backbone collections
│   │   ├── Comics.js         # Comics collection
│   │   └── MisComics.js      # Favorites collection
│   ├── models/
│   │   └── Comic.js          # Comic model
│   ├── services/
│   │   └── FirebaseService.js # Firebase services
│   ├── utils/
│   │   ├── EnvConfig.example.js      # Environment variables example
│   │   └── LoadingNotificationSystem.js # Notification system
│   ├── vendor/               # External libraries
│   │   ├── backbone.js
│   │   ├── backbone.marionette.min.js
│   │   ├── jquery.js
│   │   ├── mustache.js
│   │   └── underscore.js
│   └── views/                # Application views
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
└── assets/                   # Static resources
    ├── Icon.png
    └── portada-*.webp        # Carousel images
```

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Over1185/Marvel_browser-Firebase_Integration.git
cd Marvel_browser-Firebase_Integration
```

### 2. Configure API keys

Create a `js/utils/EnvConfig.js` file based on `EnvConfig.example.js`:

```javascript
Marvel.Config = {
    MARVEL_PUBLIC_KEY: 'your_marvel_public_key',
    MARVEL_PRIVATE_KEY: 'your_marvel_private_key',
    FIREBASE_CONFIG: {
        apiKey: "your_firebase_api_key",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "your_app_id"
    }
};
```

### 3. Get required keys

**Marvel API:**

1. Register at [Marvel Developer Portal](https://developer.marvel.com/)
2. Get your public and private keys

**Firebase:**

1. Create a project in [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Configure Firestore Database
4. Get project configuration

### 4. Run local server

```bash
# With Python 3
python3 -m http.server 8000

# With Node.js (if you have http-server installed)
npx http-server -p 8000

# With PHP
php -S localhost:8000
```

### 5. Access the application

Open your browser at `http://localhost:8000`

## 📖 Application Usage

### Comics Search

1. Use the search form on the main page
2. Enter a comic or character name
3. Explore the displayed results

### Favorites System

1. Register or log in with your email
2. Click "♡ Favorite" on any comic
3. Access "My Comics" from the top menu
4. Manage your personal collection

### Comic Details

- Click "View details" for complete information
- See prices, dates, descriptions and more
- Add to favorites directly from the modal

## 🎨 Design Features

- **Modern Gradients**: Color palette inspired by Marvel
- **Smooth Animations**: Transitions and hover effects
- **Infinite Carousel**: Auto-scroll cover display
- **Responsive Modal**: Adaptive design for all devices
- **Visual States**: Clear feedback for user actions

## 🔧 Technical Features

### MVC Architecture

- **Models**: Comic data representation
- **Views**: Reusable interface components
- **Collections**: Comic list management

### Event System

- Automatic synchronization between views
- Real-time favorites updates
- Authentication state handling

### Optimizations

- Lazy image loading
- API result caching
- Static asset compression

## 🚨 Important Notes

- **API Limits**: Marvel API has daily usage limits
- **Configuration**: API keys should not be shared publicly
- **Browsers**: Compatible with modern browsers (Chrome, Firefox, Safari, Edge)
