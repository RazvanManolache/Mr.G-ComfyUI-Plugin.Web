Ext.define('MrG.main.ctrl.NodeListC', {
	extend: 'MrG.base.ctrl.BasePanelC',	
	init: function () {
		this.callParent(arguments);

		var view = this.getView();

		view.add(blocksInterpreter.allBlocks.map(function (f) {
			return {
				xclass: f.nodeClass,
			}
		}));
		
	}
});
