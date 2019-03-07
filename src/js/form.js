(function(app, $) {
    app.formItemTemplates = [{
        type: 'textInput',
        tmpl: '/templates/text-input.mustache',
    },{
        type: 'freqSelect',
        tmpl: '/templates/freq-select.mustache',
    },{
        type: 'extraDepFSelect',
        tmpl: '/templates/extra-dep-f-select.mustache',
    },{
        type: 'extraDRadio',
        tmpl: '/templates/extra-d-radio.mustache',
    },{
        type: 'depWhenRadio',
        tmpl: '/templates/dep-when-radio.mustache',
    }];

    app.form = {
        calc1: {
            fields: [{
                type: 'textInput',
                id: 'ini-dep',
                label: 'Cantidad Inicial',
                placeholder: '',
                value: ''
            },{
                type: 'textInput',
                id: 'reg-dep',
                label: 'Aporte Regular',
                placeholder: '',
                value: ''
            },{
                type: 'freqSelect',
                id: 'freq',
                label: 'Frecuencia',
                placeholder: '',
                value: ''
            },{
                type: 'textInput',
                id: 'number-of-years',
                label: 'Tiempo (en años)',
                placeholder: '',
                value: ''
            },{
                type: 'textInput',
                id: 'rate',
                label: 'Interés (%)',
                placeholder: '',
                value: ''
            },{
                type: 'depWhenRadio',
                name: 'dep-when',
                label: 'Todos los aportes se hacen:',
                placeholder: '',
                value: ''
            },{
                type: 'extraDRadio',
                name: 'extra-d',
                label: '¿Aportes extraordinarios?',
                placeholder: '',
                value: ''
            },{
                type: 'textInput',
                id: 'extra-dep',
                label: 'Cantidad',
                placeholder: '',
                value: ''
            },{
                type: 'textInput',
                id: 'extra-dep-start',
                label: 'En el Período',
                placeholder: '',
                value: ''
            },{
                type: 'extraDepFSelect',
                id: 'extra-dep-f',
                label: 'Frecuencia',
                placeholder: '',
                value: ''
            },],
        },
    };

    app.loadForm = function() {
        let form = '';

        app.form['calc1'].fields.forEach(function(item) {
            console.log(item.type);
            console.log(app.partials);
            console.log(app.partials.textInput);
            form += Mustache.render(app.partials[item.type], item);
        });
        console.log(form);
        /*
        $.get('/templates/form.mustache', function(template) {
            console.log(template);
            let form = Mustache.render(
                template,
                {
                    fields: app.form['calc1'],
                    getPartial: function(){
                        return function(content, renderer) {
                            console.log(renderer);
                            console.log(content);
                            console.log(Mustache.render(content, this));
                            console.log(this);
                            return renderer('{{>' + Mustache.render(content, this) + '}}');
                        };
                    },
                },
                app.partials
            );
            $('.mst-form').html(form);
        });*/
    };

    $(document).ready(function() {
        app.partials = {};
        app.formItemTemplates.forEach(function(item) {
            $.get(item.tmpl, function(template) {
                app.partials[item.type] = template;
                console.log(app.partials[item.type]);
            });
        });

        app.loadForm();
    });
})(window.app || {}, jQuery);
