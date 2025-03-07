Ext.define('MrG.grd.act.vm.OutputGridVM', {
    extend: 'MrG.base.vm.BaseActionGridVM',
    data: {
        typeGrid: 'output',
        showDetails: false,
        multiSelect: false,
        showTags: true,
        showRatings: true,
    },
    formulas: {
        selectionMode: function (get) {
            return get('multiSelect') ? 'multi' : 'single';
        }
    }
});