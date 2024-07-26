Ext.define('MrG.base.ODataProxy', {
    extend: 'Ext.data.proxy.JayData',
    alias: 'proxy.ODataProxy',
    constructor: function (cfg) {
        cfg.reader = {
            totalProperty: 'totalCount'
        };
        return this.callParent(arguments);
    }
});