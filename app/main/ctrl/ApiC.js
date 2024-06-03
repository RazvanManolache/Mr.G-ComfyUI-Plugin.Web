Ext.define('MrG.main.ctrl.ApiC', {
	extend: 'MrG.main.ctrl.BaseEmbedWorkflowC',
	init: function () {
		this.callParent(arguments);
	},
	newRecord: function () {
		return new MrG.model.ApiModel({
			uuid: crypto.randomUUID(),
			name: 'New API',
			enabled: true
		});
	},
	initByUuid: function (uuid) {
		var url = '/mrg/api?uuid=' + uuid;
		var me = this;
		Ext.Ajax.request({
			url: url,
			useDefaultXhrHeader: false,
			success: function (response, opts) {
				var data = Ext.decode(response.responseText);
				record = new MrG.model.ApiModel(data);
				me.view._embedWorkflowModel = record;
				me.initByRecord(record);
			},
			failure: function (response, opts) {
				console.log('server-side failure with status code ' + response.status);
			}
		})
	},
	initByRecord: function (record) {
		
		this.callParent(arguments);
		var parameters = record.get("parameters");
		if (parameters) {
			var parameters_data = JSON.parse(parameters);
			var store = this.get("parametersStore");
			store.loadData(parameters_data);
		}
		
	},
	preRemoveWorkflows: function () {
		var selectedWorkflowsGrid = this.lookup("selectedWorkflowsGrid");
		var selectedItems = selectedWorkflowsGrid.getSelection();
		if(selectedItems && !Array.isArray(selectedItems)) selectedItems = [selectedItems];
		//remove fields related to these
		var parametersStore = this.get("parametersStore");
		
		selectedItems.forEach(function (item) {
			var par = parametersStore.queryBy(function (record) {
				return record.get("workflowUniqueUuid") == item.get("uuid");
			}).items;
			parametersStore.remove(par);
		});
	},
	getExtEmbedWorkflowObject: function (rec) {
		var store = this.get("parametersStore");
		var data = store.getData().items.map(function (item) {
			return item.getData();
		});
		rec.set("parameters", JSON.stringify(data));
	},
	onSelectedWorkflowParametersStoreDataChanged: function () {
		var selectedWorkflowParametersStore = this.get("selectedWorkflowParametersStore");
		selectedWorkflowParametersStore.each(function (record) {
			this.renderedWorkflowController.selectNodeField(record.get("nodeId"), record.get("fieldName"));
		}, this);
        this.set("selectedFieldsCount", selectedWorkflowParametersStore.getCount());
	},
	postSaveWorkflowConfiguration: function () {
		var selectedWorkflowParametersStore = this.get("selectedWorkflowParametersStore");
		var parametersStore = this.get("parametersStore");
		var selectedWorkflow = this.get("selectedWorkflow");
		var uuid = selectedWorkflow.get("uuid");
		var existingFields = this.getSelectedFieldsForWorkflow(uuid)
		var currentFields = selectedWorkflowParametersStore.getData().items;
		var newFields = currentFields.filter(a => !existingFields.some(b => b.get("nodeId") == a.get("nodeId") && b.get("fieldName") == a.get("fieldName")));		
		var removedFields = existingFields.filter(b => !currentFields.some(a => b.get("nodeId") == a.get("nodeId") && b.get("fieldName") == a.get("fieldName")));
		var sameFields = existingFields.filter(a => currentFields.some(b => b.get("nodeId") == a.get("nodeId") && b.get("fieldName") == a.get("fieldName")));
		//update the workflow alias, just in case
		if (sameFields.length > 0) {
            sameFields.forEach(field => {
				console.log(field.get("workflowName"));
				field.set("workflowName", this.get("selectedWorkflowAlias"));
            }, this);
		}
		//add new fields
		if (newFields.length > 0) {
            newFields.forEach(field => {
				parametersStore.add(new MrG.model.FieldSelectionModel({
					workflowUniqueUuid: uuid,
					workflowUuid: selectedWorkflow.get("workflowUuid"),
					workflowName: this.get("selectedWorkflowAlias"),
                    nodeName: field.get("nodeName"),
                    nodeId: field.get("nodeId"),
                    fieldName: field.get("fieldName"),
                    alias: field.get("alias"),
                    defaultValue: field.get("defaultValue"),
                    optional: field.get("optional"),
                    enabled: field.get("enabled")
                }));
            }, this);
		}
		//remove fields
		if (removedFields.length > 0) {
            removedFields.forEach(field => {
                var toRemove = parametersStore.queryBy(function (record) {
					return record.get("nodeId") == field.get("nodeId") && record.get("fieldName") == field.get("fieldName") &&
						record.get("workflowUniqueUuid") == uuid;
                }).items;
                parametersStore.remove(toRemove);
            }, this);
        }



	},
	postWorkflowLoaded: function () {
		this.renderedWorkflowController.view.on("workflowNodeFieldsChanged", this.selectedFields, this);
		var selectedWorkflowParametersStore = this.get("selectedWorkflowParametersStore");
		selectedWorkflowParametersStore.removeAll();
		var selectedWorkflow = this.get("selectedWorkflow");
		var fields = this.getSelectedFieldsForWorkflow(selectedWorkflow.get("uuid"));
		selectedWorkflowParametersStore.add(fields);
	},
	getSelectedFieldsForWorkflow: function(uuid) {
		var parametersStore = this.get("parametersStore");
		var items = parametersStore.query("workflowUniqueUuid", uuid).items;
		return items;
	},
	removeSelectedParameters: function () {
		var parametersGrid = this.lookup("parametersGrid");
		var selectedItems = parametersGrid.getSelection();
		var store = this.get("parametersStore");
		store.remove(selectedItems);
	},
	
	selectedFields: function (fields) {
		var selected = fields.filter(a => a.fieldSelected);
		var selectedWorkflow = this.get("selectedWorkflow");
		var workflowUuid = selectedWorkflow.get("workflowUuid")
		var parametersStore = this.get("selectedWorkflowParametersStore");
		var existingFields = parametersStore.getData().items;
		var newFields = selected.filter(a => !existingFields.some(b => b.get("nodeId") == a.nodeId && b.get("fieldName")==a.fieldName));
		var removedFields = existingFields.filter(b => !selected.some(a => b.get("nodeId") == a.nodeId && b.get("fieldName")==a.fieldName));
		if (newFields.length > 0) {
			newFields.forEach(field => {				
				parametersStore.add(new MrG.model.FieldSelectionModel({
					workflowUniqueUuid: selectedWorkflow.get("uuid"),
					workflowName: selectedWorkflow.get("alias"),
                    workflowUuid: workflowUuid,
                    nodeName: field.nodeType,
                    nodeId: field.nodeId,
                    fieldName: field.fieldName,
                    alias: field.fieldConf.label,
                    defaultValue: field.fieldConf.value,
                    optional: false,
                    enabled: true

				}));
			}, this);
		} 
		if (removedFields.length > 0) {
			removedFields.forEach(field => {
				var toRemove = parametersStore.queryBy(function (record) {
					return  record.get("nodeId") == field.get("nodeId") && record.get("fieldName") == field.get("fieldName");
				}).items;
				parametersStore.remove(toRemove);
            }, this);
        }

	}

});
