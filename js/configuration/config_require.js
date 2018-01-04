requirejs.config({
    baseUrl: '../js/',
    paths: {
      'jquery': 'libraries/jquery/jquery-1.9.1.min',
      'bootstrap': 'libraries/bootstrap/js/bootstrap.min',
      'benchmarking': 'benchmarking',
      'jszip': 'libraries/kendoui/js/jszip.min',
      'kendo.all.min': 'libraries/kendoui/js/kendo.all.min',
      'kendo.culture.es-PE.min': 'libraries/kendoui/js/cultures/kendo.culture.es-PE.min',
      'kendo.messages.es-PE.min': 'libraries/kendoui/js/messages/kendo.messages.es-PE.min',
      'Handsontable': 'libraries/handsontable/dist/handsontable.full.min'
    },
    shim: {
        "bootstrap": {
            "deps": ['jquery']
        },
        "jszip": {
            "deps": ['jquery']
        },
        "kendo.all.min": {
            "deps": ['jszip']
        },
        "kendo.culture.es-PE.min": {
            "deps": ['kendo.all.min']
        },
        "kendo.messages.es-PE.min": {
            "deps": ['kendo.all.min']
        },
        "Handsontable": {
            "deps": ['jquery'],
            "exports": "Handsontable"
        }
    }
});