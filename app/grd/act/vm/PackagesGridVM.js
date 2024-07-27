Ext.define('MrG.grd.act.vm.PackagesGridVM', {
    extend: 'MrG.base.vm.BaseActionGridVM',
    data: {
        typeGrid: 'packages',
    },
    stores: {
        packagesStore: {
            xclass :'MrG.store.PackagesStore'
        }
    }
});