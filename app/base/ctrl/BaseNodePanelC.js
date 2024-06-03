Ext.define('MrG.base.ctrl.BaseNodePanelC', {
	extend: 'MrG.base.ctrl.BasePanelC',
	clickedOnNode: function (eventData, object) {
		var el = Ext.get(object.id);
		this.findClickedNode(el);
	},
	findClickedNode: function (el) {
		if (el) {
			if (el.component && el.component.isNode) {
				this.clickedNode(el.component);
			}
			else {
				this.findClickedNode(el.parent());
			}
		}
	},
	searchValueChanged: function (ctrl, val) {
		var me = this;
		var vm = this.getViewModel();
		var nodeReferences = vm.get("nodes");

		nodeReferences.forEach(function (nodeReference) {
			var node = me.lookupReference(nodeReference);
			var ctrl = node.getController();
			var match = ctrl.findIfMatches(val)
			if (match) {
				ctrl.showNodeSearch();
			} else {
				ctrl.hideNodeSearch();
			}
		});
	},
	clickedNode: function (clickedNodeView) {
		var clickedNodeCtrl = clickedNodeView.getController();
		var clickedNodeId = clickedNodeCtrl.getNodeId();

		var vm = this.getViewModel();
		var selectedNodeIds = vm.get("selectedNodeIds");
		var canSelectNodes = vm.get("canSelectNodes");
		if (!canSelectNodes && selectedNodeIds.length == 0) return;



		var canSelectMultipleNodes = vm.get("canSelectMultipleNodes");
		if (canSelectNodes && canSelectMultipleNodes) {
			if (clickedNodeCtrl.isNodeSelected()) {
				clickedNodeCtrl.nodeDeselected();
				var index = selectedNodeIds.indexOf(clickedNodeId);
				selectedNodeIds.splice(index, 1);
			} else {
				clickedNodeCtrl.nodeSelected();
				selectedNodeIds.push(clickedNodeId);
			}
		} else {
			var me = this;
			var nodeReferences = vm.get("nodes");
			var hideComfy = vm.get("hideComfy");
			nodeReferences.forEach(function (nodeReference) {
				var node = me.lookup(nodeReference);
				var nodeController = node.getController();
				if (node.id == clickedNodeView.id) {
					if (canSelectNodes && !clickedNodeCtrl.isNodeSelected()) {
						clickedNodeCtrl.nodeSelected();
						selectedNodeIds.length = 0;
						selectedNodeIds.push(clickedNodeId)
						if (!hideComfy) {
							//TODO: focus on element on comfy side
						}
					}
					else {
						clickedNodeCtrl.nodeDeselected();
					}
				} else {
					nodeController.nodeDeselected();
				}
			})
		}
		vm.set("selectedNodesCount", selectedNodeIds.length);

	},
	selectNode: function (id) {
		var node = this.findNodeById(id)
		if (node) {
			var view = node.getView();
			var el = view.el;
			var workflowView = this.lookup('workflowView');
			if (workflowView) {
				var scroll = workflowView.getScrollable();
				if (scroll) {
					var isVisible = scroll.isInView(el);
					
					var region = Ext.fly(el).getRegion();
					var pos = scroll.getPosition();
					
					var y = region.y - region.height;
					if (y < 0) y = pos.y + y ;
					if (y < 0) y = 0;
					this.log("INFO", "BaseNodePanelC",isVisible, pos.y, region.y, y);
					//TODO: fix scroll
					//scroll.scrollTo(0, y, true);
				}
				
			}
			//TODO: make selection work
			//node.nodeSelected();
			
		}
	},
	deselectNode: function (id) {
		var node = this.findNodeById(id)
		if (node)
			node.nodeDeselected();
	},

	clearSelection: function () {
		var me = this;
		var vm = this.getViewModel();
		var nodeReferences = vm.get("nodes");
		nodeReferences.forEach(function (nodeReference) {
			var node = me.lookup(nodeReference);
			var nodeController = node.getController();
			nodeController.nodeDeselected();
		});
		vm.set("selectedNodeIds", [])
		vm.set("selectedNodesCount", 0);
	},
	selectionDone: function () {
		var me = this;
		var vm = this.getViewModel();
		var selectedNodeIds = vm.get("selectedNodeIds");
		var nodes = []
		var nodeReferences = vm.get("nodes");
		nodeReferences.forEach(function (nodeReference) {
			var node = me.lookup(nodeReference);
			var nodeController = node.getController();
			var nodeId = nodeController.getNodeId();
			if (selectedNodeIds.indexOf(nodeId) != -1) {
				nodes.push(node);
			}
		});

		if (this.selectionFinished) {
			var configs = nodes.map(a=>a.getController().getNodeValues());
			this.selectionFinished(configs);
		}
		this.selectionCanceled();
	},
	selectionCanceled: function () {
		this.clearSelection();
		this.getView().hide();
	},
	configureSelectionEvents: function (name, method) {
		this[name] = method;
	},
});