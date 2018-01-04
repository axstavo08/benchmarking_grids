define([
    'jquery','jszip','kendo.all.min', 'Handsontable', 'bootstrap', 'kendo.culture.es-PE.min',
    'kendo.messages.es-PE.min'
], function($,JSZip,kendoGrid, Handsontable) {
     
    var vdata, vsdata, kgrid, wnd, detailsTemplate, crudServiceBaseUrl = "https://demos.telerik.com/kendo-ui/service",
        pivotgrid, spreadsheet, ALLOWED_EXTENSIONS = [".xlsx", ".csv", ".txt", ".json"], htable;

    function buildGrids() {
        buildKendoGrid();
        buildKendoPivotGrid();
        buildHandsontable();
    }

    function buildKendoGrid() {
        kendoGrid.culture("es-PE");
        kgrid = $("#kgrid1").kendoGrid({
            toolbar: [
                { name: "pdf", text: "Exportar PDF" },
                { name: "excel", text: "Exportar Excel" },
                { name: "create", text: "Agregar" },
                { name: "save", text: "Guardar Cambios" },
                { name: "cancel", text: "Cancelar Cambios" }
            ],
            //toolbar: kendo.template($("#template").html()),
            pdf: {
                allPages: true,
                avoidLinks: true,
                paperSize: "A4",
                margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                landscape: true,
                repeatHeaders: true,
                template: $("#page-template").html(),
                scale: 0.8
            },
            excel: {
                fileName: "Benchmarking_Grid_Export.xlsx",
                proxyURL: "https://demos.telerik.com/kendo-ui/service/export",
                filterable: true
            },
            //autoBind: false,
            dataSource: {
                //autoSync: true,
                transport: {
                    read:  {
                        url: crudServiceBaseUrl + "/Products",
                        dataType: "jsonp"
                    },
                    update: {
                        url: crudServiceBaseUrl + "/Products/Update",
                        dataType: "jsonp"
                    },
                    destroy: {
                        url: crudServiceBaseUrl + "/Products/Destroy",
                        dataType: "jsonp"
                    },
                    create: {
                        url: crudServiceBaseUrl + "/Products/Create",
                        dataType: "jsonp"
                    },
                    parameterMap: function(options, operation) {
                        if (operation !== "read" && options.models) {
                            return {models: kendo.stringify(options.models)};
                        }
                    }
                },
                batch: true,
                pageSize: 10,
                schema: {
                    model: {
                        id: "ProductID",
                        fields: {
                            ProductID: { editable: false, nullable: true },
                            ProductName: { validation: { required: true } },
                            UnitPrice: { type: "number", validation: { required: true, min: 1} },
                            Discontinued: { type: "boolean" },
                            UnitsInStock: { type: "number", validation: { min: 0, required: true } }
                        }
                    }
                }
            },
            selectable: "multiple cell",
            allowCopy: true,
            height: 460,
            groupable: true,
            //columnMenu: true,
            sortable: {
                mode: "multiple",
                allowUnsort: true,
                showIndexes: true
            },
            filterable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            reorderable: true,
            resizable: true,
            //toolbar: ["create", "save", "cancel"],
            editable: true,
            columns: [{
                field: "ProductName",
                title: "Nombre Producto",
                filterable: {
                    multi: true,
                    search: true
                },
                locked: true,
                lockable: false,
                width: 450,
                hidden: false
            }, {
                field: "UnitPrice",
                title: "Precio Unitario",
                width: 300,
                filterable: {
                    multi: true
                },
                format: "{0:c}",
                hidden: false
            }, {
                field: "UnitsInStock",
                title: "Stock",
                filterable: {
                    multi: true
                },
                width: 300,
                hidden: false
            }, {
                field: "Discontinued",
                width: 120,
                title: "Activo",
                filterable: {
                    multi: true,
                    dataSource: [
                        { Discontinued: true },
                        { Discontinued: false }
                    ]
                },
                hidden: true
            }, {
                command: "destroy",
                title: "&nbsp;",
                width: 150
            }, {
                command: {
                    text: "Ver",
                    click: showDetails
                },
                title: " ",
                width: "100px",
                hidden: false
            }]
        });

        kgrid = $("#kgrid1").data("kendoGrid");

        $("#save").click(function (e) {
            e.preventDefault();
            localStorage["kendo-grid-options"] = kendo.stringify(kgrid.getOptions());
        });

        $("#load").click(function (e) {
            e.preventDefault();
            var options = localStorage["kendo-grid-options"];
            if (options) {
                kgrid.setOptions(JSON.parse(options));
            }
        });

        $("#refreshBtnContainer").on("click", ".k-pager-refresh", function (e) {
            e.preventDefault();
            $("#kgrid1").data("kendoGrid").dataSource.read();
        });

        wnd = $("#details")
            .kendoWindow({
                title: "Detalles de Producto",
                modal: true,
                visible: false,
                resizable: false,
                width: 300
            }).data("kendoWindow");

        detailsTemplate = kendo.template($("#template").html());

        function showDetails(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            wnd.content(detailsTemplate(dataItem));
            wnd.center().open();
        }
    }

    function buildKendoPivotGrid() {
        kendoGrid.culture("es-PE");
        pivotgrid = $("#kpivotgrid").kendoPivotGrid({
            excel: {
                fileName: "Benchmarking_Grid_Export.xlsx",
                proxyURL: "https://demos.telerik.com/kendo-ui/service/export",
                filterable: true
            },
            pdf: {
                fileName: "Benchmarking_Grid_Export.pdf",
                proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
            },
            filterable: true,
            sortable: true,
            columnWidth: 100,
            height: 400,
            messages: {
                fieldMenu: {
                    info: "Mostrar campos con valor:",
                    sortAscending: "Ordenar Ascendentemente",
                    sortDescending: "Ordenar descendentemente",
                    filterFields: "Filtrar campos",
                    filter: "Filtrar",
                    include: "Campos que incluyen...",
                    title: "Campos a incluir",
                    clear: "Limpiar",
                    ok: "Listo",
                    cancel: "Cancelar",
                    operators: {
                        contains: "Contiene",
                        doesnotcontain: "No contiene",
                        startswith: "Empieza con",
                        endswith: "Termina con",
                        eq: "Es igual a",
                        neq: "No es igual a"
                    }
                },
                measureFields: "Arrastre medici\u00f3nes aqu\u00ed",
                columnFields: "Arrastre columnas aqu\u00ed",
                rowFields: "Arrastre filas aqu\u00ed"
            },
            dataSource: {
                data: vdata,
                schema: {
                    model: {
                        fields: {
                            ProductName: { type: "string" },
                            QuantityPerUnit: { type: "number" },
                            UnitsInStock: { type: "number" },
                            Discontinued: { type: "boolean" },
                            CategoryName: { field: "Category.CategoryName" }
                        }
                    },
                    cube: {
                        dimensions: {
                            ProductName: { caption: "Productos" },
                            CategoryName: { caption: "Categor\u00edas" },
                            Discontinued: { caption: "Activo" }
                        },
                        measures: {
                            "Suma": { field: "QuantityPerUnit", format: "{0:c}", aggregate: "sum" },
                            "Promedio": { field: "QuantityPerUnit", format: "{0:c}", aggregate: "average" }
                        }
                    }
                },
                columns: [{ name: "CategoryName", expand: false }, { name: "ProductName" } ],
                rows: [{ name: "Discontinued", expand: false }],
                measures: ["Suma"]
            }
        }).data("kendoPivotGrid");

        $("#kpivotconfigurator").kendoPivotConfigurator({
            dataSource: pivotgrid.dataSource,
            filterable: true,
            height: 350
        });

        $("#exportExcelPGrid").click(function() {
            pivotgrid.saveAsExcel();
        });

        $("#exportPdfPGrid").click(function() {
            pivotgrid.saveAsPDF();
        });
    }

    function buildKendoSpreadSheet() {
        $("#kspreadsheet").kendoSpreadsheet({
            excel: {
                proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
            }
        });

        spreadsheet = $("#kspreadsheet").data("kendoSpreadsheet");

        spreadsheet.fromJSON({ sheets: vsdata });

        /*$("#upload").kendoUpload({
            async: {
                saveUrl: "/kendo-ui/spreadsheet/Upload"
            },
            multiple: false,
            localization: {
                "select": "Seleccione archivo para importar"
            },
            select: function(e) {
                var extension = e.files[0].extension.toLowerCase();
                if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                    alert("Please, select a supported file format");
                    e.preventDefault();
                }
            },
            success: function(e) {
                // Load the converted document into the spreadsheet
                spreadsheet.fromJSON(e.response);
            }
        });*/

        $(".download").click(function () {
            $("#download-data").val(JSON.stringify(spreadsheet.toJSON()));
            console.log("data-extension");
            console.log($(this).data("extension"));
            $("#download-extension").val($(this).data("extension"));
        });
    }

    function buildHandsontable() {
        var htableElement = $("#handsontable"), htableSettings;

        htableSettings = {
            data: vdata,
            columns: [
                {
                    data: 'ProductID',
                    title: 'ID',
                    type: 'numeric',
                    width: 40
                },
                {
                    data: 'ProductName',
                    type: 'text',
                    width: 350
                },
                {
                    data: 'DescriptionProduct',
                    type: 'text',
                    width: 300
                },
                {
                    data: 'QuantityPerUnit',
                    type: 'numeric',
                    format: '0.00',
                    width: 160
                },
                {
                    data: 'UnitsInStock',
                    type: 'numeric',
                    width: 160
                },
                {
                    data: 'Category.CategoryName',
                    type: 'text',
                    width: 350
                },
                {
                    data: 'Category.Description',
                    type: 'text'
                }
            ],
            stretchH: 'all',
            width: '100%',
            autoWrapRow: true,
            height: 441,
            maxRows: 22,
            rowHeaders: true,
            colHeaders: [
                'ProductID',
                'ProductName',
                'DescriptionProduct',
                'QuantityPerUnit',
                'UnitsInStock',
                'Category.CategoryName',
                'Category.Description'
            ],
            fixedRowsTop: 2,
            fixedColumnsLeft: 2,
            columnSorting: true,
            sortIndicator: true,
            autoColumnSize: {
                samplingRatio: 23
            },
            mergeCells: true,
            manualRowResize: true,
            manualColumnResize: true,
            manualRowMove: true,
            manualColumnMove: true,
            contextMenu: true,
            fixedRowsBottom: 2,
            columnSummary: [
                {
                    destinationColumn: 4,
                    destinationRow: 0,
                    type: 'average',
                    forceNumeric: true,
                    suppressDataTypeErrors: true,
                    readOnly: true
                }
            ],
            hiddenColumns: true,
            trimRows: [
                1,
                2,
                5
            ],
            dropdownMenu: true,
            filters: true
        };

        htableElement.handsontable(htableSettings);

        htable = htableElement.handsontable('getInstance');

        $("#export-file").on('click', function() {
            htable.getPlugin('exportFile').downloadFile('csv', {filename: 'Benchmarking_Grid_Export'});
        });
    }

    function buildUI() {
        $("#navkendoui").on('click', function(){
          $("#navhandsontable").removeClass("active1");
          $("#navkendoui").addClass("active1");
          $("#conthandsontable").addClass("hidden");
          $("#contkendoui").removeClass("hidden");
        });

        $("#navhandsontable").on('click', function(){
          $("#navkendoui").removeClass("active1");
          $("#navhandsontable").addClass("active1");
          $("#contkendoui").addClass("hidden");
          $("#conthandsontable").removeClass("hidden");
          htable.render();
        });

        $("#btnPivotGrid").click(function(){
            $("#pivotgrid").modal("show");
        });

        $("#pivotgrid").on('show.bs.modal', function () {
            pivotgrid.refresh();
        });

        $("#pivotgrid").on('shown.bs.modal', function () {
            pivotgrid.refresh();
        });

        $("#btnSpreadSheet").click(function(){
            $("#spreadsheet").modal("show");
        });

        $("#spreadsheet").on('show.bs.modal', function () {
            spreadsheet.activeSheet().columnWidth(1, 100);
        });

        $("#spreadsheet").on('shown.bs.modal', function () {
            spreadsheet.activeSheet().columnWidth(1, 100);
        });
    }

    function getData() {
        $.getJSON('json/products.json', function(data) {
            vdata = data;
            buildGrids();
        }).fail(function() {
            console.log("error");
        });

        $.getJSON('json/spreadsheet_products.json', function(data) {
            vsdata = data;
            buildKendoSpreadSheet();
        }).fail(function() {
            console.log("error");
        });
    }

    function init() {
        window.JSZip = JSZip;
        getData();
        buildUI();
    }

    return {
        init: init,
        settings: {}
    };
});
