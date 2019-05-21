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
        let timeScales = app.getTimeScales();

        timeScales.forEach(function(item, index) {
            $('#tsr-' + index).removeClass('is-hidden');
            $('#tsr-' + index + ' span.radio-text').html(item.label);
        });

        $('#tsr-0 input').prop('checked', true);
    };

    app.updateTablePagination = function() {
        //app.totalRecords = app.currentTable.length;
        //app.totalPages = Math.ceil(app.totalRecords / app.tableRows);
    };


    app.updateTable = function(label, table, numOfRows, page = 1) {
        let columns, values, first, last, rows;
        let tableHead = '';
        let tableBody = '';

        [columns, values, first, last] = app.getTableStructure(label, numOfRows, page);
        rows = app.getTableRows(table, first, last);

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

    app.getTableRows = function(table, first, last) {
        return app.results[table].slice(first, last);
    };

    app.getTimeScales = function() {
        return app.calcInfo.settings['tables'][app.results['time_scale']].display;
    };

    app.getTableInfo = function(index = 0) {
        let timeScale = app.getTimeScales()[index];
        let label = timeScale.label;
        let table = timeScale.table;
        // noinspection JSUnresolvedVariable
        let numOfRows = timeScale.numOfRows;

        return [label, table, numOfRows];
    };

    app.getTableStructure = function(label, numOfRows, page) {
        // noinspection JSUnresolvedVariable
        let columns = app.calcInfo.tables[app.calculator]['columns'];
        // noinspection JSUnresolvedVariable
        let values = app.calcInfo.tables[app.calculator]['values'];
        let first = (page - 1) * numOfRows;
        let last = page * numOfRows;

        columns[0] = label;

        return [columns, values, first, last];
    };

    app.showTable = function() {
        let label, table, numOfRows;
        [label, table, numOfRows] = app.getTableInfo();

        app.updateTableMenu();
        //app.updateTablePagination();
        app.updateTable(label, table, numOfRows);

        $('.table-card').removeClass('is-invisible');
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
})(window.app = window.app || {}, jQuery, Plotly);
