// Sistema de Loading y Notificaciones para Marvel Comics Browser
(function() {
    'use strict';

    // Namespace para el sistema
    window.LoadingNotificationSystem = {
        
        // Sistema de Loading de Página Completa
        Loading: {
            overlay: null,
            isShowing: false,
            
            init: function() {
                this.overlay = document.getElementById('page-loading-overlay');
                if (!this.overlay) {
                    console.error('Loading overlay element not found');
                }
            },
            
            show: function(text = 'Buscando comics...', subtitle = 'Por favor espera') {
                if (!this.overlay) this.init();
                if (this.isShowing) return;
                
                const textElement = document.getElementById('loading-text');
                const subtitleElement = document.getElementById('loading-subtitle');
                
                if (textElement) textElement.textContent = text;
                if (subtitleElement) subtitleElement.textContent = subtitle;
                
                this.overlay.classList.add('show');
                this.isShowing = true;
                
                // Bloquear scroll del body
                document.body.style.overflow = 'hidden';
            },
            
            hide: function() {
                if (!this.overlay || !this.isShowing) return;
                
                this.overlay.classList.remove('show');
                this.isShowing = false;
                
                // Restaurar scroll del body
                document.body.style.overflow = '';
            },
            
            updateText: function(text, subtitle) {
                const textElement = document.getElementById('loading-text');
                const subtitleElement = document.getElementById('loading-subtitle');
                
                if (textElement && text) textElement.textContent = text;
                if (subtitleElement && subtitle) subtitleElement.textContent = subtitle;
            }
        },
        
        // Sistema de Notificaciones Popup
        Notifications: {
            container: null,
            notifications: [],
            nextId: 1,
            
            init: function() {
                this.container = document.getElementById('notification-container');
                if (!this.container) {
                    console.error('Notification container element not found');
                }
            },
            
            show: function(options = {}) {
                if (!this.container) this.init();
                
                const config = {
                    type: options.type || 'info', // success, error, warning, info
                    title: options.title || '',
                    message: options.message || '',
                    duration: options.duration !== undefined ? options.duration : 5000, // 0 = no auto-dismiss
                    showCloseButton: options.showCloseButton !== undefined ? options.showCloseButton : true,
                    onClick: options.onClick || null
                };
                
                const notification = this.createNotification(config);
                this.notifications.push(notification);
                this.container.appendChild(notification.element);
                
                // Trigger animation
                setTimeout(() => {
                    notification.element.classList.add('show');
                }, 50);
                
                // Auto-dismiss
                if (config.duration > 0) {
                    this.startProgressBar(notification, config.duration);
                    notification.timeout = setTimeout(() => {
                        this.hide(notification.id);
                    }, config.duration);
                }
                
                return notification.id;
            },
            
            createNotification: function(config) {
                const id = this.nextId++;
                const element = document.createElement('div');
                element.className = `notification ${config.type}`;
                element.setAttribute('data-id', id);
                
                const icons = {
                    success: '✅',
                    error: '❌',
                    warning: '⚠️',
                    info: 'ℹ️'
                };
                
                let closeButton = '';
                if (config.showCloseButton) {
                    closeButton = '<button class="notification-close" type="button">&times;</button>';
                }
                
                let progressBar = '';
                if (config.duration > 0) {
                    progressBar = `
                        <div class="notification-progress">
                            <div class="notification-progress-bar"></div>
                        </div>
                    `;
                }
                
                element.innerHTML = `
                    <div class="notification-icon">${icons[config.type] || icons.info}</div>
                    <div class="notification-content">
                        ${config.title ? `<div class="notification-title">${config.title}</div>` : ''}
                        ${config.message ? `<div class="notification-message">${config.message}</div>` : ''}
                    </div>
                    ${closeButton}
                    ${progressBar}
                `;
                
                // Event listeners
                if (config.showCloseButton) {
                    const closeBtn = element.querySelector('.notification-close');
                    closeBtn.addEventListener('click', () => {
                        this.hide(id);
                    });
                }
                
                if (config.onClick) {
                    element.addEventListener('click', config.onClick);
                    element.style.cursor = 'pointer';
                }
                
                return {
                    id: id,
                    element: element,
                    config: config,
                    timeout: null
                };
            },
            
            startProgressBar: function(notification, duration) {
                const progressBar = notification.element.querySelector('.notification-progress-bar');
                if (progressBar) {
                    progressBar.style.transitionDuration = duration + 'ms';
                    setTimeout(() => {
                        progressBar.style.transform = 'translateX(0)';
                    }, 100);
                }
            },
            
            hide: function(id) {
                const index = this.notifications.findIndex(n => n.id === id);
                if (index === -1) return;
                
                const notification = this.notifications[index];
                
                // Clear timeout
                if (notification.timeout) {
                    clearTimeout(notification.timeout);
                }
                
                // Animate out
                notification.element.classList.remove('show');
                notification.element.classList.add('hide');
                
                // Remove from DOM and array
                setTimeout(() => {
                    if (notification.element.parentNode) {
                        notification.element.parentNode.removeChild(notification.element);
                    }
                    this.notifications.splice(index, 1);
                }, 400);
            },
            
            hideAll: function() {
                this.notifications.forEach(notification => {
                    this.hide(notification.id);
                });
            },
            
            // Métodos de conveniencia
            success: function(title, message, duration) {
                return this.show({
                    type: 'success',
                    title: title,
                    message: message,
                    duration: duration
                });
            },
            
            error: function(title, message, duration = 0) {
                return this.show({
                    type: 'error',
                    title: title,
                    message: message,
                    duration: duration // Error notifications don't auto-dismiss by default
                });
            },
            
            warning: function(title, message, duration) {
                return this.show({
                    type: 'warning',
                    title: title,
                    message: message,
                    duration: duration
                });
            },
            
            info: function(title, message, duration) {
                return this.show({
                    type: 'info',
                    title: title,
                    message: message,
                    duration: duration
                });
            },
            
            // Métodos especiales para notificaciones interactivas
            confirm: function(options = {}) {
                const config = {
                    type: 'warning',
                    title: options.title || '¿Confirmar acción?',
                    message: options.message || '¿Estás seguro de que quieres continuar?',
                    duration: 0, // No auto-dismiss
                    showCloseButton: false,
                    confirmText: options.confirmText || 'Confirmar',
                    cancelText: options.cancelText || 'Cancelar',
                    onConfirm: options.onConfirm || function() {},
                    onCancel: options.onCancel || function() {}
                };
                
                const notification = this.createConfirmNotification(config);
                this.notifications.push(notification);
                this.container.appendChild(notification.element);
                
                // Trigger animation
                setTimeout(() => {
                    notification.element.classList.add('show');
                }, 50);
                
                return notification.id;
            },
            
            createConfirmNotification: function(config) {
                const id = this.nextId++;
                const element = document.createElement('div');
                element.className = `notification ${config.type} notification-confirm`;
                element.setAttribute('data-id', id);
                
                const icons = {
                    warning: '⚠️',
                    info: 'ℹ️'
                };
                
                element.innerHTML = `
                    <div class="notification-icon">${icons[config.type] || icons.warning}</div>
                    <div class="notification-content">
                        <div class="notification-title">${config.title}</div>
                        <div class="notification-message">${config.message}</div>
                        <div class="notification-actions">
                            <button class="notification-btn notification-btn-cancel" type="button">${config.cancelText}</button>
                            <button class="notification-btn notification-btn-confirm" type="button">${config.confirmText}</button>
                        </div>
                    </div>
                `;
                
                // Event listeners
                const confirmBtn = element.querySelector('.notification-btn-confirm');
                const cancelBtn = element.querySelector('.notification-btn-cancel');
                
                confirmBtn.addEventListener('click', () => {
                    config.onConfirm();
                    this.hide(id);
                });
                
                cancelBtn.addEventListener('click', () => {
                    config.onCancel();
                    this.hide(id);
                });
                
                return {
                    id: id,
                    element: element,
                    config: config,
                    timeout: null
                };
            },

            // ...existing code...
        },
        
        // Inicialización del sistema completo
        init: function() {
            this.Loading.init();
            this.Notifications.init();
        }
    };
    
    // Auto-inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            LoadingNotificationSystem.init();
        });
    } else {
        LoadingNotificationSystem.init();
    }
    
})();
