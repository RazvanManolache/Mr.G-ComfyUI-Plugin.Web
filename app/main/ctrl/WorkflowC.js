Ext.define('MrG.main.ctrl.WorkflowC', {
	extend: 'MrG.base.ctrl.BaseNodePanelC',
	comfyApp: null,
	LiteGraph: null,
	comfyDocument: null,
	chartReady: false,
	init: function () {
		this.callParent(arguments);		
		this.view.setMasked(true);
		

		this.prepareIframe();
		var record = this.view._workflowModel;
		if (record) {
			if (typeof record == 'object') {
				this.view.uuid = record.get("uuid");
				this.initByRecord(record);
				return;
			} 
			this.view.uuid = record;
			this.initByUuid(record);
		}
		this.captureFinishedLoading();
		
	},
	// i hate this method but the only way to capture that it finished loading
	captureFinishedLoading: function () {
		if (this.comfyLoaded && Date.now() - this.lastComfyUpdate > 50) {
			this.view.fireEventArgs("workflowLoaded", [this]);
		}
		else {
			var me = this;
			setTimeout(function () { me.captureFinishedLoading() }, 20);
		}

	},
	initByUuid: function (uuid) {
		var url = '/mrg/workflow?uuid=' + uuid;
		var me = this;
		Ext.Ajax.request({
			url: url,
			useDefaultXhrHeader: false,
			success: function (response, opts) {
				var data = Ext.decode(response.responseText);
				record = new MrG.model.WorkflowModel(data);
				me.view._workflowModel = record;
				me.initByRecord(record);
			},
			failure: function (response, opts) {
				console.log('server-side failure with status code ' + response.status);
			}
		})
	},
	initByRecord: function (record) {
		this.set('workflowData', record);
		var recordContents = record.get("contents");
		if (recordContents) {
			var content = JSON.parse(recordContents);
			this.set('comfyConfig', content);
		}

		var settingsObj = {
			selectedRunMode: 'q'
		};
		var settings = record.get('settings');
		if (settings) {
			settingsObj = JSON.parse(settings);
		}
		this.setSettings(settingsObj);
		this.runModeChanged(this.get("selectedRunMode"))


		this.implementConfig();
	},
	getNodeValuesConfig: function () {
		var record = this.get('workflowData')
		var nodes_values = record.get('nodes_values');
		var node_values_obj = [];
		if (nodes_values) {
			node_values_obj = JSON.parse(nodes_values);
		}
		return node_values_obj;
	},
	implementConfig: function () {
		var content = this.get('comfyConfig')
		if (!content) return;
		var node_values_obj = this.getNodeValuesConfig();

		var config = blocksInterpreter.translate2MrG(content);
		if (config) {
			var nodes = []
			for (var i in config.nodes) {
				var node = config.nodes[i];
				var node_values = node_values_obj.filter(a => a.id == node.id);
				if (node_values.length == 0) {
					node_values = null;
				}
				else {
					node_values = node_values[0];
				}
				var n = this.makeNode(node, node_values);
				this.get("nodes").push(n.reference);
				nodes.push(n);
			}
			nodes = nodes.sort((a, b) => {
				var posa = 0;
				if (a._mrgConfig && a._mrgConfig.order) {
					posa = a._mrgConfig.order;
				}
				var posb = 0;
				if (b._mrgConfig && b._mrgConfig.order) {
                    posb = b._mrgConfig.order;
                }
				return posa - posb;
			})

			var workflowView = this.view.lookup('workflowView');
			workflowView.add(nodes);
		}
	},
	
	prepareIframe: function () {
		var me = this;
		var iframePanel = this.view.lookup('comfyView');
		var style = document.createElement('style');
		style.textContent =
			'body {' +
			'  background-color: some-color;' +
			'  background-image: some-image;' +
			'}'
			;
		var iframeContainer = iframePanel.el.dom.children[0].children[0].children[0];
		iframeContainer.style.height = '100%'
		var iframe = iframeContainer.children[0].children[1];


		iframe.addEventListener("load", ev => {
			me.iframeLoaded(ev);
		});
		iframe.src = '/';
	},
	nodeFieldLinkInitialized: function (node, field, linkData) {
		var portsStore = this.vm.get("portsStore");
		var row = portsStore.add(linkData);		
		//console.log("link initialized", linkData, storeName)
	},
	nodeFieldLinkDestroyed: function (node, field, linkData) {
		var portsStore = this.vm.get("portsStore");
		var rows = portsStore.queryBy(function (row) {
			return row.get("nodeId") == linkData.nodeId &&
				row.get("name") == linkData.name &&
				row.get("input") == linkData.input;
		});
		portsStore.remove(rows.items);
    },

	
	findNodeById: function (id) {
		return this.getAllNodes().find(a => a.getNodeId() == id);
	},

	iframeLoaded: function (ev) {
		const new_style_element = document.createElement("style");
		new_style_element.textContent = ".comfy-menu,.comfy-modal {visibility: collapse;}";
		ev.target.contentDocument.head.appendChild(new_style_element);
		var window = ev.target.contentWindow;
		this.captureIframeAppEvents(window);
	},
	captureIframeAppEvents: function (window) {
		var me = this;
		var app = window.app;
		
		if (!app) {
			setTimeout(function () { me.captureIframeAppEvents(window) }, 50);
			return;
		}
		app.socket = true;
		this.comfyApp = app;
		this.LiteGraph = window.LiteGraph;
		this.comfyDocument = window.document;
		this.set("comfyClientId",window.name);
		console.log(window.name);

		this.vm.set("hideautoConnect", app.extensions.filter(a => a.name == 'AutoConnect').length == 0);
		app.clean();
		app.graph.clear();
		this.linkComfyEvents();

		var comfyConfig = this.get('comfyConfig');
		if (comfyConfig) {
			app.loadGraphData(comfyConfig);
		}
		else {
			this.comfyLoaded = true;
			this.view.setMasked(false);
		}

		//console.log(ev.target.contentWindow)
	},
	comfyLoaded: false,
	lastComfyUpdate: Date.now(),
	comfyUpdate: function () {
		this.lastComfyUpdate = Date.now();
	},
	linkComfyEvents: function () {
		var me = this;
		var view = this.getView();

		this.old_onNodeAdded = this.comfyApp.graph.onNodeAdded;
		this.comfyApp.graph.onNodeAdded = function (node) {
			if (this.old_onNodeAdded) this.old_onNodeAdded(...arguments);
			if (!me.comfyLoaded) {
				me.comfyLoaded = true;				
				view.setMasked(false);
				me.comfyUpdate();
			}
			if (!node.mrg) {
				node.old_onInputAdded = node.onInputAdded;
				node.onInputAdded = function (input) {
					if (this.old_onInputAdded) this.old_onInputAdded(...arguments);
					var found = false;
					if (this.widgets) {
						this.widgets.forEach(function (widget) {
							if (widget.name == input.name) {
								found = widget;
							}
						});
					}
					
					if (found) {
						me.comfyFieldConvert(this, found, true);
					}
					me.comfyUpdate();
				}
				node.old_onInputRemoved = node.onInputRemoved;
				node.onInputRemoved = function (port, input) {
					if (this.old_onInputRemoved) this.old_onInputRemoved(...arguments);
					var found = false;
					if (this.widgets) {
						this.widgets.forEach(function (widget) {
							if (widget.name == input.name) {
								found = widget;
							}
						});
					}
					
					if (found) {
						me.comfyFieldConvert(this, found, false);
					}
					me.comfyUpdate();
				}
				node.old_onSelected = node.onSelected;
				node.onSelected = function () {
					if (this.old_onSelected) this.old_onSelected(...arguments);
					me.chartReady = true;
					me.selectNode(this.id);
					me.comfyUpdate();
				};
				node.old_onDeselected = node.onDeselected;
				node.onDeselected = function () {
					if (this.old_onDeselected) this.old_onDeselected(...arguments);

					me.deselectNode(this.id);
					me.comfyUpdate();
				};
				node.old_onWidgetChanged = node.onWidgetChanged;
				node.onWidgetChanged = function (field, newValue) {
					if (this.old_onWidgetChanged) this.old_onWidgetChanged(...arguments);
					me.comfyValueChanged(this, this.id, field, newValue);
					me.comfyUpdate();
				};
				node.old_onConfigure = node.onConfigure;
				node.onConfigure = function () {
					if (this.old_onConfigure) this.old_onConfigure(...arguments);
					me.processNewComfyNode(this);
					me.comfyUpdate();
				}

				node.old_onConnectionsChange = node.onConnectionsChange;
				node.onConnectionsChange = function (input, slot, connected, link_info, input_info) {
					if (this.old_onConnectionsChange) this.old_onConnectionsChange(...arguments);
					me.logComfyLinks("onConnectionsChange", input, slot, connected, link_info, input_info)
					if (link_info) {
						if (input == 1) {
							if (connected) {
								me.comfyLinkAdded(link_info);
							} else {
								me.comfyLinkRemoved(link_info);
							}
						}
					}
					me.comfyUpdate();
					

				}
				if (node.id) {
					me.processNewComfyNode(node);
				}

				node.mrg = true;
			}

		};
		this.comfyApp.graph.old_on_change= this.comfyApp.graph.on_change;
		this.comfyApp.graph.on_change = function () {
			if (this.old_on_change) this.old_on_change(...arguments);
			//if (me.chartReady)
			me.updateAllValuesReadingFromComfy();
			me.comfyUpdate();
		};
		this.comfyApp.graph.old_onNodeRemoved = this.comfyApp.graph.onNodeRemoved;
		this.comfyApp.graph.onNodeRemoved = function (node) {
			if (this.old_onNodeRemoved) this.old_onNodeRemoved(...arguments);
			me.closeNodeById(node.id);
			me.comfyUpdate();
		};




	},
	logComfyLinks: function (nm, input, slot, connected, link_info, input_info) {
		//if (input != 1) {
		//	console.log(nm, link_info.origin_id + "[" + link_info.origin_slot + "] -> " + link_info.target_id + "[" + link_info.target_slot + "]")
		//}
		//else {
		//	console.log(nm, link_info.target_id + "[" + link_info.target_slot + "] -> " + link_info.origin_id + "[" + link_info.origin_slot + "]")
		//}
	},


	autoConnect: function () {
		var me = this;
		Ext.Msg.confirm('Confirmation', 'Are you sure you want to autolink all nodes ?',
			function (answer) {
				if (answer == 'yes') {
					me.comfyDocument.getElementById("autoconnect-button").click()
				}
			});

	},
	unlinkNodes: function () {
		var me = this;
		Ext.Msg.confirm('Confirmation', 'Are you sure you want to unlink all nodes ?',
			function (answer) {
				if (answer == 'yes') {
					me.comfyApp.graph._nodes.forEach(function (node) {
						if (node.inputs) {
							for (var i = 0; i < node.inputs.length; i++) {
								node.disconnectInput(i);
							}
						}

					})
				}
			});

	},


	
	configureNode: function (ctrl) {
		//TODO: de facut configurare nod
		//console.log("configureNode", ctrl);
	},


	updateAllValuesReadingFromComfy: function () {
		var somethingChanged = false;
		this.getAllNodes().forEach(function (node) {
			var values = node.getNodeValues();
			var id = node.getNodeId();
			var comfyNode = this.getComfyNodeById(id);
			if (comfyNode && comfyNode.mrg && comfyNode.widgets) {
				var total = comfyNode.widgets.length;
				for (var i = 0; i<total; i++){
                    var widget = comfyNode.widgets[i];
					var fieldName = widget.name;
					var changed = false;
					var ret = this.updateFieldValuesFromComfy(comfyNode, fieldName, node);
					if (ret.changed) somethingChanged = true;
					i = ret.idx;

                }
				

			}
		}, this);


		if (this.comfyApp && somethingChanged) {
			this.comfyApp.graph.setDirtyCanvas(true, true);
		}
	},
	updateFieldValuesFromComfy: function (comfyNode, fieldName, node, newValue) {
		var somethingChanged = false;
		var widget = comfyNode.widgets.find(a => a.name == fieldName);
		var i = comfyNode.widgets.indexOf(widget);
		var total = comfyNode.widgets.length;
		var sequence = null;
		switch (comfyNode.type) {
			case 'PrimitiveNode':
				sequence = comfyNode.widgets[1].value;
				i = total;
				break;
			case 'Note':
				fieldName = 'Note'
				break;
			default:
				if (i + 1 < total && comfyNode.widgets[i + 1].name == "control_after_generate") {
					sequence = comfyNode.widgets[i + 1].value;
					i++;
				}

				break;
		}
		if (fieldName) {
			var conf = node.getFieldValues(fieldName);
			var newConf = {}
			if (conf) {
				fieldName = conf.fieldName;
				if (newValue != undefined) {
					if (conf.value != newValue) {
						newConf.value = newValue;
						somethingChanged = true;
					}
				}
				else {
					if (conf.value != widget.value) {
						newConf.value = widget.value;
						somethingChanged = true;
					}
				}
				
				if (sequence) {
					if (conf.sequence != sequence) {
						newConf.sequence = sequence;
						somethingChanged = true;
						
					}
					if (conf.optionSelected == "Simple" && conf.optionMode == "Basic") {
						newConf.optionMode = "Advanced";
						somethingChanged = true;
					}
				} 
				if (somethingChanged) {
					node.setFieldValues(fieldName, newConf);
				}
			}
		}
		return { idx: i, changed: somethingChanged };
	},
	comfyValueChanged: function (comfyNode, nodeId, fieldName, newValue) {
		var node = this.findNodeById(nodeId);
		this.updateFieldValuesFromComfy(comfyNode, fieldName, node, newValue);		
	},
	nodeFieldValueChanged: function (nodeCtrl, fieldCtrl, val) {
		this.setValuesToComfyNode(nodeCtrl);
		//TODO: notificat ComfyUI
		//console.log(nodeCtrl, fieldCtrl, val);
	},
	nodeLinkFieldStateChanged: function (node, nodeId, field, fieldName, isLink, isInField, fieldType) {
		var comfyNode = this.getComfyNodeById(nodeId);

		//this part is for registering in ports store the entry with the new type
		if (isLink) {
			var portsStore = this.get("portsStore");
			var rows = portsStore.queryBy(function (row) {
				return row.get("nodeId") == nodeId &&
					row.get("name") == fieldName &&
					row.get("input") == isInField;
			}).items;
			
			rows.forEach(function (row) {
				if(row.get("type") != fieldType)
					row.set("type", fieldType);
			}, this);
			
		}
		//this part is for converting comfy to input or widget if it's not already
		if (comfyNode && comfyNode.mrg && comfyNode.widgets) {
			var options = []
			if (comfyNode.getExtraMenuOptions)
				comfyNode.getExtraMenuOptions(comfyNode, options);
			//i hate this way of finding stuff so much
			var optionName = "Convert " + fieldName + " to " + (isLink ? "input" : "widget");
			var optionToUse = options.find(a => a && a.content == optionName);
			if (optionToUse) {
				optionToUse.callback();
			}
		}
	},
	comfyFieldConvert: function (comfyNode, widget, isInput) {
		var node = this.findNodeById(comfyNode.id);
		if (node) {
			node.fieldLinkConvert(widget.name, isInput);
        }
	},
	getComfyNodeByNode: function (node) {
		var id = node.getViewModel().get("id");
		return this.getComfyNodeById(id);
	},
	getComfyNodeById: function (id) {
		if (this.comfyApp)
			return this.comfyApp.graph.getNodeById(id);
		return null;
	},
	setValuesToComfyNode: function (node) {
		var comfyNode = this.getComfyNodeByNode(node);
		if (comfyNode && comfyNode.widgets) {
			var values = node.getController().getNodeValues();
			var somethingChanged = false;
			for (var p in values.fieldValues) {
				var value = values.fieldValues[p];
				if (comfyNode.type == "PrimitiveNode") {
					//it's gonna have just 1 field so we can just set it like this
					if (value.isInField) {
						if (comfyNode.widgets[0].value != value.value) {
							comfyNode.widgets[0].value = value.value;
							somethingChanged = true;
						}
						if (comfyNode.widgets.length>1 && comfyNode.widgets[1].value != value.sequence) {
							comfyNode.widgets[1].value = value.sequence;
							somethingChanged = true;
						}
						
						

					}
				}else if (comfyNode.type == "Note") {
					if (comfyNode.widgets[0].value != value.value) {
						comfyNode.widgets[0].value = value.value;
						somethingChanged = true;
					}
				} 

				else {
					comfyNode.widgets.forEach(function (widget) {
						if (widget.name == p && widget.value != value.value) {
							widget.value = value.value;
							somethingChanged = true;
						}
						if (widget.name == "control_after_generate" && p == "seed" && widget.value != value.sequence) {
							widget.value = value.sequence;
							somethingChanged = true;
						}
					})
				}
				
			}
			if (this.comfyApp && somethingChanged) {
				this.comfyApp.graph.setDirtyCanvas(true, true);
			}
		}
	},
	processNewComfyNode: function (node) {
		var id = node.id;
		var existingNode = this.findNodeById(id);
		if (!existingNode) {
			var pos = node.order;
			if (node._mrg_order != null)
				pos = node._mrg_order;
			var nodeType = node.type;
			this.addNodeInternal(id, nodeType, pos)
		}
		existingNode = this.findNodeById(id);
		this.setValuesToComfyNode(existingNode);
	},
	createQueue: [],
	addNodeFromSelection: function (pos, nodes) {
		var me = this;
		var types = nodes.map(a => a.className);
		this.createQueue = nodes;
		
		//create comfy node
		types.forEach(function (type) {
			var comfyNodeDef = me.LiteGraph.createNode(type);
			comfyNodeDef._mrg_order = pos;
			
			//comfyNode.pos = canvas.convertEventToCanvasOffset(first_event);
			var comfyNode = me.comfyApp.graph.add(comfyNodeDef);
			//TODO: maybe calculate where to place it

		})
		this.comfyApp.graph.afterChange();
	},
	addNode: function (sourceNodeCtrl, pos) {
		var me = this;
		//where to put it
		var childView = sourceNodeCtrl.getView();
		var workflowView = this.lookup('workflowView');
		var indx = workflowView.indexOf(childView);
	
		//var selectNodeDialog = getSelectNodeDialog();
		selectNodeDialog.getController().configureSelectionEvents("selectionFinished", function (nodes) {
			
			me.addNodeFromSelection(indx + pos, nodes);
		});
		selectNodeDialog.show();
	},

	addNodeInternal: function (id, nodeType, pos) {
		var vm = this.getViewModel();

		//TODO: implement defaults for nodes also
		var nodeDefaults = {}
		var xclass = 'MrG.node.view.' + nodeType;

		//if i ever want hardcoded configs i guess, not for now
		//if (MrG._workflowsConfig && MrG._workflowsConfig.defaults && MrG._workflowsConfig.defaults[nodeType]) {
		//	nodeDefaults = MrG._workflowsConfig.defaults[nodeType];
		//}
		var queue = this.createQueue;
		var conf = queue.find(a => a.className == nodeType);
		if (conf) {
			//remove from queue
			this.createQueue = queue.filter(a => a.className != nodeType);
			nodeDefaults = conf;
			xclass = conf.xclass;
		}
		nodeDefaults.selectedNode = false;
		if (!nodeDefaults.fieldValues) nodeDefaults.fieldValues = {};

		var newNode = this.makeNode({ xclass: xclass, id: id }, nodeDefaults );

		var workflowView = this.lookup('workflowView');
		var newView = workflowView.insert(pos, newNode)

		var nodeReferences = vm.get("nodes")
		nodeReferences.push(newView.reference);
		vm.set("nodes", nodeReferences);

		var newNodeController = newView.getController();
		//if no configuration, load default
		if(!conf)
			newNodeController.loadDefaultLayout();


		this.redoOrder();



		//console.log(comp);
		this.redoOrder();
	},
	makeNode: function (nodeConfig, mrgConfig) {

		return {
			xclass: nodeConfig.xclass,
			reference: "node-" + nodeConfig.id,
			_nodeConfig: nodeConfig,
			_mrgConfig: mrgConfig,
			listeners: {
				addNode: 'addNode',
				closeNode: 'closeNode',
				moveUpNode: 'moveUpNode',
				moveDownNode: 'moveDownNode',
				configureNode: 'configureNode',
				clickedNode: 'clickedNode',

				nodeFieldValueChanged: 'nodeFieldValueChanged',
				nodeFieldSequenceChanged: 'nodeFieldSequenceChanged',
				nodeLinkFieldStateChanged: 'nodeLinkFieldStateChanged',

				nodeFieldChanged: 'nodeFieldChanged',
				nodeFieldLinkRemoved: 'nodeFieldLinkRemoved',
				nodeFieldLinkAdded: 'nodeFieldLinkAdded',
				nodeFieldLinkInitialized: 'nodeFieldLinkInitialized',
				nodeFieldLinkDestroyed: 'nodeFieldLinkDestroyed',
			}
		}
	},	
	updateFieldsAfterRun: function () {

	},
	closeNodeById: function (id) {
		var ctrl = this.findNodeById(id).getController();
		this.closeNodeInternal(ctrl);
	},
	closeNode: function (ctrl) {
		var comfyNode = this.getComfyNodeByNode(ctrl);
		if (comfyNode && this.comfyApp)
			this.comfyApp.graph.remove(comfyNode);
	},
	closeNodeInternal: function (ctrl) {
		var childView = ctrl.getView();
		var reference = childView.reference;
		this.lookup('workflowView').remove(childView);
		var vm = this.getViewModel();
		vm.set("nodes", removeItemFromArray(vm.get("nodes"), reference));
	},
	findLinkRows: function (ob) {
		var portsStore = this.get("portsStore");

		var inRows = portsStore.queryBy(function (row) {
			if (row.get("nodeId") != ob.in.id)
				return false;
			if (!row.get("input"))
				return false;
			if (row.get("name") == ob.in.field)
				return true;
			if (row.get("nodeType") == "Reroute")
				return true;
				
			return false;
		}).items;
		if (inRows.length > 1) {
			console.log("this should not happen, multiple rows for same port should not be possible");
			debugger;
		} else if (inRows.length == 1) {
			ob.in.row = inRows[0];
		} 
		
		

		var outRows = portsStore.queryBy(function (row) {
			if (row.get("nodeId") != ob.out.id)
				return false;
			if (row.get("input"))
				return false;			
			if (row.get("name") == ob.out.field)
				return true;
			var nodeType = row.get("nodeType");
			if (nodeType == "PrimitiveNode")
				return true;
			if (nodeType == "Reroute")
				return true;
			
			
			return false;
				
		}).items;
		if (outRows.length > 1) {
			console.log("this should not happen, multiple rows for same port should not be possible");
			debugger;
		} else if (outRows.length == 1) {
			ob.out.row = outRows[0];
		} 
	},
	processLinkAdd: function (link, notifyInNode, notifyOutNode, notifyComfy) {
		//console.log(link);
		//this.getAllNodes().forEach(function (node) {
		//	if (notifyInNode && link.out.row)
		//		node.addToLinkField(link.in.id, link.in.field, link.out.row, true);
		//	if (notifyOutNode && link.in.row)
		//		node.addToLinkField(link.out.id, link.out.field, link.in.row, false);
		//}, this);
		if (notifyInNode && link.out.row) {
			var nodeIn = this.findNodeById(link.in.id);
			if (nodeIn) {
				nodeIn.addToLinkField(link.in.field, link.out.row, true);
			}
			else {
				debugger;
			}
		}
		if (notifyOutNode && link.in.row) {
            var nodeOut = this.findNodeById(link.out.id);
			if (nodeOut) {
				nodeOut.addToLinkField(link.out.field, link.in.row, false);
			} else {
				debugger;
			}
        }
		
		if (notifyComfy && link.out.comfy) {
			var existingLinks = link.out.comfy.outputs[link.out.slot].links;
			
			var sameConnection = this.findInLinks(this.comfyApp.graph.links,(a =>
				existingLinks && existingLinks.indexOf(a.id) > -1 && a.target_id == link.in.id
				&& a.target_slot == link.in.slot 
			));
			if (sameConnection.length == 0) {
				link.out.comfy.connect(link.out.slot, link.in.id, link.in.slot);
			}
				
		}
	},
	findInLinks: function (links, filterFn) {
		var result = [];
		if (!links) return result;
		if (links.length) {
            links.forEach(function (link) {
                if (filterFn(link)) {
                    result.push(link);
                }
            });
        } else {
            for (var p in links) {
                var link = links[p];
                if (filterFn(link)) {
                    result.push(link);
                }
            }
		}
		return result;

	},
	processLinkRemove: function (link, notifyInNode, notifyOutNode, notifyComfy) { 

		//console.log(link);
		//this.getAllNodes().forEach(function (node) {
		//	if (notifyInNode)
		//		node.removeFromLinkField(link.in.id, link.in.field, link.out.row, link.out.id, true);
		//	if (notifyOutNode)			
		//		node.removeFromLinkField(link.out.id, link.out.field, link.in.row, link.in.id, false);
		//});
		if (notifyInNode) {
			var nodeIn = this.findNodeById(link.in.id);
			if (nodeIn) {
				nodeIn.removeFromLinkField(link.in.field, link.out.row, true);
			} else {
				debugger;
			}

		}
		if (notifyOutNode) {
			var nodeOut = this.findNodeById(link.out.id);
			if (nodeOut) {
				nodeOut.removeFromLinkField(link.out.field, link.in.row, false);
			} else {
				debugger;
			}
		}

			
		if (notifyComfy && link.in.slot!==undefined) {
			var existingLinks = link.in.comfy.inputs[link.in.slot].link;
			var sameConnection = this.findInLinks(this.comfyApp.graph.links,(a =>
				a.id > -1 && a.target_id == link.in.id
				&& a.target_slot == link.in.slot && a.origin_id == link.out.id
				&& a.origin_slot == link.out.slot
			));
			if (sameConnection.length > 0) {
				link.in.comfy.disconnectInput(link.in.slot);
			}
			
		}
			
	},
	calculateLinkComfyData: function (nodeId, isInField, fieldName, linkNodeId, linkPortName, linkType) {
		var node1 = {
			id: nodeId,
			field: fieldName,
			comfy: this.getComfyNodeById(nodeId)
		}
		var node2 = {
			id: linkNodeId,
			field: linkPortName,
			comfy: this.getComfyNodeById(linkNodeId)
		}
		var nodeIn = isInField ? node1 : node2;
		var nodeOut = isInField ? node2 : node1;
		//the if is for loading
		if (nodeIn.comfy) {
			var inputs = nodeIn.comfy.inputs.filter(a => {
				if (nodeIn.comfy.type == "Reroute") return true;
				if (a.name.toLowerCase() == nodeIn.field.toLowerCase()) return true;
				return false;

			});
			if (inputs.length > 1) {
				console.log("this should not happen, a link event was thrown when comfy does not have this field as link");
				debugger;
			}
			if (inputs.length==1)
				nodeIn.slot = nodeIn.comfy.inputs.indexOf(inputs[0]);
		}
		

		if (nodeOut.comfy) {
			var outputs = nodeOut.comfy.outputs.filter(a => {
				if (a.name.toLowerCase() == nodeOut.field.toLowerCase()) return true;
				if (nodeOut.comfy.type == "Reroute") return true;
				if (nodeOut.comfy.type == "PrimitiveNode") return true;
				return false;
			})
			if (outputs.length != 1) {
				console.log("this should not happen, a link event was thrown when comfy does not have this field as link");
				debugger;
			}
			nodeOut.slot = outputs[0].slot_index ?? 0;
		}
		var result = {
			in: nodeIn,
			out: nodeOut,
			type: linkType
		};
		this.findLinkRows(result);
		return result;
	},
	nodeFieldLinkRemoved: function (node, nodeId, field, row, isInField, fieldName) {
		var res = this.calculateLinkComfyData(nodeId, isInField, fieldName, row.get("nodeId"), row.get("name"), row.get("type"));
		this.processLinkRemove(res, !isInField, isInField, true);
		
	},
	nodeFieldChanged: function (node, nodeConf, field, fieldConf, destroy) {
		var obj = {
			nodeId: nodeConf.id,
			nodeType: nodeConf.className,
			nodeConf: nodeConf,
			fieldName: fieldConf.fieldName,
			fieldSelected: fieldConf.fieldSelected,
			fieldConf: fieldConf,
		}

		var workflowNodeFields = this.get("workflowNodeFields");
		//add if doesn't exist, otherwise replace
		var existing = workflowNodeFields.find(a => a.nodeId == obj.nodeId && a.fieldName == obj.fieldName);
		if (existing) {
			//remove from array existing item
			workflowNodeFields = workflowNodeFields.filter(a => a != existing);
		}
		if (!destroy) {
			workflowNodeFields.push(obj);
		}
		//make copy of array
		workflowNodeFields = workflowNodeFields.slice();
		this.set("workflowNodeFields", workflowNodeFields);
		this.view.fireEventArgs("workflowNodeFieldsChanged", [workflowNodeFields]);
		//console.log(obj.nodeId, obj.fieldName, obj, existing, workflowNodeFields)
	},
	selectNodeField: function (nodeId, fieldName, selected) {
		if (selected === undefined) selected = true;
		var node = this.findNodeById(nodeId);
        if (node) {
            node.selectField(fieldName, selected);
        }
	},

	nodeFieldLinkAdded: function (node, nodeId, field, row, isInField, fieldName) {
		var res = this.calculateLinkComfyData(nodeId, isInField, fieldName, row.get("nodeId"), row.get("name"), row.get("type"));
		this.processLinkAdd(res, !isInField, isInField, true);	
	},
	// link_info object has
	// id, origin_id, origin_slot, target_id, target_slot, type
	// and i hate it
	calculateLinkNodeData: function (link_info) {
		var nodeOut = {
			id: link_info.origin_id,
			comfy: this.getComfyNodeById(link_info.origin_id),
			slot: link_info.origin_slot
		}
		nodeOut.field = nodeOut.comfy.outputs[nodeOut.slot].name;
		var nodeIn = {
			id: link_info.target_id,
			comfy: this.getComfyNodeById(link_info.target_id),
			slot: link_info.target_slot
		}
		nodeIn.field = nodeIn.comfy.inputs[nodeIn.slot].name;
		var result = {
			in: nodeIn,
			out: nodeOut,
			type: link_info.type
		};
		this.findLinkRows(result);
		return result;
		
	},
	comfyLinkRemoved: function (link_info) {
		var res = this.calculateLinkNodeData(link_info);
		this.processLinkRemove(res, true, true, false);
	},
	comfyLinkAdded: function (link_info) {	
		var res = this.calculateLinkNodeData(link_info);
		this.processLinkAdd(res, true, true, false);
	},
	
	getAllNodes: function () {
		var me = this;
		var nodes = [];
		var nodeReferences = this.get("nodes");
		nodeReferences.forEach(function (nodeReference) {
			var node = me.lookupReference(nodeReference);
			var ctrl = node.getController();
			nodes.push(ctrl);
		});
		nodes = nodes.sort((a, b) => {
			return a.getOrder() - b.getOrder();
		});
		return nodes;
	},
	notifyAllNodes: function(type,msg) {
		var me = this;
		var vm = this.getViewModel();

		this.getAllNodes().forEach(function (node) {
			node.notifyNode(type, msg);
		});
	},	
	getNodesValues: function () {
		var nodes = [];
		this.getAllNodes().forEach(function (node) {
			var res = node.getNodeValues();
			nodes.push(res);
		});
		return nodes;
	},
	updateWorkflowData: async function () {
		var workflow = this.getWorkflowData();

		var nodeValues = this.getNodesValues();
		nodeValues.forEach(function (node) {
			for (var p in node.fieldValues) {
				var fieldValue = node.fieldValues[p];
				if (fieldValue.linkField) {
					if (fieldValue.isInField) {
						var link = this.calculateLinkComfyData(node.id, true, fieldValue.fieldName, fieldValue.linkedNodeId, fieldValue.linkedNodePort, fieldValue.fieldType);
						fieldValue.fieldKeys = { key: p, id: link.out.id, slot: link.out.slot };
					}

				}

			}

		}, this);
		
		nodeValues.sort(function (a, b) {
            return a.order - b.order;
        });
		var nodeValuesString = JSON.stringify(nodeValues);
		//console.log(nodeValuesString)
		workflow.set("nodes_values", nodeValuesString);
		workflow.set("nodes_values_obj", nodeValues);

		var settings = this.getSettings();
		workflow.set("settings", JSON.stringify(settings));
		workflow.set("settings_obj", settings);

		var graph = await this.comfyApp.graphToPrompt();
		this.set('comfyConfig', graph);
		workflow.set("contents", JSON.stringify(graph.workflow));
		workflow.set("contents_obj", graph);

		
		return workflow;
	},
	runWorkflow: async function () {
		var res = await this.updateWorkflowData();


		var client_id = this.get("comfyClientId");
		var command = {
			client_id: client_id,
			prompt: {}
		}
		res.get("nodes_values_obj").forEach(function (node) {
			var inputs = {};
			for (var p in node.fieldValues) {
				var fieldValue = node.fieldValues[p];
				if (fieldValue.linkField) {
					if (fieldValue.fieldKeys) {
						inputs[fieldValue.fieldKeys.key] = ["" + fieldValue.fieldKeys.id, fieldValue.fieldKeys.slot]
					}
				} else {
					inputs[p] = fieldValue.value;
				}
			}

			command.prompt[node.id] = {
				class_type: node.className,
				inputs: inputs
			}
		}, this);
		
		
		//console.log("run workflow",command);
		
		//this.enqueuePrompt(command);
		var mrgPrompt = {
			client_id: client_id,
			prompt: res.getData()
		}
		this.enqueueMrgPrompt(mrgPrompt);
		//this.notifyAllNodes("refresh");
		
	},
	processMrgPromptError: function (response) {
		console.log(response);
		if (response.node_errors) {
			for (var nodeId in response.node_errors) {
				var nodeErrors = response.node_errors[nodeId];
				var node = this.findNodeById(nodeId);
				if (nodeErrors.errors) {
					nodeErrors.errors.forEach(function (error) {
						var field = error.extra_info.input_name;
						node.showError(field, error.message)
					}, this)
				}
			}
		}
	},
	processMrgPromptResponse: function (response) {
		if (response.success == "OK") {
			this.set("latestQueuedRun", response.batch_request_uuid);
			if (response.changes) {
				for (var nodeId in response.changes) {
					changes = response.changes[nodeId];
					var node = null;
					for (var field in changes) {
						if (!node) node = this.findNodeById(nodeId);
						change = changes[field];
						node.setValueAndPosForField(field, change.value, change.pos);
					}
					

				}
			}
		}
	},
	enqueueMrgPrompt: function (prompt) {
		delete prompt.prompt.contents_obj
		delete prompt.prompt.settings_obj
		delete prompt.prompt.nodes_values_obj
		var me = this;
		Ext.Ajax.request({
			url: "/mrg_prompt",
			method: 'POST',
			jsonData: prompt,

			success: function (result, action, response) {
				var jsonData = Ext.decode(result.responseText);
				
				console.log("request made", jsonData);
				me.processMrgPromptResponse(jsonData);
			},
			failure: function (result) {
				var jsonData = Ext.decode(result.responseText);
				me.processMrgPromptError(jsonData);
			},

			scope: this
		});
	},
	enqueuePrompt: function (prompt) {
		Ext.Ajax.request({
			url: "/prompt",
			method: 'POST',
			jsonData: prompt,

			success: function (result, action, response) {
				var jsonData = Ext.decode(result.responseText);
				console.log("request made", jsonData);

			},

			scope: this
		});
	},
	getWorkflowData: function () {
		return this.get("workflowData");
	},
	exportWorkflow: async function () {
		this.getWorkflowData().endEdit();
		await this.updateWorkflowData();
		var workflow = this.getWorkflowData();
		//export as json
		var data = workflow.getData();
		//delete data.uuid;
		//delete data.category_uuid;
		data.system = false;
		var jsonData = JSON.stringify(data);
		var blob = new Blob([jsonData], { type: "application/json" });
		var url = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.href = url;
		a.download = data.name + ".mrgw";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	},
	saveWorkflow: async function () {
		this.getWorkflowData().endEdit();
		await this.updateWorkflowData();
		var workflow = this.getWorkflowData();
		var me = this;
		workflow.save({
			success: function () {
			},
			failure: function () {
				Ext.Msg.alert('Error', 'Could not save workflow.');
			},
		})
	},
	saveAsWorkflow: async function () {
		this.getWorkflowData().endEdit();
		await this.updateWorkflowData();
		var rec = this.getWorkflowData().clone();
		var me = this;
		rec.set("uuid", crypto.randomUUID());
		rec.set("system", false);
		var category = this.get("categoryData");
		if (!category || category.get("system")) {
			rec.set("category_uuid", null);
		}
		rec.save({
			success: function () {				
				me.set("workflowData", rec);
				me.set("pressedShowEditForm", false);
			},
			failure: function () {
				Ext.Msg.alert('Error', 'Could not save as new workflow.');
			},
		});


	},
	acceptChangesWorkflow: async function() {
		await this.updateWorkflowData();
		this.get("workflowData").endEdit();
		this.set("pressedShowEditForm", false);
	},
	cancelEditWorkflow: async function () {
		this.get("workflowData").cancelEdit();
		this.set("pressedShowEditForm", false);
	},
	showEditForm: function () {		
		var pressed = this.get("pressedShowEditForm");
		var workflow = this.get("workflowData");
		if (pressed) {
			this.updateWorkflowData();
			workflow.beginEdit();
		}

	},
	runModeChanged: function (value) {
		var record = this.get("workflowData");
		this.set("selectedRunMode", value);
		var runSettings = this.get("runSettings");
		if (!runSettings) {
			runSettings = {};
			this.set("runSettings", runSettings);
		}
		var runModeSettings = runSettings[value];
		if (!runModeSettings) {
			var name = record.get("name");
			var tags = record.get("tags");
			runModeSettings = {
				nameRun: name,
				tagsRun: tags,
				runMode: value,
			};		
		}
		//i know it looks dumb, but that will increase compatibility in the future
		if (runModeSettings.numberOfRuns === undefined) runModeSettings.numberOfRuns = 1;
		if (runModeSettings.infinite === undefined) runModeSettings.infinite = false;
		if (runModeSettings.askForNameEachRun === undefined) runModeSettings.askForNameEachRun = false;
		if (runModeSettings.numberOfSteps === undefined) runModeSettings.numberOfSteps = 1;
		if (runModeSettings.startFromCurrent === undefined) runModeSettings.startFromCurrent = false;
		if (runModeSettings.doRunsInSequence === undefined) runModeSettings.doRunsInSequence = true;
		
		runSettings[value] = runModeSettings;
		this.set("currentRunModeSettings", runModeSettings);
	},
	runModeChangedUI: function (field, newValue, oldValue) {
		this.runModeChanged(newValue);
	},
	nodeFieldSequenceChanged: function (eventInfo) {
		var seqFields = this.get("sequenceFields");
		var newSeqFields = [].concat(seqFields)
		var idx = newSeqFields.findIndex(a => a.nodeId == eventInfo.nodeId && a.fieldName == eventInfo.fieldName);
		if (idx > -1) {
			Object.assign(newSeqFields[idx], eventInfo);
			this.set("sequenceFields", newSeqFields);
			//console.log("nodeFieldSequenceChanged", newSeqFields);
		}
		else {
			if (eventInfo.hasSequence) {
				//find max order and add it to eventInfo
				var maxOrder = 0;
				seqFields.forEach(function (field) {
					if (field.order > maxOrder) {
						maxOrder = field.order;
					}
				});
				eventInfo.order = maxOrder + 1;
				newSeqFields.push(eventInfo);
				this.set("sequenceFields", newSeqFields);
				//console.log("nodeFieldSequenceChanged", newSeqFields);
			}
		}


	},
	openNavigateSteps: function () {
		var sequenceFields = this.get("sequenceFields");
		var navigateStepsDialog = {
			xclass: 'MrG.dialog.view.StepNavigationV',
            _sequenceFields: sequenceFields,
            listeners: {
                navigateStepsClosed: 'navigateStepsClosed'
            }
		};
		var dialog = this.view.add(navigateStepsDialog);
		dialog.show();
	},
	navigateStepsClosed: function (sequenceFields) {
		if (sequenceFields) {
			this.set("sequenceFields", sequenceFields);
			this.getAllNodes().forEach(function (node) {
				node.updateSequenceFields(sequenceFields);
			});
		}
	},
	// #region Workflow settings
	openWorkflowSettings: function () {
		var currentRunModeSettings = this.get("currentRunModeSettings");
        var workflow = this.get("workflowData");
		var settingsDialog = {
			xclass: 'MrG.dialog.view.WorkflowSettingsV',
			_settings: currentRunModeSettings,
			listeners: {
				workflowSettingsClosed: 'workflowSettingsClosed'
			}
		};
		var dialog = this.view.add(settingsDialog);
		dialog.show();
	},
	workflowSettingsClosed: function (settings, run) {
		if (settings) {
			var runMode = this.get("selectedRunMode");
			this.get("runSettings")[runMode] = settings;
			this.set("currentRunModeSettings", settings);
        }
        if (run) {
            this.runWorkflow();
        }
	},
	
	getSettings: function () {
		var me = this;
		var settings = {};
		this.get("settingsList").forEach(function (setting) {
			settings[setting] = me.get(setting);
		})
		return settings;
	},
	setSettings: function (settings) {
		if (settings) {
			this.get("settingsList").forEach(function (setting) {
				if (settings[setting]!= undefined)
					this.set(setting, settings[setting]);
			}, this)
			
		}
	},

	// #endregion
	// #region Presets
	createPreset: function () {
		var presetData = this.get('presetData');
		presetData.set("alias","");
		this.set("presetData", presetData.clone());
		presetData.destroy();
		this.set('presetCreation', true)
	},
	
	processPreset: function (preset, ignoreFields) {
		if (!preset) return;
		if (!preset.length) return;
		preset = preset[0];
		var preset_text = preset.get("text");
		var presetValues = JSON.parse(preset_text);
		var nodes = this.getAllNodes();
		nodes.forEach(function (node) {
			var found = null;
			presetValues.forEach(function (preset) {
				if (!found) {
					var processed = node.processPreset(preset, ignoreFields);
					if (processed) {
						found = preset;
                    }
				}
			}, this);
			presetValues = presetValues.filter(a => a != found);
			
		}, this);
	},
	cancelPreset: function () {
		this.set('presetCreation', false)
	},
	savePreset: async function () {
		var presetData = this.get('presetData');
		presetData.set("uuid", crypto.randomUUID());
		var workflowData = await this.updateWorkflowData();
		var nodes_values_obj =  workflowData.get("nodes_values_obj");
		var presetValues = [];
		nodes_values_obj.forEach(function (node) {
            var nodeValues = {				
				nodeType: node.className,
				fieldValues: {}
			}
			var fieldCnt = 0;
			for (var p in node.fieldValues) {
				var field = node.fieldValues[p];
				if (field.fieldSelected) {
					nodeValues.fieldValues[p] = field;
					fieldCnt++;
				}
			}
			if(fieldCnt)
				presetValues.push(nodeValues);
		});
		presetData.set("text", JSON.stringify(presetValues));
		presetData.phantom = true;
		presetData.save();
		this.set('presetCreation', false);
	},

	// #endregion

	// #region Reorder nodes
	redoOrder: function () {
		var workflowView = this.lookup('workflowView');
		var ord = 1;
		workflowView.getItems().items.forEach(function (item) {
			var vm = item.getViewModel();
			if (vm) {
				vm.set('order', ord);
			}
			ord++;
		})
	},
	
	moveUpNode: function (ctrl) {
		var view = ctrl.getView();
		var workflowView = this.lookup('workflowView');
		var index = workflowView.indexOf(view);
		if (index > 0) {
			var item = view;
			workflowView.insert(index - 1, item);
			this.redoOrder();
		}
	},
	moveDownNode: function (ctrl) {
		var view = ctrl.getView();
		var workflowView = this.lookup('workflowView');
		var index = workflowView.indexOf(view);
		if (index >= 0 && (index + 1) < workflowView.getItems().items.length) {
			var item = view;
			workflowView.insert(index + 1, item);
			this.redoOrder();
		}
	},
	// #endregion

	// # region Comfy view control
	setComfyViewVisibility: function (cmp, visible) {
		cmp.getInnerHtmlElement().dom.children[0].children[0].style.visibility = visible;
	},
	comfyViewInit: function (cmp) {
		if (this.get("readOnlyWorkflow")) {
			this.setComfyViewVisibility(cmp, 'visible');
		}
	},
	comfyViewPointerDown: function (cmp) {
		this.setComfyViewVisibility(cmp, 'visible');
	},
	comfyViewPointerUp: function (cmp) {
		if (this.get("readOnlyWorkflow")) return;
		this.setComfyViewVisibility(cmp, 'collapse');
	},
	comfyViewResizeStart: function (cmp) {
		cmp._dragging = true;
		this.setComfyViewVisibility(cmp, 'visible');
	},
	comfyViewResizeEnd: function (cmp) {
		cmp._dragging = false;
		if (this.get("readOnlyWorkflow")) return;
		this.setComfyViewVisibility(cmp, 'collapse');
    },
});
