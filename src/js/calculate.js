(function(app, $) {
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

    app.showResults = function(calculator, results) {
        app.calcInfo.results[calculator].forEach(function(item) {
            $('#' + item.id).val(results[item.id]);
        });
        $('.results-card').removeClass('is-invisible');
    };

    // Gets the results from the backend.
    app.calculate = function(calculator) {
        let baseUrl = 'http://localhost:5001/';
        let endpoint = app.getEndpoint(calculator);
        let data = app.getData(calculator);
        console.log(data);

        // noinspection JSUnusedGlobalSymbols
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
                app.showResults(calculator, results);
            },
            dataType: 'json',
            error: function(e) {
                console.log(e);
            }
        });
    };
})(window.app = window.app || {}, jQuery);
