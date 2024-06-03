blocksInterpreter = {
	comfyUI2MrGValues: function (type, field, values, index) {
		if (index >= values.length) {
			return {
				result: {
					value: null
				}
			}
		}
		var ret = {
			result: { value: values[index] }
		};
		var next = index + 1;
		switch (field) {
			case "seed":
				ret.result.sequence = values[next]
				next++;
				break

		}

		ret.next = next;
		//console.log(type, field, values, index, ret);
		return ret;
	},
	translate2MrG: function (cfg) {

		var newWrk = {
			nodes: [],
			links: [],
			comfyConfig: cfg
		};
		var me = this;
		var orderedNodes = cfg.nodes.sort((a, b) => a.order - b.order);
		orderedNodes.forEach(function (n) {

			var form = MrG.node.view[n.type];
			var formName = n.type;
			var id = n.id;
			var node = {
				xclass: form.getName(),
				id: id,
				fieldValues: {},
				inputPorts: []
			};
			var formConfig = form.prototype._nodeDefinition.configData;

			var i = 0;
			if (formConfig) {
				blocksInterpreter.forEachField(formConfig, function (nm, nd) {
					var rez = me.comfyUI2MrGValues(formName, nm, n.widgets_values, i);
					node.fieldValues[nm] = rez.result;
					i = rez.next;
				});
			}
			

			//this is to figure out which widget has been converted to input
			if (n.inputs) {
				n.inputs.forEach(function (input) {
					node.inputPorts.push(input.name);
				});
			}
			
			

			

			newWrk.nodes.push(node);
		});

		return newWrk;
	},
	forEachField: function (config, func) {
		if (config.input && config.input.required) {
			var infields = config.input.required;
			for (var i in infields) {
				var infield = infields[i];
				if (infield.length != 1 || Array.isArray(infield[0])) {
					func(i, infield);
				}
			}
		}
	},
	
	forEachOutField: function (config, func) {
		var i = 0;
		var output_names = config.output_name
		config.output.forEach(function (val) {
			func(val, i++, output_names);
		});
	},
	allBlocks: [],
	connectionStores: {},
	
	
	allStores: [],
	allStoresDefs: {},
	processNodes: function (_data) {
		for (var prop in _data) {
			blocksInterpreter.createNode(prop, _data);
		}
		//console.log(this.allStores.sort());
		//console.log(this.allStoresDefs);
	},
	createNode: function (formName, allData) {
		var me = this;
		var data = allData[formName];
		this.fieldCounter = 1;
		this.inLinkCounter = 1;
		this.outLinkCounter = 1;
		var nodeName = 'MrG.node.view.' + formName;
		var input_fields = data.input.required;
		var form_items = this.createFields(input_fields, formName);
		var input_fields_optional = data.input.optional;
		var form_items = form_items.concat(this.createFields(input_fields_optional, formName));
		var field_names = form_items.map(a => a._configField.fieldName);
		this.forEachOutField(data, function (output, idx, names) {
			var name = output;
			if (names) {
				name = names[idx];
				if (field_names.includes(name)) {
                    name = "OUT_"+name ;
                }
			}
			var outField = me.createField(name, [output, "output", idx], formName);
			form_items.push(outField);
		});
		form_items = form_items.sort((a, b) => {
			return a.order - b.order
		});
		

		
		Ext.define(nodeName, {
			extend: 'MrG.base.view.BaseNodeV',
			autoSize: true,
			items: form_items,
			
			_nodeDefinition: {
				comfyCategory: data.category,
				nodeTitle: data.display_name,
				configData: data,
				className: formName,
				fieldReferences: form_items.map(a => a.reference)
			}					
			
		});
		this.allBlocks.push({ nodeClass: nodeName, nodeTitle: data.display_name});
	},
	createSimpleStoreData: function (data) {
		var ar = [];
		data.forEach(function (d) {
			ar.push({val: d, key: d})
		})
		return ar;
	},
	createUIStore: function (nodeType, fieldname, field_details, type) {
		var typeStore = MrG.store.SelectTypeStore;
		var store_nm = fieldname;
		var configs = typeStore.query("field", fieldname);
		var storeConfig = configs.find("cls", nodeType);
		if (!storeConfig) {
			storeConfig = configs.findBy(function (row) { return row.get("cls") == "" })
		}
		else {
			store_nm = nodeType + "_" + store_nm;
		}
			
		if (!storeConfig) {
			console.warn("don't have data for node " + nodeType + " - field " + fieldname + " - if you use this node you will have issues - most likely it's a custom node which is not supported.")
			//console.log('ComfyTypeMapping("' + fieldname + '","' + nodeType + '", 1, "nodes.' + nodeType + '.' + fieldname + '"),')
			//console.log(nodeType, fieldname, configs.length, configs, storeConfig);
		}
		data = storeConfig.get("db_data");
		var storename = 'MrG.store.combo.singleton.' + store_nm;
		if (!MrG || !MrG.store || !MrG.store.combo || !MrG.store.combo.singleton || !MrG.store.combo.singleton[store_nm]) {
			//console.log(storename);
			Ext.define(storename, {
				extend: 'MrG.store.SelectListStore',
				singleton: true,
				autoLoad: false,
				storeId: storename,
				_comfyData: type,
				proxy: {
					extraParams: {
						field: fieldname,
						node: nodeType
					}
				}
				
				
			});
			if (data && data.length) {
				MrG.store.combo.singleton[store_nm].loadData(data);
			}
		}
		return MrG.store.combo.singleton[store_nm];
	},
	createFields: function (input_fields, formName) {
		
		var fields = [];
		for (var fieldName in input_fields) {
			var field_details = input_fields[fieldName];
			var field = this.createField(fieldName, field_details, formName);
			if (field) {
				fields.push(field);
			}
		}
		return fields;
	},
	fieldCounter: 1,
	inLinkCounter: 1,
	outLinkCounter: 1,
	createField: function (fieldname, field_details, formName) {
		var isLink = false;
		var isOutLink = false;
		var field = {			
			_configField: { label: fieldname, fieldName: fieldname, nodeType: formName, fieldType: 'TEXT', isInField: true, origFieldDetails: field_details, },
			_fieldDefinition: {},
			reference: "fld-"+fieldname,
			xclass: 'MrG.fields.view.TextV',
			order:1,
			listeners: {
				fieldInitiated: 'fieldInitiated',
				fieldChanged: 'fieldChanged',
				fieldValueChanged: 'fieldValueChanged',
				sequenceChanged: 'fieldSequenceChanged',
				linkFieldStateChanged: 'linkFieldStateChanged',

				fieldLinkAdded: 'fieldLinkAdded',
				fieldLinkRemoved: 'fieldLinkRemoved',
				fieldLinkInitialized: 'fieldLinkInitialized',
				fieldLinkDestroyed: 'fieldLinkDestroyed',

				
			}
		}
		if (field_details.length > 0) {
			var type = field_details[0];
			field._configField.fieldType = type
			switch (type) {
				case 'FLOAT':
					field.xclass = 'MrG.fields.view.NumberV';
					field._configField.maxValue = field_details[1].max ? field_details[1].max : 2147483647;
					field._configField.minValue = field_details[1].min ? field_details[1].min : 0;
					field._configField.value = field_details[1].default;
					field._configField.stepValue = field_details[1].step ? field_details[1].step : 1;
					var roundValue = field_details[1].round ? field_details[1].round.countDecimals() : 2;
					field.viewModel = {
						data: {
							roundValue: roundValue
						}
					}
					break;
				case 'INT':
					field.xclass = 'MrG.fields.view.NumberV';
					field._configField.maxValue = field_details[1].max ? field_details[1].max : 2147483647;
					field._configField.minValue = field_details[1].min ? field_details[1].min : 0;
					field._configField.value = field_details[1].default ? field_details[1].default : field_details[1].min;
					
					break;
				case 'STRING':
					field.value = field_details[1].default;
					break;
				case 'BOOLEAN':
					field.xclass = 'MrG.fields.view.BoolV';
					field._configField.value = field_details[1].default;
					break;
				case "%":
				case "*":
				case "CONDITIONING":
				case "IMAGE":
				case "VAE":
				case "CLIP":
				case "MASK":
				case "MODEL":
				case "LATENT":
				case "SIGMAS":
				case "UPSCALE_MODEL":
				case "GLIGEN":
				case "CLIP_VISION_OUTPUT":
				case "CONTROL_NET":
				case "CLIP_VISION":
				case "STYLE_MODEL":
				case "SAMPLER":
					if (!this.connectionStores[type])
						this.connectionStores[type] = Ext.define('MrG.store.connection.' + type, {
							extend: 'MrG.store.SimpleStore'
						});
					
					field.xclass = 'MrG.fields.view.LinkV';
					isLink = true;
					
					field.order = 0;
					if (field_details.length > 1) {
						if (field_details[1] == "output") {
							field.order = 2;
							field._configField.isInField = false;
							isOutLink = true;
						}
					}
					if (field_details.length > 2) {
						field.reference = field.reference + "_" + field_details[2];
						
					}
					//return null;
					break;
				default:
					if (!field_details[0] || Array.isArray(field_details[0])) {
						typeField = "SELECT"
						if (fieldname == "image") {
							
							field.xclass = 'MrG.fields.view.ImageV';
						}
						else {
							
							field.xclass = 'MrG.fields.view.SelectionV';

						}
						
						var globalDataStore = this.createUIStore(formName, fieldname, field_details, type);
						field.viewModel = {
							data: {
								globalDataStore : globalDataStore
							}
						};
						field._configField.fieldType = typeField;
						if (field_details[1] && field_details[1].default) {
							field._configField.value = field_details[1].default
						}
						else {
							if (field_details[0].length > 0) {
								field._configField.value = field_details[0][0]
							}
						}
						
						
					}
					else {
						console.log(field, formName, fieldname, field_details);
						return null;
					}
			}
			field._fieldDefinition.fieldType = type;
			if (isLink) {
				if (isOutLink) {
					field._fieldDefinition.idx = this.outLinkCounter++;
				}
				else {
					field._fieldDefinition.idx = this.inLinkCounter++;
				}
			} else {
				field._fieldDefinition.idx = this.fieldCounter++;
			}
			return field;
		}
		console.log(field, formName, fieldname, field_details);
		return null;
	}
}



