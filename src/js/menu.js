(function(app, $) {
    app.menu = {
        links: {
            calc1: {
                url: '/calculadora-de-ahorros.html',
                active: function() {
                    return window.location.pathname === this.calc1.url ? 'is-active' : null;
                }
            },
            calc2: {
                url: '/ahorros-para-lograr-meta.html',
                active: function() {
                    return window.location.pathname === this.calc2.url ? 'is-active' : null;
                }
            },
            calc3: {
                url: '/tiempo-para-lograr-meta.html',
                active: function() {
                    return window.location.pathname === this.calc3.url ? 'is-active' : null;
                }
            },
            calc4: {
                url: '/tasa-de-interes-requerida.html',
                active: function() {
                    return window.location.pathname === this.calc4.url ? 'is-active' : null;
                }
            },
            calc5: {
                url: '/valor-actual.html',
                active: function() {
                    return window.location.pathname === this.calc5.url ? 'is-active' : null;
                }
            },
            calc6: {
                url: '/calculadora-de-prestamo.html',
                active: function() {
                    return window.location.pathname === this.calc6.url ? 'is-active' : null;
                }
            },
            calc7: {
                url: '/tasa-de-interes-real.html',
                active: function() {
                    return window.location.pathname === this.calc7.url ? 'is-active' : null;
                }
            },
            calc8: {
                url: '/tiempo-para-cancelar-prestamo.html',
                active: function() {
                    return window.location.pathname === this.calc8.url ? 'is-active' : null;
                }
            },
            calc9: {
                url: '/fondo-para-retiros.html',
                active: function() {
                    return window.location.pathname === this.calc9.url ? 'is-active' : null;
                }
            },
            calc10: {
                url: '/retiros-para-agotar-fondo.html',
                active: function() {
                    return window.location.pathname === this.calc10.url ? 'is-active' : null;
                }
            },
            calc11: {
                url: '/duracion-de-fondo.html',
                active: function() {
                    return window.location.pathname === this.calc11.url ? 'is-active' : null;
                }
            },
            calc12: {
                url: '/tarjetas-pago-minimo.html',
                active: function() {
                    return window.location.pathname === this.calc12.url ? 'is-active' : null;
                }
            },
            calc13: {
                url: '/tarjetas-pago-fijo.html',
                active: function() {
                    return window.location.pathname === this.calc13.url ? 'is-active' : null;
                }
            },
            calc14: {
                url: '/tarjetas-tasa-de-interes-real.html',
                active: function() {
                    return window.location.pathname === this.calc14.url ? 'is-active' : null;
                }
            }
        }
    };

    app.loadMenu = function() {
        $.get('/templates/menu.mustache', function(template) {
            let menu = Mustache.render(template, app.menu.links);
            $('.mst-menu').html(menu);
        });
    };

    $(document).ready(function() {
        app.loadMenu();
    });
})(window.app || {}, jQuery);
