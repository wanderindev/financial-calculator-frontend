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

    // Builds and shows results.
    app.showResults = function() {
        app.calcInfo.results[app.calculator].forEach(function(item) {
            $('#' + item.id).val(app.results[item.id]);
        });
        $('.results-card').removeClass('is-invisible');
    };

    // Builds and shows result charts.
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

    // Updates html for table menu.
    app.updateTableMenu = function() {
        let timeScales = app.getTimeScales();

        timeScales.forEach(function(item, index) {
            $('#tsr-' + index).removeClass('is-hidden');
            $('#tsr-' + index + ' span.radio-text').html(item.label);
        });

        $('#tsr-0 input').prop('checked', true);
    };

    // Returns the number to table pages.
    app.getNumOfPages = function() {
        return Math.ceil((app.getTotalRows(app.table.table) - 1) / app.table.numOfRows);
    };

    // Returns the total number of rows in the table.
    app.getTotalRows = function() {
        return app.results[app.table.table].length;
    };

    // Selects a table page.
    app.changePage = function(page) {
        console.log(page);
        if (page !== app.pagination.currentPage) {
            $('.page-' + app.pagination.currentPage).removeClass('is-current');
            $('.page-' + page).addClass('is-current');

            app.pagination.currentPage = page;
            app.pagination.goBack = page > 1;
            app.pagination.goForward =  page < app.pagination.totalPages;

            app.togglePaginationDisabled();
            app.updateTable(page);
        }
    };

    // Moves back on page.
    app.goBack = function() {
        app.changePage(app.pagination.currentPage - 1);
    };

    // Moves forward on page.
    app.goForward = function() {
        app.changePage(app.pagination.currentPage + 1);
    };

    // Displays the first page of the table.
    app.goToFirstPage = function() {
        //let first = 1;
        //let last = app.getNumOfPages() >= app.currentContext.pagination.numEle
          //  ? app.currentContext.pagination.numEle
          //  : app.getNumOfPages();

        //app.changePage(first, last, first);
    };

    // Returns the pages to be shown in the pagination.
    app.getPageSelect = function(first, last, active) {
        let pageSelect = [];

        for (let i = first; i <= last; i++) {
            pageSelect.push(
                {
                    isActive: active === i,
                    page: i
                }
            );
        }

        return pageSelect;
    };

    // Returns the number of pagination elements to display.
    app.getNumOfPageElements = function() {
        if (app.getNumOfPages() >= 5) {
            return 5
        }

        return app.getNumOfPages()
    };

    // Toggles pagination disabled state.
    app.togglePaginationDisabled = function() {
        let prev$ = $('.pagination-previous');
        let next$ = $('.pagination-next');

        // Toggle disabled attributes.
        if (app.pagination.goBack) {
            prev$.attr('disabled', false);
        } else {
            prev$.attr('disabled', true);
        }

        if (app.pagination.goForward) {
            next$.attr('disabled', false);
        } else {
            next$.attr('disabled', true);
        }
    };

    // Returns the html for the pagination.
    app.getPaginationHtml = function() {
        let html = '';
        app.pagination.pageSelect.forEach(function(item) {
            html += '<li><a class="pagination-link ';

            if (item.isActive) {
                html += 'is-current';
            }

            html += ' page-' + item.page + '" onclick="app.changePage(' + item.page + ')">' + item.page + '</a></li>'
        });

        return html;
    };

    // Renders the updated pagination.
    app.displayPagination = function() {
        app.togglePaginationDisabled();

        $('.pagination-list').html(app.getPaginationHtml());
    };

    // Updates the pagination on click.
    app.updateTablePagination = function(page) {

    };

    // Resets the table pagination.
    app.resetTablePagination = function(page = 1) {
        let elements = app.getNumOfPageElements();
        let first = 1;
        let last = first + elements - 1;
        let active = page;

        // noinspection JSUnresolvedVariable
        app.pagination = {
            firstPage: first,
            lastPage: last,
            pageSelect: app.getPageSelect(first, last, active),
            currentPage: active,
            totalPages: app.getNumOfPages(),
            goBack: active > 1,
            goForward:  active < app.getNumOfPages(),
            elements: elements
        };

        app.displayPagination();
    };

    // Updates the table upon menu or pagination events.
    app.updateTable = function(page = 1) {
        let columns, values, first, last, rows;
        let tableHead = '';
        let tableBody = '';

        [columns, values, first, last] = app.getTableStructure(page);
        rows = app.getTableRows(first, last);

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

    // Returns the table rows.
    app.getTableRows = function(first, last) {
        return app.results[app.table.table].slice(first, last);
    };

    // Returns a list of tables to display depending on chosen time scale.
    app.getTimeScales = function() {
        // noinspection JSUnresolvedVariable
        return app.calcInfo.settings.tables[app.results.time_scale].display;
    };

    // Returns metadata about table to be displayed.
    app.getTableInfo = function(index = 0) {
        let timeScale = app.getTimeScales()[index];
        let label = timeScale.label;
        let table = timeScale.table;
        // noinspection JSUnresolvedVariable
        let numOfRows = timeScale.numOfRows;

        return [label, table, numOfRows];
    };

    // Returns info about data to display in table.
    app.getTableStructure = function(page) {
        // noinspection JSUnresolvedVariable
        let columns = app.calcInfo.tables[app.calculator].columns;
        // noinspection JSUnresolvedVariable
        let values = app.calcInfo.tables[app.calculator].values;
        let first = (page - 1) * app.table.numOfRows;
        let last = page * app.table.numOfRows;

        columns[0] = app.table.label;

        return [columns, values, first, last];
    };

    // Sets table components and displays it.
    app.showTable = function() {
        let label, table, numOfRows;
        [label, table, numOfRows] = app.getTableInfo();

        app.table = {
            label: label,
            table: table,
            numOfRows : numOfRows
        };

        app.updateTableMenu();
        app.resetTablePagination();
        app.updateTable();

        $('.table-card').removeClass('is-invisible');
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
})(window.app = window.app || {}, jQuery, Plotly);
