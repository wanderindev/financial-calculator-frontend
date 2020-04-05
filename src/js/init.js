(function(app, $) {
    $(document).ready(function() {
        let headerLogo$ = $('.header-logo');
        let navbarMenu$ = $('.navbar-menu');
        let navbarItem$ = $('.navbar-end a.navbar-item');
        let navbarBurger$ = $('.navbar-burger');
        let extraDepRadio$ = $('.extra_dep_r, .extra_pmt_r');
        let extraDepF$ = $('.extra_dep_f, .extra_pmt_f');
        let extraDepFSelect$ = $('#extra_dep_f, #extra_pmt_f');
        let extraDepStart$ = $('.extra_dep_start, .extra_pmt_start');
        let extraDep$ = $('.extra_dep, .extra_pmt');
        let timeScaleRadio$ = $('.time-scale-r');
        let freqSelect$ = $('#freq');
        let cardToggle$ = $('.card-toggle');
        let cardContent$ = $('.page-title .card-content');
        let cardIcon$ = $('.card-toggle i');

        freqSelect$.change(function() {
            let value = $(this).children("option:selected").val();
            let text = $(this).children("option:selected").text();
            extraDepFSelect$.children().remove();
            extraDepFSelect$.append($('<option />').val(0).text("Solo una vez"));
            if (text !== "Anual") {
                extraDepFSelect$.append($('<option />').val(1).text("Anual"));
            }
            extraDepFSelect$.append($('<option />').val(value).text(text));
        });

        cardToggle$.click(function() {
            cardContent$.toggleClass('is-hidden');
            cardIcon$.toggleClass('fa-angle-down');
            cardIcon$.toggleClass('fa-angle-right');
        });

        // Shows / hides the extra deposit fields.
        let toggleExtraDep = function(show) {
            if (show) {
                extraDepF$.removeClass('hide');
                extraDepStart$.removeClass('hide');
                extraDep$.removeClass('hide');
                $('#extra_pmt, #extra_dep').val('');
                $('#extra_pmt_start, #extra_dep_start').val('');
            } else {
                extraDepF$.addClass('hide');
                extraDepStart$.addClass('hide');
                extraDep$.addClass('hide');
                $('#extra_pmt, #extra_dep').val('0');
                $('#extra_pmt_start, #extra_dep_start').val('1');
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

        app.getNper = function() {
            nper = $('#num_of_years').val() * $('#freq').val();
            return nper;
        };
    });
})(window.app = window.app || {}, jQuery);
