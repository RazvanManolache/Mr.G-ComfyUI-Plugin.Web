Ext.define('MrG.dialog.ctrl.SelectNodeC', {
	extend: 'MrG.base.ctrl.BaseNodePanelC',
	init: function () {
		this.callParent(arguments);

		var vm = this.getViewModel();
		vm.set('title', "Select node");
				
		var nodeNames = blocksInterpreter.allBlocks.sort(function (a, b) {
			if (a.nodeTitle < b.nodeTitle) {
				return -1;
			}
			if (a.nodeTitle > b.nodeTitle) {
				return 1;
			}
			return 0;
		})
		var id = 0;
		var allNodes = nodeNames.map(function (f) {
			id++;			
			return {
				xclass: f.nodeClass,
				listeners: {
					click: {
						element: 'element',
						fn: 'clickedOnNode'
					},
				},				
				reference: 'node-' + id,
				_nodeConfig: {
					id: id
				}
			}
		});
		
		this.nodesRemaining = allNodes.slice(1, 1);
		this.addItemsInChunks();
		

	},
	chunkSize: 1,
	nodesRemaining: [],
	shownCounter:0,
	showingSelector: function () {
		this.shownCounter++;
		var view = this.getView();
		view.setMasked(false);
		//if (this.shownCounter > 1 && this.nodesRemaining.length > 0) {
		if (this.nodesRemaining.length > 0) {
			
			view.setMasked(true);
			var me = this;
			setTimeout(function () {
				me.addItemsInChunks(true);
				view.setMasked(false);
			}, 300);
		}
	},
	addItemsInChunks: function (forceAll) {
		if (this.nodesRemaining.length == 0) return;
		var nodesToAdd = []
		var i = 0;
		while ((i < this.chunkSize || forceAll) && this.nodesRemaining.length > 0) {
			nodesToAdd.push(this.nodesRemaining.shift())
			i++;
		}

		var vm = this.getViewModel();
		var existingReferences = vm.get('nodes');
		var references = existingReferences.concat(nodesToAdd.map(a => a.reference));
		vm.set('nodes', references);

		var view = this.getView();
		view.add(nodesToAdd);

		
		if (this.nodesRemaining.length > 0) {
			var me = this;
			setTimeout(function () {
				me.addItemsInChunks();
			}, 250);
		} else {
			console.log("Finished making Select Node dialog")
		}
	}
});
