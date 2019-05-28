(function(app, $, Cleave) {
    // Builds the endpoint from the calculator's name.
    app.getEndpoint = function(calculator) {
        return calculator.replace(/ /g, '-').toLowerCase();
    };

    // Gets the form data.
    app.getData = function(calculator) {
        let data = {};
        app.calcInfo.forms[calculator].forEach(function(item) {
            if (item.type.endsWith('Radio')) {
                data[item.id] = $('input:radio[name="' + item.id + '"]:checked').val();
            } else {
                data[item.id] = $('#' + item.id).val();
            }
        });
        return data;
    };

    // Applies Cleave formatting to results.
    app.formatResults = function() {
        $('.money').toArray().forEach(function(el) {
            new Cleave(el, {
                numeral: true,
                prefix: '$ ',
                numeralDecimalScale: 2
            });
        });
    };

    // Builds and shows results.
    app.showResults = function() {
        app.calcInfo.results[app.calculator].forEach(function(item) {
            $('#' + item.id).val(app.results[item.id]);
        });
        app.formatResults();

        $('.results-card').removeClass('is-invisible');
    };

    // Gets the results from the backend.
    app.calculate = function(calculator) {
        let baseUrl = 'http://localhost:5001/';
        let endpoint = app.getEndpoint(calculator);
        let data = app.getData(calculator);

        $.ajax({
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            contentType: 'application/json',
            url: baseUrl + endpoint,
            data: JSON.stringify(data),
            success: function(results) {
                app.results = results;
                app.calculator = calculator;
                app.showResults();
                // noinspection JSUnresolvedVariable
                if (app.calcInfo.charts[app.calculator]) {
                    app.showCharts();
                }
                if (app.results.table) {
                    app.showTable();
                }
            },
            dataType: 'json',
            error: function(e) {
                console.log(e);
            }
        });
    };
})(window.app = window.app || {}, jQuery, Cleave);
