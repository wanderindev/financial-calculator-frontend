(function(app, $) {
    $(document).ready(function() {
        let headerLogo$ = $('.header-logo');
        let navbarMenu$ = $('.navbar-menu');
        let navbarItem$ = $('.navbar-end a.navbar-item');
        let navbarBurger$ = $('.navbar-burger');


        // Check for click events on the navbar burger icon
        navbarBurger$.click(function() {
            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            navbarBurger$.toggleClass('is-active');
            navbarMenu$.toggleClass('is-active');
            navbarItem$.toggleClass('is-active');
            headerLogo$.toggleClass('is-active');
        });
    });
})(window.app || {}, jQuery);
