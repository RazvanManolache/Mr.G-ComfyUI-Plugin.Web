Ext.define('MrG.dialog.vm.SelectNodeVM', {
	extend: 'MrG.main.vm.WorkflowVM',
	data: {
		hideConnections: true,
		hideInConnections: false,
		hideOutConnections: false,

		hideTitles: false,
		hideModifying: true,
		forceShowHiddenFields: true,
		forceHideFields: true,
		showHiddenNodes: true,
		
		hideGenerate: true,

		disableUndo: true,
		hideUndo: true,
		disableRedo: true,
		hideRedo: true,





		hideEditDetails: true,


		nodes: [],
		title: '',
		comfyConfig: {},

		hideComfy: true,

		hideNodeClose: true,
		hideConfigure: false,
		hideMoveDown: true,
		hideMoveUp: true,
		hideAddNodeAbove: true,
		hideAddNodeBelow: true,

		canHideNodes: true,
		showHiddenNodes: false,

		canSelectNodes: true,
		canSelectMultipleNodes: true,
	},
	formulas: {
		
	},	
});
