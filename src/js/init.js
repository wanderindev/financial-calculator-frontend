(function(app, $) {
    $(document).ready(function() {
        let headerLogo$ = $('.header-logo');
        let navbarMenu$ = $('.navbar-menu');
        let navbarItem$ = $('.navbar-end a.navbar-item');
        let navbarBurger$ = $('.navbar-burger');
        let extraDepRadio$ = $('.extra_dep_r, .extra_pmt_r');
        let extraDepF$ = $('.extra_dep_f, .extra_pmt_f');
        let extraDepStart$ = $('.extra_dep_start, .extra_pmt_start');
        let extraDep$ = $('.extra_dep, .extra_pmt');
        let timeScaleRadio$ = $('.time-scale-r');

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
                $('#extra_pmt, #extra_pmt_start, #extra_dep, #extra_dep_start').val('');
                app.showExtraPmtInfo = false;
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

        // Changes the time scale of the table.
        timeScaleRadio$.change(function() {
            let index = $(this).children(':first').val();

            app.setTableInfo(1, index);
            app.updateTablePagination();
            app.updateTable();
        });

        // Parses calculator data.
        $.getJSON('data.json', function(data) {
            app.calcInfo = data;
        });
    });
})(window.app = window.app || {}, jQuery);
