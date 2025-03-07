Ext.define('MrG.main.vm.QueueVM', {
    extend: 'MrG.base.vm.BasePanelVM',
    data: {
        record: null
    },
    formulas: {
        runType: {
            get: function (get) {
                var store = MrG.store.RunModeStore;
                var record = get("record");
                if (record) {
                    var runType = record.get("run_type");
                    var runTypeRecord = store.findRecord("value", runType);
                    if(runTypeRecord)
                        return runTypeRecord.get("text");
                    return runType;
                }
            }
        }
    },
    stores: {
        outputStore: {
            xclass: 'MrG.store.OutputStore',
            filters: [{
                property: 'batch_request_uuid',
                value: '{record.uuid}'
            }]
        }
    }
});