(function(app, $) {
    $(document).ready(function() {
        let headerLogo$ = $('.header-logo');
        let navbarMenu$ = $('.navbar-menu');
        let navbarItem$ = $('.navbar-end a.navbar-item');
        let navbarBurger$ = $('.navbar-burger');

        // Checks for click events on the navbar burger icon.
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
