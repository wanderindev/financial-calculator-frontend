((app, $) => {
    // Moves back on page.
    app.goBack = () => {
        app.selectPage(app.pagination.currentPage - 1);
    };

    // Moves forward on page.
    app.goForward = () => {
        app.selectPage(app.pagination.currentPage + 1);
    };

    // Moves to first page.
    app.goFirst = () => {
        app.selectPage(1);
    };

    // Moves to last page.
    app.goLast = ()=> {
        app.selectPage(app.pagination.totalPages);
    };

    // Selects a table page.
    app.selectPage = page => {
        if (page !== app.pagination.currentPage && page > 0 && page <= app.pagination.totalPages) {
            app.setTableInfo(page, app.table.index);
            app.updateTablePagination(page);
            app.updateTable();
        }
    };

    // Returns the html for the pagination.
    app.getPaginationHtml = function() {
        let html = '';

        app.pagination.pageSelect.forEach(item => {
            html += '<li><a class="pagination-link ';

            if (item.isActive) {
                html += 'is-current';
            }

            html += ' page-' + item.page + '" onclick="app.selectPage(' + item.page + ')">' + item.page + '</a></li>';
        });

        return html;
    };

    // Toggles pagination disabled state.
    app.togglePaginationDisabled = () => {
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
    app.getPageSelect = (first, last, active) => {
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
    app.getTotalRows = () => {
        return app.results[app.table.table].length;
    };

    // Returns the number to table pages.
    app.getNumOfPages = () => {
        return Math.ceil((app.getTotalRows(app.table.table) - 0.99) / app.table.numOfRows);
    };

    // Returns the number of pagination elements to display.
    app.getNumOfPageElements = () => {
        if (app.getNumOfPages() >= 3) {
            return 3;
        }

        return app.getNumOfPages();
    };

    // Sets table pagination metadata.
    app.setPaginationInfo = page => {
        let elements = app.getNumOfPageElements();
        let currentPage = page;
        let firstPage, lastPage;

        if (currentPage < 2) {
            firstPage = 1;
        } else if (currentPage > app.getNumOfPages() - 1) {
            firstPage = app.getNumOfPages() - elements + 1;
        } else {
            firstPage = currentPage - 1;
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
    app.updateTablePagination = (page = 1) => {
        app.setPaginationInfo(page);
        app.togglePaginationDisabled();

        $('.pagination-list').html(app.getPaginationHtml());
    };

    // Updates html for table menu.
    app.updateTableMenu = () => {
        let timeScales = app.getTimeScales();
        $('#tsr-0').addClass('is-hidden');
        $('#tsr-1').addClass('is-hidden');
        $('#tsr-2').addClass('is-hidden');

        timeScales.forEach((item, index) => {
            $('#tsr-' + index).removeClass('is-hidden');
            $('#tsr-' + index + ' span.radio-text').html(item.label);
        });

        $('#tsr-0 input').prop('checked', true);
    };

    // Returns a list of tables to display depending on chosen time scale.
    app.getTimeScales = () => {
        // noinspection JSUnresolvedVariable
        let timeScale = app.calcInfo.settings.tables[app.results.time_scale].display;
        timeScale[timeScale.length -1].numOfRows = app.results.table.length;

        return timeScale;
    };

    // Sets table metadata.
    app.setTableInfo = (page = 1, index = 0) => {
        let timeScale = app.getTimeScales()[index];
        // noinspection JSUnresolvedVariable
        let columns = app.calcInfo.tables[app.calculator].columns;
        // noinspection JSUnresolvedVariable
        let values = app.calcInfo.tables[app.calculator].values;
        let first = (page - 1) * timeScale.numOfRows;
        let last = page * timeScale.numOfRows;

        if (timeScale.label === "Todo") {
            columns[0] = app.getTimeScales()[index - 1].label;
        } else {
            columns[0] = timeScale.label;
        }

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
    app.getTableRows = (first, last) => {
        return app.results[app.table.table].slice(first, last);
    };

    // Returns the html for the results table.
    app.getTableHtml = () => {
        let rows = app.getTableRows(app.table.first, app.table.last);
        let tableHead = '';
        let tableBody = '';

        app.table.columns.forEach(column => {
            tableHead += '<th class="has-text-centered">' + column + '</th>';
        });

        rows.forEach(row => {
            tableBody += '<tr>';
            app.table.values.forEach(value => {
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
    app.updateTable = () => {
        let tableHead, tableBody;

        [tableHead, tableBody] = app.getTableHtml();

        $('.table thead tr').html(tableHead);
        $('.table tbody').html(tableBody);
    };

    // Sets table components and displays it.
    app.showTable = () => {
        app.setTableInfo();
        app.updateTableMenu();
        app.updateTablePagination();
        app.updateTable();

        $('.table-card').removeClass('is-invisible');
    };

})(window.app = window.app || {}, jQuery);
