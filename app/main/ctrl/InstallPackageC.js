Ext.define('MrG.main.ctrl.InstallPackageC', {
	extend: 'MrG.base.ctrl.BasePanelC',	
	init: function () {
		this.callParent(arguments);
		var record = this.view._embedWorkflowModel;
		if (record) {
			this.initByRecord(record);
			
		}
		else {
			this.view.close();
		}
		var workflowStore = this.get("workflowStore");
		this.vm.bind('{workflows}', function (newData) {
			if (newData) {
				workflowStore.loadData(newData);
			}
		});
		var apiStore = this.get("apiStore");
		this.vm.bind('{apis}', function (newData) {
            if (newData) {
                apiStore.loadData(newData);
            }
		});
		var jobsStore = this.get("jobsStore");

		this.vm.bind('{jobs}', function (newData) {
            if (newData) {
                jobsStore.loadData(newData);
            }
        });
		
	},
	initByRecord: function (record) {
		this.updateRecord(record);

	},
	updateRecord: function (record) {
		this.view.uuid = record.get("uuid");
		this.set("record", record);
	},

});
