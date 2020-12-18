const xl = require('excel4node');

const REPORT_NAME = 'Movimientos'

module.exports = {

    //Exports a XLSX report from the listed elements in array 
    exportReport_movements: function (array) {
        var i = 2

        // Create a new instance of a Workbook class
        var wb = new xl.Workbook({
            dateFormat: 'dd/mm/yy hh:mm:ss'
        });
        
        // Add Worksheets to the workbook
        var ws = wb.addWorksheet(REPORT_NAME, { 
            'sheetFormat': { 
                'defaultColWidth': 30 //Change number to state column's width
            } 
        });
        
        // Create a reusable style
        var titles = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
            bold: true
        }
        });
        
        // --------------------------------
        // Create titles for columns
        ws.cell(1, 1)
        .string('Fecha y hora')
        .style(titles)
        
        ws.cell(1, 2)
        .string('Nombre usuario')
        .style(titles);
        
        ws.cell(1, 3)
        .string('ID Usuario')
        .style(titles);

        ws.cell(1, 4)
        .string('Nombre Sala')
        .style(titles);
        // --------------------------------
        
        array.forEach(element => {

            ws.cell(i, 1)
            .date(element.date)

            ws.cell(i, 2)
            .string(element.username)

            ws.cell(i, 3)
            .string(element.usercode)

            ws.cell(i, 4)
            .string(element.room)

            i++
        });
        
        wb.write('./public/reports/ReporteMovimientos.xlsx');
        console.log('Excel file created!')
    },

    // ----------------------------------------------------------------------------------

    //Exports a XLSX report from the listed elements in array 
    exportReport_pir: function (array) {
        var i = 2

        // Create a new instance of a Workbook class
        var wb = new xl.Workbook({
            dateFormat: 'dd/mm/yy hh:mm:ss'
        });
        
        // Add Worksheets to the workbook
        var ws = wb.addWorksheet(REPORT_NAME, { 
            'sheetFormat': { 
                'defaultColWidth': 30 //Change number to state column's width
            } 
        });
        
        // Create a reusable style
        var titles = wb.createStyle({
        font: {
            color: 'black',
            size: 12,
            bold: true
        }
        });
        
        // --------------------------------
        // Create titles for columns
        ws.cell(1, 1)
        .string('Fecha y hora')
        .style(titles)
        
        ws.cell(1, 2)
        .string('Habitacion')
        .style(titles);
        
        // --------------------------------
        
        array.forEach(element => {

            ws.cell(i, 1)
            .date(element.date)

            ws.cell(i, 2)
            .string(element.room)

            i++
        });
        
        wb.write('./public/reports/ReportePIR.xlsx');
        console.log('Excel file created!')
    }
}