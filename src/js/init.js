(function(app, $) {
    $(document).ready(function() {
        let headerLogo$ = $('.header-logo');
        let navbarMenu$ = $('.navbar-menu');
        let navbarItem$ = $('.navbar-end a.navbar-item');
        let navbarBurger$ = $('.navbar-burger');
        let extraDepRadio$ = $('.extra_dep_r');
        let extraDepF$ = $('.extra_dep_f');
        let extraDepStart$ = $('.extra_dep_start');
        let extraDep$ = $('.extra_dep');

        // Shows / hides the extra deposit fields.
        let toggleExtraDep = function(show) {
            if (show) {
                extraDepF$.removeClass('hide');
                extraDepStart$.removeClass('hide');
                extraDep$.removeClass('hide');
            } else {
                extraDepF$.addClass('hide');
                extraDepStart$.addClass('hide');
                extraDep$.addClass('hide');
            }
        };

        // Make sure extra deposit fields are hidden on page load.
        toggleExtraDep(0);

        // Changes the visibility of extra deposit fields on click.
        extraDepRadio$.click(function() {
            toggleExtraDep(parseInt($(this).children(':first').val()));
        });

        // Toggles the "is-active" class on both the "navbar-burger" and the "navbar-menu".
        navbarBurger$.click(function() {
            // Toggles the "is-active" class on both the "navbar-burger" and the "navbar-menu".
            navbarBurger$.toggleClass('is-active');
            navbarMenu$.toggleClass('is-active');
            navbarItem$.toggleClass('is-active');
            headerLogo$.toggleClass('is-active');
        });

        // Parses calculator data.
        $.getJSON('data.json', function(data) {
            app.calcInfo = data;
        });
    });
})(window.app = window.app || {}, jQuery);
