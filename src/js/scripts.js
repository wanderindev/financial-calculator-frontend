$(document).ready(function() {
    var headerLogo$ = $(".header-logo");
    var navbarMenu$ = $(".navbar-menu");
    var navbarItem$ = $(".navbar-end a.navbar-item");
    var navbarBurger$ = $(".navbar-burger");


    // Check for click events on the navbar burger icon
    navbarBurger$.click(function() {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        navbarBurger$.toggleClass("is-active");
        navbarMenu$.toggleClass("is-active");
        navbarItem$.toggleClass("is-active");
        headerLogo$.toggleClass("is-active");
    });
});
