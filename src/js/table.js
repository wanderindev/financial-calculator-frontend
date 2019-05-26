(function(app, $) {
    // Moves back on page.
    app.goBack = function() {
        app.selectPage(app.pagination.currentPage - 1);
    };

    // Moves forward on page.
    app.goForward = function() {
        app.selectPage(app.pagination.currentPage + 1);
    };

    // Moves to first page.
    app.goFirst = function() {
        app.selectPage(1);
    };

    // Moves to last page.
    app.goLast = function() {
        app.selectPage(app.pagination.totalPages);
    };

    // Selects a table page.
    app.selectPage = function(page) {
        if (page !== app.pagination.currentPage && page > 0 && page <= app.pagination.totalPages) {
            app.setTableInfo(page, app.table.index);
            app.updateTablePagination(page);
            app.updateTable();
        }
    };

    // Returns the html for the pagination.
    app.getPaginationHtml = function() {
        let html = '';

        if (app.pagination.firstPage === 1) {
            html = '<li><span class="pagination-ellipsis ellipsis-left has-text-white">&hellip;</span></li>';
        } else {
            html = '<li><span class="pagination-ellipsis ellipsis-left">&hellip;</span></li>';
        }

        app.pagination.pageSelect.forEach(function(item) {
            html += '<li><a class="pagination-link ';

            if (item.isActive) {
                html += 'is-current';
            }

            html += ' page-' + item.page + '" onclick="app.selectPage(' + item.page + ')">' + item.page + '</a></li>';
        });

        if (app.pagination.lastPage === app.pagination.totalPages) {
            html += '<li><span class="pagination-ellipsis ellipsis-right has-text-white">&hellip;</span></li>';
        } else {
            html += '<li><span class="pagination-ellipsis ellipsis-right">&hellip;</span></li>';
        }

        return html;
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

    // Returns the total number of rows in the table.
    app.getTotalRows = function() {
        return app.results[app.table.table].length;
    };

    // Returns the number to table pages.
    app.getNumOfPages = function() {
        return Math.ceil((app.getTotalRows(app.table.table) - 1) / app.table.numOfRows);
    };

    // Returns the number of pagination elements to display.
    app.getNumOfPageElements = function() {
        if (app.getNumOfPages() >= 5) {
            return 5;
        }

        return app.getNumOfPages();
    };

    // Sets table pagination metadata.
    app.setPaginationInfo = function(page) {
        let elements = app.getNumOfPageElements();
        let currentPage = page;
        let firstPage, lastPage;

        if (currentPage < 3) {
            firstPage = 1;
        } else if (currentPage > app.getNumOfPages() - 2) {
            firstPage = app.getNumOfPages() - elements + 1;
        } else {
            firstPage = currentPage - 2;
        }

        lastPage = firstPage + elements - 1;

        // noinspection JSUnresolvedVariable
        app.pagination = {
            firstPage: firstPage,
            lastPage: lastPage,
            pageSelect: app.getPageSelect(firstPage, lastPage, currentPage),
            currentPage: currentPage,
            totalPages: app.getNumOfPages(),
            goBack: currentPage > 1,
            goForward:  currentPage < app.getNumOfPages(),
            elements: elements
        };
    };

    // Updates the table pagination.
    app.updateTablePagination = function(page = 1) {
        app.setPaginationInfo(page);
        app.togglePaginationDisabled();

        $('.pagination-list').html(app.getPaginationHtml());
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

    // Returns a list of tables to display depending on chosen time scale.
    app.getTimeScales = function() {
        // noinspection JSUnresolvedVariable
        return app.calcInfo.settings.tables[app.results.time_scale].display;
    };

    // Sets table metadata.
    app.setTableInfo = function(page = 1, index = 0) {
        let timeScale = app.getTimeScales()[index];
        // noinspection JSUnresolvedVariable
        let columns = app.calcInfo.tables[app.calculator].columns;
        // noinspection JSUnresolvedVariable
        let values = app.calcInfo.tables[app.calculator].values;
        let first = (page - 1) * timeScale.numOfRows;
        let last = page * timeScale.numOfRows;

        columns[0] = timeScale.label;

        app.table = {
            label: timeScale.label,
            table: timeScale.table,
            numOfRows : timeScale.numOfRows,
            columns: columns,
            values: values,
            first: first,
            last: last,
            index: index
        };
    };

    // Returns the table rows.
    app.getTableRows = function(first, last) {
        return app.results[app.table.table].slice(first, last);
    };

    // Returns the html for the results table.
    app.getTableHtml = function() {
        let rows = app.getTableRows(app.table.first, app.table.last);
        let tableHead = '';
        let tableBody = '';

        app.table.columns.forEach(function(column) {
            tableHead += '<th class="has-text-centered">' + column + '</th>';
        });

        rows.forEach(function(row) {
            tableBody += '<tr>';
            app.table.values.forEach(function(value) {
                if (value === 'p') {
                    tableBody += '<td class="has-text-centered">' + row[value] + '</td>';
                } else {
                    tableBody += '<td class="has-text-right">' + row[value] + '</td>';
                }
            });
            tableBody += '</tr>';
        });

        return [tableHead, tableBody];
    };

    // Updates the table upon menu or pagination events.
    app.updateTable = function() {
        let tableHead, tableBody;

        [tableHead, tableBody] = app.getTableHtml();

        $('.table thead tr').html(tableHead);
        $('.table tbody').html(tableBody);
    };

    // Sets table components and displays it.
    app.showTable = function() {
        app.setTableInfo();
        app.updateTableMenu();
        app.updateTablePagination();
        app.updateTable();

        $('.table-card').removeClass('is-invisible');
    };

})(window.app = window.app || {}, jQuery);
