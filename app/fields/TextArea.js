Ext.define("MrG.fields.TextArea", {
    extend: 'Ext.field.TextArea',
    autoHeight: true,
    maxRows: 2,
    limitRows: 10,
    listeners: {

        change: function (field) {
            field.hackUpdateRowCnt(field)
        },
    },
    hackUpdateRowCnt: function (field) {
        var width = field.el.getWidth();
        var up = field;
        while (width == 0) {
            if (up.el && up.el.getWidth) {
                width = up.el.getWidth()
            }
            up = up.up();
        }

        if (field.autoHeight) {
            var value = field.getValue();
            var rows = value.split("\n");
            var rowsCnt = 1;
            rows.forEach(function (row) {
                var noRows = Math.ceil(row.length * 6 / width+0.0001);
                rowsCnt += noRows
            }, this);
            var maxRows = field.limitRows;
            var final = rowsCnt > maxRows ? maxRows: rowsCnt;
            field.setMaxRows(final);
            //console.log(value.length, rows.length, width, rowsCnt, maxRows, final);            
        }
    }
});