Ext.define('MrG.main.ctrl.LayoutC', {
	extend: 'MrG.base.ctrl.BaseTabPanelC',
	websocket: null,
	init: function () {
		this.callParent(arguments);
		this.view.setMasked(false);
		this.initWebsocket();
	},
	initWebsocket: function () {
		this.websocket = Ext.create('Ext.ux.WebSocket', {
			autoReconnect: true,
			autoReconnectInterval: 1000,
			keepUnsentMessages: true,
			url: '/ws',
			listeners: {
				open: function (ws) {
					console.log('The websocket is ready to use');
					ws.send('This is only-text message');					
				},
				close: function (ws) {
					console.log('The websocket is closed!');
				},
				message: function (ws, message) {
					console.log('Text-only message arrived is: ' + JSON.stringify(message));
				},
				error: function (ws, error) {
					Ext.Error.raise(error);
				},

			}
		});

		// A 'stop' event is sent from the server
		// 'data' has 'cmd' and 'msg' fields
		this.websocket.on('stop', function (data) {
			console.log('Command: ' + data.cmd);
			console.log('Message: ' + data.msg);
		});
	},
	toMrGUI: function () {
		this.toSubTab(0);
	},
	toComfyUI: function () {
		this.toSubTab(1);
	},
	toSubTab: function (tab) {
		this.view.setMasked(true);
		this.view.setActiveItem(tab);
		this.view.setMasked(false);
	}



});
