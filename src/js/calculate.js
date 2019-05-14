(function(app, $, Plotly) {
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

    app.showResults = function() {
        app.calcInfo.results[app.calculator].forEach(function(item) {
            $('#' + item.id).val(app.results[item.id]);
        });
        $('.results-card').removeClass('is-invisible');
    };

    app.showCharts = function() {
        let getVal = function(val) {
            return app.results[val];
        };

        // noinspection JSUnresolvedVariable
        app.calcInfo.charts[app.calculator].forEach(function(item) {
            if (item.type === 'pie') {
                let data = app.calcInfo.settings.plotly.pie.data;
                let layout = app.calcInfo.settings.plotly.pie.layout;

                data.values = item.values.map(getVal);
                data.labels = item.labels;
                layout.title = item.title;

                Plotly.newPlot('pie-chart', [data], layout, {displayModeBar: false});
            } else if (item.type === 'line') {
                let data = [];
                let layout = app.calcInfo.settings.plotly.line.layout;

                layout.title = item.title;

                item.traces.forEach(function(trace) {
                    data.push({
                        type: item.type,
                        x: app.results[trace.x],
                        y: app.results[trace.y],
                        name: trace.name,
                        showlegend: trace.showlegend,
                        hoverinfo: trace.hoverinfo
                    });
                });

                Plotly.newPlot('line-chart', data, layout, {displayModeBar: false});
            }
        });
    };

    app.updateTableMenu = function() {
        app.tableTimeScales.forEach(function(item, index) {
            $('#tsr-' + index).removeClass('is-hidden');
            $('#tsr-' + index + ' span.radio-text').html(item.label);
        });

        $('#tsr-0 input').prop('checked', true);
    };

    app.updateTablePagination = function() {
        app.totalRecords = app.currentTable.length;
        app.totalPages = Math.ceil(app.totalRecords / app.tableRows);
    };

    app.updateTable = function() {
        // noinspection JSUnresolvedVariable
        let columns = app.calcInfo.tables[app.calculator]['columns'];
        // noinspection JSUnresolvedVariable
        let values = app.calcInfo.tables[app.calculator]['values'];
        let firstRow = (app.tablePage - 1) * app.tableRows;
        let lastRow = app.tablePage * app.tableRows;
        let rows = app.results[app.currentTable].slice(firstRow, lastRow);
        let tableHead = '';
        let tableBody = '';

        columns[0] = app.currentTimeScale;

        columns.forEach(function(column) {
            tableHead += '<th>' + column + '</th>';
        });

        rows.forEach(function(row) {
            tableBody += '<tr>';
            values.forEach(function(value) {
                tableBody += '<td>' + row[value] + '</td>';
            });
            tableBody += '</tr>';
        });

        $('.table thead tr').html(tableHead);
        $('.table tbody').html(tableBody);
    };

    app.showTable = function() {
        if (app.results.table){
            app.tableTimeScales = app.calcInfo.settings['tables'][app.results['time_scale']].display;
            app.currentTable = app.tableTimeScales[0]['table'];
            app.currentTimeScale = "Año";
            app.tableRows = app.tableTimeScales[0]['numOfRows'];
            app.tablePage = 1;

            app.updateTableMenu();
            app.updateTablePagination();
            app.updateTable();

            $('.table-card').removeClass('is-invisible');
        }
    };

    // Gets the results from the backend.
    app.calculate = function(calculator) {
        let baseUrl = 'http://localhost:5001/';
        let endpoint = app.getEndpoint(calculator);
        let data = app.getData(calculator);

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
                app.results = results;
                app.calculator = calculator;
                app.showResults();
                app.showCharts();
                app.showTable();
            },
            dataType: 'json',
            error: function(e) {
                console.log(e);
            }
        });
    };
})(window.app = window.app || {}, jQuery, Plotly);
