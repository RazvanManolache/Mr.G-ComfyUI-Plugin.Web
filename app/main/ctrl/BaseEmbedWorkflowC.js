Ext.define('MrG.main.ctrl.BaseEmbedWorkflowC', {
	extend: 'MrG.base.ctrl.BasePanelC',
	renderedWorkflowController: null,
	init: function () {
		this.callParent(arguments);

		var record = this.view._embedWorkflowModel;
		if (record) {
			this.initByRecord(record);
			return;
		} else {
			var uuid = this.view.uuid;
			if (uuid) {
				this.initByUuid(uuid);
			}
			else {
				var record = this.newRecord();
				this.initByRecord(record);
			}
		}
		

	},
	
	initByRecord: function (record) {
		this.updateRecord(record);
		var workflows = record.get("workflows");
		if (workflows) {
			var workflows_data = JSON.parse(workflows);
			var store = this.get("selectedWorkflowsStore");
			store.loadData(workflows_data);
		}
		
	},
	updateRecord: function (record) {
		this.view.uuid = record.get("uuid");
		this.set("record", record);
	},
	
	saveWorkflowConfiguration: function () {
		console.log(arguments);
		var selectedWorkflow = this.get("selectedWorkflow")
		var selectedWorkflowPreset = this.get("selectedWorkflowPreset");
		var selectedWorkflowRunMode = this.get("selectedWorkflowRunMode");
		var selectedWorkflowEnabled = this.get("selectedWorkflowEnabled");
		if(selectedWorkflowPreset){
			selectedWorkflow.set("presetUuid",selectedWorkflowPreset.get("uuid"));
			selectedWorkflow.set("presetName",selectedWorkflowPreset.get("alias"));
			selectedWorkflow.set("presetData",selectedWorkflowPreset.get("text"));
		} else{
			selectedWorkflow.set("presetUuid",null);
			selectedWorkflow.set("presetName",null);
			selectedWorkflow.set("presetData",null);
		}
		selectedWorkflow.set("workflowAlias", this.get("selectedWorkflowAlias"))		
		selectedWorkflow.set("runMode",selectedWorkflowRunMode);
		selectedWorkflow.set("enabled",selectedWorkflowEnabled);
		
		this.postSaveWorkflowConfiguration();
		this.backToMainForm();
	},
	postSaveWorkflowConfiguration: function(){
		
	},
	removePreset: function () {
		this.set("selectedWorkflowPreset", null);
		this.refreshWorkflow();
	},
	configureWorkflow: function (grid, event) {

		if (event.record) {
			//TODO: Implement configureWorkflow
			var record = event.record;
			this.set("selectedWorkflow", record);
			if (record.get("presetUuid"))
				this.set("selectedWorkflowPreset", new MrG.model.SelectListModel({ alias: record.get("presetName"), uuid: record.get("presetUuid"), text: record.get("presetData"), }));
			else
				this.set("selectedWorkflowPreset",null)
			this.set("selectedWorkflowAlias", record.get("workflowAlias"));
			this.set("selectedWorkflowRunMode", record.get("runMode"));
			this.set("selectedWorkflowEnabled", record.get("enabled"));
			var configureWorkflow = this.lookup("configureWorkflow");

			this.refreshWorkflow();

			this.lookup("tabPanel").setActiveItem(configureWorkflow);
			this.view.getTbar().setHidden(true);
		}

	},
	backToMainForm: function () {
		this.lookup("tabPanel").setActiveItem(this.lookup("mainForm"));
		this.view.getTbar().setHidden(false);
	},
	refreshWorkflow: function () {
		var workflowContainer = this.lookup("workflowContainer");
		workflowContainer.removeAll(true, true);
		var workflow = workflowContainer.add({
			title: "Workflow",
			xclass: 'MrG.main.view.WorkflowV',
			_workflowModel: this.get("selectedWorkflow").get("workflowUuid"),
			_categoryModel: null,
			height: '100%',
			closable: false,
			listeners: {
				workflowLoaded: 'selectedWorkflowLoaded'
			}
		});
		workflow.getViewModel().set("readOnlyWorkflow", true);
		if(this.get("canSelectFields"))
			workflow.getViewModel().set("fieldsSelection", true);
		
		
		this.renderedWorkflowController = workflow.getController();

	},
	exportEmbedWorkflow: async function () {
		
		var record = this.getEmbedWorkflowObject();
		//export as json
		var data = record.getData();
		var jsonData = JSON.stringify(data);
		var blob = new Blob([jsonData], { type: "application/json" });
		var url = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.href = url;
		a.download = data.name + this.get("fileExtension");
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	},
	selectedWorkflowLoaded: function () {
		var selectedWorkflowPreset = this.get("selectedWorkflowPreset");
		if (selectedWorkflowPreset) {
			this.renderedWorkflowController.processPreset([selectedWorkflowPreset], ["fieldSelected"]);
		}
		if(this.postWorkflowLoaded)
            this.postWorkflowLoaded();
	},
	processPreset: function (presets) {
		if (presets && presets.length > 0) {			
			this.set("selectedWorkflowPreset", presets[0])
		} else {
			this.set("selectedWorkflowPreset", null)
		}
		this.refreshWorkflow();
	},
	viewSelectedWorkflow: function () {
		var selectedWorkflow = this.get("selectedWorkflow");
		if (selectedWorkflow) {
			this.viewWorkflowUuid(selectedWorkflow.get("workflowUuid"));
        }
	},
	viewWorkflow: function (grid, event) {
		if (event && event.record) {
			var uuid = event.record.get("workflowUuid");
			this.viewWorkflowUuid(uuid);
		}
	},
	viewWorkflowUuid: function (uuid) {
		this.view.fireEventArgs("openWorkflowByUuid", [uuid]);
	},
	closeEmbedWorkflow: function () {
		this.view.close();
	},
	
	getExtEmbedWorkflowObject: function (rec) {
	},
	getNewEmbedWorkflowTypeObject: function () {
		return new Ext.data.Model();
	},
	getEmbedWorkflowObject: function () {
		rec = this.get("record");
		var store = this.get("selectedWorkflowsStore");
		var data = store.getData().items.map(function (item) {
            return item.getData();
		});
		rec.set("workflows", JSON.stringify(data));
		this.getExtEmbedWorkflowObject(rec);
		return rec;
	},
	saveEmbedWorkflow: function () {
		var rec = this.getEmbedWorkflowObject();
		rec.save();
	},
	saveCopyEmbedWorkflow: function () {
		var rec = this.getEmbedWorkflowObject();
		rec.set("uuid", crypto.randomUUID());
		rec.set("name", rec.get("name") + "(copy)");
		rec.save();
	},
	saveToApi: function (record) {
	},
	preRemoveWorkflows: function () {

	},
	removeWorkflows: function () {
		this.preRemoveWorkflows();
		var selectedWorkflowsGrid = this.lookup("selectedWorkflowsGrid");
		var selectedItems = selectedWorkflowsGrid.getSelection();
		var store = this.get("selectedWorkflowsStore");
		store.remove(selectedItems);
	},
	selectWorkflowsFinished: function (selectedItems, replace) {
		var store = this.get("selectedWorkflowsStore");
		var existing = this.get("selectedWorkflowsStore").getData().items;
		var newItems = [];
		var existingIds = existing.map(function (item) {
			return item.get("workflowAlias");
		});
		selectedItems.forEach(function (item) {
			var selectedItem = new MrG.model.WorkflowConfigureModel({
				uuid: crypto.randomUUID(),
				workflowUuid: item.get("uuid"),
				workflowName: item.get("name"),
				workflowAlias: item.get("name"),
				enabled: true,
				runMode: "q",
				presetName: null,
				presetUuid: null
			});
			i = 1;
			while (existingIds.includes(selectedItem.get("workflowAlias")))
			{
				selectedItem.set("workflowAlias", item.get("name") + " (" + i + ")");
				i++;
			}
			existingIds.push(selectedItem.get("workflowAlias"));

			newItems.push(selectedItem);
		});
		if (replace) {
			store.remove(existing);
		}
		store.add(newItems);

	},
	selectWorkflows: function () {
		var me = this;
		var dialog = new MrG.dialog.view.SelectWorkflowV({
			
			listeners: {
				selectionDone: function(selectedItems, replace) {
                    me.selectWorkflowsFinished(selectedItems, replace);
                }
			}
		});
		dialog.show();
	}
});
