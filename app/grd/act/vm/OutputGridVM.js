Ext.define('MrG.grd.act.vm.OutputGridVM', {
    extend: 'MrG.base.vm.BaseActionGridVM',
    data: {
        typeGrid: 'output',
        multiSelect: false,
    },
    formulas: {
        selectionMode: function (get) {
            return get('multiSelect') ? 'multi' : 'single';
        }
    }
});