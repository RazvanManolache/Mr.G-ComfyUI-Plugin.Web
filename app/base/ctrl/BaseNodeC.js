Ext.define('MrG.base.ctrl.BaseNodeC', {
	extend: 'MrG.base.ctrl.BasePanelC',
	
	init: function () {
		this.view.on("nodeInitiated", this.onNodeInitiated, this);
		this.callParent(arguments);

		var view = this.getView();
		var vm = this.getViewModel();
		//var header = view.getHeader();
		//var tbar = header.getItems().items[1];

		var nodeDef = view._nodeDefinition;
		var configData = nodeDef.configData;
		var title = nodeDef.nodeTitle;
		var nodeConfig = view._nodeConfig;
		var nodeId = nodeConfig.id
		//make sure the title has all info needed	
		vm.set({
			id: nodeId,
			className: nodeDef.className,
			title: title,
			comfyCategory: nodeDef.comfyCategory,
			fieldReferences: nodeDef.fieldReferences
		});


		var mrgConfig = view._mrgConfig;
		if (!mrgConfig) {
			if (nodeConfig.fieldValues) {
				for (var j in nodeConfig.fieldValues) {
					var val = nodeConfig.fieldValues[j];
					var fld = view.lookupReference("fld-" + j).getController();
					for (var k in val) {
						fld.setFieldValue(j, k, val[k]);
					}
				}
			}
			if (nodeConfig.inputPorts) {
				for (var j in nodeConfig.inputPorts) {
					this.getFields().forEach(function (field) {
						field.setAsInput(field)
					});
				}
			}


			var defaults = nodeConfig.defaults;
			if (defaults) {
				if (defaults.fields) {
					for (var fieldName in defaults.fields) {
						var fieldDefaults = defaults.fields[fieldName];
						var fld = view.lookupReference("fld-" + fieldName)
						fld.getController().setFieldValues(fieldDefaults);
					}
				}
			}
		} else {
				this.set('nodeHidden', mrgConfig.nodeHidden),
				this.set('selectedNode', mrgConfig.selectedNode),
				this.set('order', mrgConfig.order),
				this.set('collapsed', mrgConfig.collapsed),
				this.set('alias', mrgConfig.alias),

				this.getFields().forEach(function (field) {
					var name = field.getFieldName();
					var conf = mrgConfig.fieldValues[name];
					if (conf) {
						field.setFieldValues(conf);
					}
				})

		}
		this.fireViewEventArgs("nodeInitiated", [this]);
		
		
		
	},
	nodeInitiated: false,
	onNodeInitiated: function (node) {
		this.nodeInitiated = true;
	},
	checkAutoSave: function (eventName, args, who) {
		
		
		if (this.nodeInitiated) {
			//dislike this very much
			var wfCtrl = this.view.parent.parent.parent.getController();
			wfCtrl.checkAutoSave(eventName, args, who ? who : "node");
		}
			
	},
	selectField: function (fieldName, selected) {
		if (selected === undefined) selected = true;
		this.getFields().forEach(function (field) {
            if (field.getFieldName() == fieldName) {
                field.selectField(selected);
            }
        });
	},
	enrichLinkFieldEvent(linkInfo) {
		linkInfo.nodeId = this.getNodeId();
		linkInfo.nodeName = this.get("title");
		linkInfo.nodeType = this.get("className");
	},
	fieldLinkInitialized: function (field, linkInfo) {
		this.enrichLinkFieldEvent(linkInfo);
		this.fireViewEventArgs("nodeFieldLinkInitialized", [this,  field, linkInfo]);
	},
	fieldLinkDestroyed: function (field, linkInfo) {
		this.enrichLinkFieldEvent(linkInfo);
		this.fireViewEventArgs("nodeFieldLinkDestroyed", [this, field, linkInfo]);
	},
	
	//configurePortStore: function (port, data) {
	//	var store = this.getViewModel().get(port.store);
	//	store.loadData(data.items);
	//},
	
	//TODO: work on filtering out messages for other nodes
	notifyNode: function (type, msg) {
		this.getFields().forEach(function (field) {
			if (msg && msg.fields) {
				//do fields specific logic
				field.notifyField();
			}
			else {
				field.notifyField(type);
			}
		});
	},
	showError: function (fieldName, error) {
		this.getFields().forEach(function (field) {
            if (field.getFieldName() == fieldName) {
                field.showError(error);
            }
        });
	},
	setValueAndPosForField: function (fieldName, value, pos) {
        this.getFields().forEach(function (field) {
            if (field.getFieldName() == fieldName) {
                field.setValueAndPos(value, pos);
            }
        });
    },
	setFieldValues: function (fieldName, conf) {
		this.getFields().forEach(function (field) {
			if (field.getFieldName() == fieldName) {
				res = field.setFieldValues(conf);
			}
		});
	},
	getFieldValues: function (fieldName) {
		var res = null;
        this.getFields().forEach(function (field) {			
			if (field.getFieldName() == fieldName) {
				res = field.getFieldValues();
			}
        });
        return res;
	},
	setNodeAlias: function () {
		var currentTitle = this.get("title");
		var currentAlias = this.get("alias");
		var me = this;
		var titlePanel = this.get("titlePanel");
		var defText = currentTitle;
		if (currentAlias) {
            defText = currentAlias;
        }
		Ext.Msg.prompt('Set alias for '+ titlePanel + "(type: "+currentTitle+")", 'Please enter a text:', function(btn, text) {
			if (btn === 'ok') {
				me.setAlias(text);
			}
		}, null, false, defText); 
	},
	setAlias: function (text) {
		var currentTitle = this.get("title");
		var previousAlias = this.get('alias');
		text = text.trim();
		if(text == currentTitle) text = '';
		this.set('alias', text);
		if (previousAlias != text) {
			if(!text){
				text = currentTitle;
			}
            this.fireViewEventArgs("nodeAliasChanged", [this, text]);
        }
		
		
	},
	getNodeValues: function (noFields) {

		var me = this;
		var fieldValues = {}

		this.getFields().forEach(function (field) {
			var res = field.getFieldValues();
			fieldValues[res.fieldName] = res;
		});

		var ret = {
			id: this.get('id'),
			xclass: this.view.xclass,
			className: this.get('className'),
			nodeHidden: this.get('nodeHidden'),
			collapsed: this.get('collapsed'),
			alias: this.get('alias'),
			selectedNode: this.get('selectedNode'),
			order: this.get("order"),
		};
		if (!noFields) {
			ret.fieldValues = fieldValues;
		}
		return ret;
	},
	
	

	//Not much to change below
	findIfMatches: function (text) {
		var searchKeepSelected = this.get("searchKeepSelected");
		if (searchKeepSelected && this.isNodeSelected()) return true;
		var words = splitText(text, ' ', true);
		var searchObject = {};
		words.forEach(function (word) {
			searchObject[word] = 0;
		});
		var searchUseFields = this.get("searchUseFields");
		if (searchUseFields) {
			this.getFields().forEach(function (field) {
				var label = field.getLabel().toLowerCase();
				words.forEach(function (word) {
					if (label.indexOf(word) >= 0)
						searchObject[word]++;
				});
			});
		}
		var searchUseComfyMenu = this.get("searchUseComfyMenu");
		if (searchUseComfyMenu) {
			var comfyCategory = this.get('comfyCategory').toLowerCase();
			words.forEach(function (word) {
				if (comfyCategory.indexOf(word) >= 0)
					searchObject[word]++;
			});
		}
		var searchUseDescription = this.get("searchUseDescription");
		if (searchUseDescription) {
			var description = this.get('description').toLowerCase();
			words.forEach(function (word) {
				if (description.indexOf(word) >= 0)
					searchObject[word]++;
			});
		}

		var searchUseTitle = this.get("searchUseTitle");
		if (searchUseTitle) {
			var title = this.get('title').toLowerCase();
			words.forEach(function (word) {
				if (title.indexOf(word) >= 0)
					searchObject[word]++;
			});
		}

		var matched = true;
		words.forEach(function (word) {
			if (searchObject[word] == 0)
				matched = false;
		});
		return matched;
	},
	processPreset: function (presetNode, ignoreFields) {
		if (presetNode.nodeType == this.get("className")) {
			var fields = this.getFields();
			fields.forEach(function (field) {
				for (fld in presetNode.fieldValues) {
					if (fld == field.getFieldName()) {
						var conf = presetNode.fieldValues[fld];
						if (ignoreFields) {
							field.setFieldValues(conf, ignoreFields);
						}
						else {
							field.setFieldValues(conf);
						}
						
					}					
				}
            });
			return true;
		}
		return false;
	},
	getOrder: function () {
		return this.get("order");
	},
	getFields: function () {
		var fields = [];
		var me = this;
		this.get("fieldReferences").forEach(function (fieldReference) {
			var fieldView = me.lookup(fieldReference);
			if (fieldView) {
				var fieldController = fieldView.getController();
				fields.push(fieldController);
			}
			
		});
		return fields;
	},
	fieldLinkConvert: function (fieldName, link) {
		this.getFields().forEach(function (field) {
			field.fieldLinkConvert(fieldName, link);
		});
	},
	loadDefaultLayout: function () {
		this.getFields().forEach(function (field) {
			field.loadDefaultLayout();
		});
	},
	setLayoutAsDefault: function () {
		this.getFields().forEach(function (field) {
			field.setLayoutAsDefault();
		});
	},
	updateFieldsAfterRun: function () {
		this.getFields().forEach(function (field) {
			field.updateFieldAfterRun();
		});
	},
	updateSequenceFields: function (sequenceFields) {
		var nodeId = this.getNodeId();
		sequenceFields.forEach(function (field) {
			if (field.nodeId == nodeId) {
				this.getFields().forEach(function (fld) {
					fld.updateSequenceField(field);
				}, this);
			}
		}, this);
	},
	linkFieldStateChanged: function (field, fieldName, value, isInField, fieldType) {
		this.fireViewEventArgs("nodeLinkFieldStateChanged", [this, this.getNodeId(), field, fieldName, value, isInField, fieldType]);

	},
	fieldValueChanged: function (fieldCtrl, val) {
		this.fireViewEventArgs("nodeFieldValueChanged", [this, fieldCtrl, val]);
	},	
	fieldLinkAdded: function (field, row, isInField, fieldName) {
		this.fireViewEventArgs("nodeFieldLinkAdded", [this, this.getNodeId(), field, row, isInField, fieldName])
	},
	fieldLinkRemoved: function (field, row, isInField, fieldName) {		
		this.fireViewEventArgs("nodeFieldLinkRemoved", [this, this.getNodeId(), field, row, isInField, fieldName])
	},	
	removeFromLinkField: function (fieldName, row, otherNodeId, isInField) {
		this.getFields().forEach(function (field) {
			field.removeFromLinkField(fieldName, row, otherNodeId, isInField);
		}, this);

	},
	addToLinkField: function (fieldName, row, isInField) {
		this.getFields().forEach(function (field) {
			field.addToLinkField(fieldName, row, isInField);
		}, this);
	},
	setFieldValue: function (fldName, value) {
		this.getFields().forEach(function (field) {
			field.setFieldValue(fldName, "value", value);
		}, this);
		
	},
	getNodeId: function () {
		return this.get("id");
	},

	// #region Events
	addNode: function (index) {
		this.fireViewEventArgs("addNode", [this, index]);
	},
	addNodeBelow: function () {
		this.addNode(1);
	},
	addNodeAbove: function () {
		this.addNode(0);
	},

	moveUp: function () {
		this.fireViewEventArgs("moveUpNode", [this]);
	},
	moveDown: function () {
		this.fireViewEventArgs("moveDownNode", [this]);
	},
	closeNode: function () {
		this.fireViewEventArgs("closeNode", [this]);
	},
	configureNode: function () {
		this.fireViewEventArgs("configureNode", [this]);
	},
	clickedOnNode: function () {
		this.fireViewEventArgs("clickedNode", [this.view]);
	},
	fieldInitiated: function (field) {
		this.fireViewEventArgs("nodeFieldInitiated", [field, this])
	},
	fieldChanged: function (field, fieldConf, destroy) {
		this.fireViewEventArgs("nodeFieldChanged", [this, this.getNodeValues(true), field, fieldConf, destroy])
	},
	fieldSequenceChanged: function (fieldEvent) {
		fieldEvent.nodeId = this.getNodeId();
		fieldEvent.nodeName = this.get("title");
		this.fireViewEventArgs("nodeFieldSequenceChanged", [fieldEvent]);
	},
	isNodeSelected: function () {
		return this.get('selectedNode');
	},
	nodeSelected: function () {
		this.set('selectedNode', true)
	},
	nodeDeselected: function () {
		this.set('selectedNode', false)
	},
	showNodeSearch: function () {
		this.set("nodeHiddenSearch", false);
	},
	hideNodeSearch: function () {
		this.set("nodeHiddenSearch", true);
	},
	showNode: function () {
		this.set("nodeHidden", true);
	},
	hideNode: function () {
		this.set("nodeHidden", false);
	},

	// #endregion Events
	
});
