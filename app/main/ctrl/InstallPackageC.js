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
		}, this);
		var apiStore = this.get("apiStore");
		this.vm.bind('{apis}', function (newData) {
            if (newData) {
                apiStore.loadData(newData);
			}
			
		}, this);
		var jobsStore = this.get("jobsStore");

		this.vm.bind('{jobs}', function (newData) {
            if (newData) {
                jobsStore.loadData(newData);
            }
		});

		this.vm.bind('{parameters}', this.parametersChanged, this);
	},
	fieldsControllers: [],
	fieldsValidation: {},
	fieldsExtraValidation: {},
	
	fieldInitiated: function (fieldCtrl) {
		this.fieldsControllers.push(fieldCtrl);
		this.fieldsValidation[fieldCtrl.id] = false;
		if (fieldCtrl.xclass == 'MrG.fields.ctrl.SelectionC') {
			this.fieldsExtraValidation[fieldCtrl.id] = false;
		}
	},
	
	fieldValueChanged: function (field, data) {
		//console.log("fieldValueChanged", field, data);
		var fieldCtrl = data[0];
		var value = data[1];

		if (fieldCtrl.xclass == 'MrG.fields.ctrl.SelectionC') {
			var store = fieldCtrl.get("globalDataStore");
			var selectedRecordIdx = store.findBy(function (record) {
				return record.get("comfy_name") == value;
			});
			var selectedRecord = null;
			if (selectedRecordIdx > -1) {
				selectedRecord = store.getAt(selectedRecordIdx);
			}
			if (!selectedRecord) {
				//this.fieldsExtraValidation[fieldCtrl.id] = false;
			}
			else {
				var container = fieldCtrl.view.up().getItems().getAt(1);
				container.removeAll();
				this.fieldsExtraValidation[fieldCtrl.id] = false;
				if (selectedRecord.get("files") && selectedRecord.get("files").length > 0) {
					//console.log("need to make the form");
					
					container.add({
						xtype: 'label',
						html: 'We will need to download this resource, so please visit the page below (if any) or search for it and review the terms and conditions for it. This is not a component that comes with Mr.G or ComfyUI, so its terms of use apply.',
						margin: '10px'
					});
					container.add({
						xtype: 'label',
						margin: '10px',
						html: '<a href="' + selectedRecord.get("source") +'" target="_blank">' + selectedRecord.get("source") + '</a>',
					});
					container.add({
						xtype: 'checkboxfield',
						margin: '10px',
						label: 'I agree to the terms and conditions',
						labelWidth: 'auto',
						listeners: {
                            change: function (field, newValue) {
                                this.fieldsExtraValidation[fieldCtrl.id] = newValue;
                                this.validateFields();
                            },
                            scope: this
                        }
					});
	
					
				}
				else {
					this.fieldsExtraValidation[fieldCtrl.id] = true;
				}
			}
			
			
		}

		var isValid = fieldCtrl.get("isValid");
		this.fieldsValidation[fieldCtrl.id] = isValid;

		this.validateFields();
	},
	validateFields: function () {
		var fieldsValid = Object.values(this.fieldsValidation).filter(a => !a).length == 0;
		var extraFieldsValid = Object.values(this.fieldsExtraValidation).filter(a => !a).length == 0;
		this.set("fieldsValid", fieldsValid && extraFieldsValid);
	},
	
	
	parametersChanged: function (parameters) {
		var parametersPanel = this.lookup("parametersPanel");
		parameters.forEach(function (parameter) {
			var type = parameter.type;
			var name = parameter.name;
			var description = parameter.description;
			var field = {
				xclass: "MrG.fields.view.TextV",
				style: 'margin: 10px;',
				_configField: {
					label: name,
					fieldName: name,
					description: description,
				},
				listeners: {
					fieldInitiated: 'fieldInitiated',
					fieldValueChanged: 'fieldValueChanged',
				}
			}
			var config = field._configField;
			switch (type.name) {
				case "bool": {
					field.xclass = 'MrG.fields.view.BoolV';
					config.value = type.value;
					break;
				}
				case "int": {
					field.xclass = 'MrG.fields.view.NumberV';
					config.maxValue = type.max ?? 2147483647;
					config.minValue = type.min ?? 0;
					config.value = type.value ?? config.minValue;
					config.stepValue = type.step ?? 1;
					break;
				}
				case "float": {
					field.xclass = 'MrG.fields.view.NumberV';
					config.maxValue = type.max ?? 2147483647;
					config.minValue = type.min ?? 0;
					config.value = type.value ?? config.minValue;
					config.stepValue = type.step ?? 1;
					var roundValue = parameter.round ? parameter.round.countDecimals() : 2;
					field.viewModel = {
						data: {
							roundValue: roundValue
						}
					}
					break;
				}
				case "string": {
					field.xclass = 'MrG.fields.view.TextV';
					config.value = type.value;
					break;
				}
				case "selection": {
					var store = Ext.create('Ext.data.Store');
					if (type.list) {
						type.list.forEach(function (item) {
							item.alias = item.uuid = item.comfy_name = item.name;
						});
					}
					if (type.cls || type.field) {
						var mainStore = blocksInterpreter.createUIStore(type.cls, type.field);
						var mainData = mainStore.getData().items;
						var newData = [];
						var filterStore = type.filterStore;
						if (type.list) {							
							type.list.forEach(function (item) {
								var listeq = mainData.filter(function (data) {
									return item.comfy_name == data.get("comfy_name");
								});
								var newRec = item;
								if (listeq.length) {
									newRec = listeq[0].clone();									
								} 
								newData.push(newRec)
							});
						}
							
						mainData.forEach(function (data) {
							if (!filterStore) {
								var listeq = type.list.filter(function (item) {
									return item.comfy_name == data.get("comfy_name");
								});
								if (!listeq.length)
									newData.push(data.clone());
							}
						});
						//console.log(type.cls, type.field, store, mainStore);
						store.loadData(newData);
					}
					else {
						if (type.list) {
							
							store.loadData(type.list)
						}
					
					}
					
					field.xclass = 'MrG.fields.view.SelectionV';
					
					
					field.viewModel = {
						data: {
							globalDataStore: store
						}
					};
					config.options = type.options;
					config.value = type.value;
					field = {
						xtype: 'container',
						layout: 'vbox',
						items: [
							field,
							{
								xtype: 'container',
							}
						]
					}
                    break;

				}
			}
			
			parametersPanel.add(field);
		});
	},
	initByRecord: function (record) {
		this.updateRecord(record);

	},
	installPackage: function () {
		var values = {};
		this.fieldsControllers.forEach(function (fieldCtrl) {
			values.push({ name: fieldCtrl.get("label"), value: fieldCtrl.get("value") });
		});
		var record = this.get("record");
		var recordData = record.getData();
		//call endpoint with fields and recordData, get request uuid
		var me = this;
		Ext.Ajax.request({
			url: '/mrg/install_package',
			method: 'POST',
			jsonData: {
				package: recordData,
				fields: values
			},
			success: function (response) {
				console.log("Request ID:", response.responseText);
				me.pollStatus(response.responseText)
			},
			failure: function (response) {
				me.set("progress", {
					status: "Failed getting status",
					error: response.responseText
				});
			}
		});

		var installPackagePanel = this.view;
		this.set("installing", true);
		
		var installPanel = this.lookup('installPanel');
		
		installPackagePanel.setActiveItem(installPanel);
	},
	pollStatus: function (requestId) {
		var me = this;
		Ext.Ajax.request({
			url: '/mrg/package_install_status/' + requestId,
			method: 'GET',
			success: function (response) {
				me.set("failureGettingStatus", 0);

				var statusData = Ext.decode(response.responseText);
				console.log("Download Status:", statusData);
				me.set("progress",statusData)
				
				if (!me.get("finishedInstalling")) {
					setTimeout(1000, me.pollStatus);
				}
			},
			failure: function (response) {
				me.set("failureGettingStatus", me.get("failureGettingStatus") + 1);
				
				if (me.get("failureGettingStatus") < 4) {
					setTimeout(1000, me.pollStatus);
				}
				else {
					me.set("progress", {
						status: "Failed getting status",
						error: response.responseText
					});
				}
				
			}
		});
	},
	updateRecord: function (record) {
		this.view.uuid = record.get("uuid");
		this.set("record", record);
	},

});
