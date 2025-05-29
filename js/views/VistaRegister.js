Marvel.Views = Marvel.Views || {};

(function () {
    'use strict';

    Marvel.Views.VistaRegister = Mn.ItemView.extend({
        template: '#VistaRegisterTmpl',
        
        events: {
            'click #btn-register-submit': 'register',
            'click #btn-show-login': 'showLogin',
            'click #btn-cancel-register': 'cancel',
            'keypress #confirmPassword': 'onEnterKey',
            'submit form': 'preventDefault'
        },
        
        preventDefault: function(e) {
            e.preventDefault();
        },
        
        onEnterKey: function(e) {
            if (e.which === 13) { // Enter key
                this.register();
            }
        },
        
        register: function() {
            var email = this.$('#email').val().trim();
            var password = this.$('#password').val();
            var confirmPassword = this.$('#confirmPassword').val();
            
            if (!email || !password || !confirmPassword) {
                LoadingNotificationSystem.Notifications.warning(
                    'Campos requeridos',
                    'Por favor, completa todos los campos',
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
            
            // Validar longitud de contraseña
            if (password.length < 6) {
                LoadingNotificationSystem.Notifications.warning(
                    'Contraseña muy corta',
                    'La contraseña debe tener al menos 6 caracteres',
                    4000
                );
                return;
            }
            
            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                LoadingNotificationSystem.Notifications.warning(
                    'Contraseñas no coinciden',
                    'Verifica que ambas contraseñas sean iguales',
                    4000
                );
                return;
            }
            
            var self = this;
            var $btn = this.$('#btn-register-submit');
            
            $btn.text('Creando cuenta...').prop('disabled', true);
            
            // Mostrar loading overlay
            LoadingNotificationSystem.Loading.show(
                'Creando cuenta...',
                'Configurando tu perfil en Marvel Comics'
            );
            
            Marvel.Services.FirebaseService.register(email, password)
                .then(function() {
                    LoadingNotificationSystem.Loading.hide();
                    
                    // Notificación de éxito
                    LoadingNotificationSystem.Notifications.success(
                        '¡Cuenta creada exitosamente!',
                        'Ya puedes marcar comics como favoritos y disfrutar de todas las funciones',
                        5000
                    );
                    
                    // El registro fue exitoso, cerrar modal
                    Marvel.vg.closeModal();
                    // Disparar evento para actualizar vistas
                    Backbone.trigger('user:loginChanged', true);
                })
                .catch(function(error) {
                    LoadingNotificationSystem.Loading.hide();
                    console.error('Error de registro:', error);
                    var errorMsg = 'Error al crear la cuenta';
                    var errorDetails = '';
                    
                    if (error.code) {
                        switch (error.code) {
                            case 'auth/email-already-in-use':
                                errorMsg = 'Email ya registrado';
                                errorDetails = 'Ya existe una cuenta con este email. ¿Quieres iniciar sesión?';
                                break;
                            case 'auth/invalid-email':
                                errorMsg = 'Email inválido';
                                errorDetails = 'El formato del email no es válido';
                                break;
                            case 'auth/weak-password':
                                errorMsg = 'Contraseña muy débil';
                                errorDetails = 'Usa una contraseña más segura con letras, números y símbolos';
                                break;
                            case 'auth/operation-not-allowed':
                                errorMsg = 'Registro deshabilitado';
                                errorDetails = 'El registro de nuevas cuentas está temporalmente deshabilitado';
                                break;
                            default:
                                errorMsg = 'Error de conexión';
                                errorDetails = error.message || 'Intenta nuevamente más tarde';
                        }
                    } else {
                        errorMsg = 'Error de conexión';
                        errorDetails = error.message || 'Verifica tu conexión a internet';
                    }
                    
                    LoadingNotificationSystem.Notifications.error(
                        errorMsg,
                        errorDetails,
                        0 // No auto-dismiss para errores
                    );
                })
                .finally(function() {
                    $btn.text('Crear Cuenta').prop('disabled', false);
                });
        },
        
        showLogin: function() {
            var vistaLogin = new Marvel.Views.VistaLogin();
            Marvel.vg.showChildView('modal', vistaLogin);
            // No cerrar el modal, solo cambiar el contenido
        },
        
        cancel: function() {
            Marvel.vg.closeModal();
        }
    });

})();
