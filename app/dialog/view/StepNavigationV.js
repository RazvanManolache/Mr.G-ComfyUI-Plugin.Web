Ext.define('MrG.dialog.view.StepNavigationV', {
	extend: 'MrG.base.view.BasePanelV',
	layout: 'vbox',
	modal: true,
	controller: {
		xclass: 'MrG.dialog.ctrl.StepNavigationC'
	},
	viewModel: {
		xclass: 'MrG.dialog.vm.StepNavigationVM'
	},
	title: 'Step navigation',
	width: '90%',
	height: '90%',
	modal: true,
	floated: true,
	resizeable: true,
	centered: true,
	maximizable: true,
	scrollable: true,
	closable: true,
	items: [

		{
			xtype: 'container',
			flex: 1,
			layout: 'vbox',
			margin: 10,
			items: [
				{
					xtype: 'label',
					margin: 10,
					html: 'Here you can manage fields with sequence values. You can move fields up and down, set them to use fixed values, increment, decrement or set random values. You can also move fields up or down to set order in which the sequence is executed. '
				},
				{
					title: 'Sequence fields',
					reference: 'fieldsGrid',
					sortable: false,
					xtype: 'grid',
					bind: {
						store: '{fieldsStore}'
					},
					flex: 1,
					plugins: {
						gridrowdragdrop: true,
						rowoperations: {
							operation: {
								ui: 'alt',
								text: 'Operations',
								selecting: true,
								menu: [{
									text: 'To start',
									iconCls: 'x-fa fa-backward',
									handler: 'toStart'
								}, {
									text: 'To end',
									iconCls: 'x-fa fa-forward',
									handler: 'toEnd'
								},
								{
									separator: true,
									text: 'Fixed',
									iconCls: 'x-fa fa-equals',
									handler: 'toFixed'
								}, {
									text: 'Increment',
									iconCls: 'x-fa fa-plus',
									handler: 'toIncrement'
								},
								{
									text: 'Decrement',
									iconCls: 'x-fa fa-minus',
									handler: 'toDecrement'
								}, {
									text: 'Random',
									iconCls: 'x-fa fa-random',
									handler: 'toRandom'
								},
								{
									separator: true,
									text: 'To transparent',
									iconCls: 'x-fa fa-equals',
									handler: 'toTransparent'
								}, {
									text: 'To nontransparent',
									iconCls: 'x-fa fa-plus',
									handler: 'toNonTransparent'
								},
								]
							}
						}
					},
					columns: [
                        {
                            text: 'Node',
                            dataIndex: 'nodeName',
                            flex: 1
                        },
                        {
                            text: 'Field',
                            dataIndex: 'fieldName',
                            flex: 1
						},
						{
							text: 'Sequence',
							dataIndex: 'sequence',
							flex: 1
						},
						{
							text: 'Transp',
							dataIndex: 'transparentSequence',
							flex: 1
						},
						{
							text: 'Pos',
							dataIndex: 'position',
							flex: 1
						},
						{
							text: 'Tot',
							dataIndex: 'totalCnt',
							flex: 1
						},
						{
							text: 'Options',
							flex:1,
							cell: {
								tools: {
									up: {
										handler: 'moveUp',
										tooltip: 'Move up'
									},
									
									down: {
										handler: 'moveDown',
										tooltip: 'Move down'
										
									}
								}
							}
						},
						
                    ],

				},
				{
					xtype: 'label',
					margin: 10,
					bind: {
						html: 'You have a total of {combinations} combinations produced by {sequenceFields} sequence fields. You have {randomFields} random fields, {transparentSequenceFields} transparent inc/dec fields and {fixedFields} fixed fields.'
					}
				}
			]
		}
	],
	bbar: {
		items: [
			{
				xtype: 'button',
				text: 'OK',
				handler: 'onOk'
			},
			{
				xtype: 'button',
				text: 'Cancel',
				handler: 'onCancel'
			}
		]
	}

	

});