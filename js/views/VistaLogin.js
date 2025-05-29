Marvel.Views = Marvel.Views || {};

(function () {
    'use strict';

    Marvel.Views.VistaLogin = Mn.ItemView.extend({
        template: '#VistaLoginTmpl',
        
        events: {
            'click #btn-login-submit': 'login',
            'click #btn-show-register': 'showRegister',
            'click #btn-cancel-login': 'cancel',
            'keypress #password': 'onEnterKey',
            'submit form': 'preventDefault'
        },
        
        preventDefault: function(e) {
            e.preventDefault();
        },
        
        onEnterKey: function(e) {
            if (e.which === 13) { // Enter key
                this.login();
            }
        },
        
        login: function() {
            var email = this.$('#email').val().trim();
            var password = this.$('#password').val();
            
            if (!email || !password) {
                LoadingNotificationSystem.Notifications.warning(
                    'Campos requeridos',
                    'Por favor, introduce email y contraseña',
                    4000
                );
                return;
            }
            
            // Validar formato de email
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                LoadingNotificationSystem.Notifications.warning(
                    'Email inválido',
                    'Por favor, introduce un email válido',
                    4000
                );
                return;
            }
            
            var self = this;
            var $btn = this.$('#btn-login-submit');
            
            $btn.text('Iniciando sesión...').prop('disabled', true);
            
            // Mostrar loading overlay
            LoadingNotificationSystem.Loading.show(
                'Iniciando sesión...',
                'Verificando credenciales'
            );
            
            Marvel.Services.FirebaseService.login(email, password)
                .then(function() {
                    LoadingNotificationSystem.Loading.hide();
                    
                    // Notificación de éxito
                    LoadingNotificationSystem.Notifications.success(
                        '¡Bienvenido!',
                        'Has iniciado sesión correctamente',
                        3000
                    );
                    
                    // El login fue exitoso, cerrar modal
                    Marvel.vg.closeModal();
                    // Disparar evento para actualizar vistas
                    Backbone.trigger('user:loginChanged', true);
                })
                .catch(function(error) {
                    LoadingNotificationSystem.Loading.hide();
                    console.error('Error de login:', error);
                    var errorMsg = 'Error de inicio de sesión';
                    var errorDetails = '';
                    
                    if (error.code) {
                        switch (error.code) {
                            case 'auth/user-not-found':
                                errorMsg = 'Usuario no encontrado';
                                errorDetails = 'No existe una cuenta con este email';
                                break;
                            case 'auth/wrong-password':
                                errorMsg = 'Contraseña incorrecta';
                                errorDetails = 'Verifica tu contraseña e intenta nuevamente';
                                break;
                            case 'auth/invalid-email':
                                errorMsg = 'Email inválido';
                                errorDetails = 'El formato del email no es válido';
                                break;
                            case 'auth/user-disabled':
                                errorMsg = 'Cuenta deshabilitada';
                                errorDetails = 'Esta cuenta ha sido suspendida';
                                break;
                            case 'auth/too-many-requests':
                                errorMsg = 'Demasiados intentos';
                                errorDetails = 'Espera unos minutos antes de intentar nuevamente';
                                break;
                            default:
                                errorMsg = 'Error de conexión';
                                errorDetails = error.message || 'Intenta nuevamente más tarde';
                        }
                    }
                    
                    LoadingNotificationSystem.Notifications.error(
                        errorMsg,
                        errorDetails,
                        0 // No auto-dismiss para errores
                    );
                })
                .finally(function() {
                    $btn.text('Iniciar Sesión').prop('disabled', false);
                });
        },
        
        showRegister: function() {
            var vistaRegister = new Marvel.Views.VistaRegister();
            Marvel.vg.showChildView('modal', vistaRegister);
            // No cerrar el modal, solo cambiar el contenido
        },
        
        cancel: function() {
            Marvel.vg.closeModal();
        }
    });

})();
