((app, $, Plotly) => {
    // Builds and shows result charts.
    app.showCharts = () => {
        let getVal = function(val) {
            return app.results[val];
        };

        let getText = val => {
            return app.results[val].toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        };

        // noinspection JSUnresolvedVariable
        app.calcInfo.charts[app.calculator].forEach(item => {
            if (item.type === 'pie') {
                let data = app.calcInfo.settings.plotly.pie.data;
                let layout = app.calcInfo.settings.plotly.pie.layout;

                data.values = item.values.map(getVal);
                data.text = item.values.map(getText);
                data.labels = item.labels;
                layout.title = item.title;

                Plotly.newPlot('pie-chart', [data], layout, {displayModeBar: false});
            } else if (item.type === 'line') {
                let data = [];
                let layout = app.calcInfo.settings.plotly.line.layout;

                layout.title = item.title;

                item.traces.forEach(trace => {
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
})(window.app = window.app || {}, jQuery, Plotly);
