Ext.define('MrG.base.vm.BaseNodeVM', {
    extend: 'MrG.base.vm.BaseVM',
    data: {
        title: '',
        description: '',
        id: -1,
        className: '',
        order: 0,
        alias: '',
        fieldReferences: [], 
        nodeHidden: false,
        nodeHiddenSearch: false,
        selectedNode: false,
        comfyCategory: null,
        collapsed: false,
        hideLoadDefaultLayout: false,
        hideSetLayoutAsDefault: false,
    },
    formulas: {
        collapsedPanel: {

            //TODO: when title hidden they should no longer be collapsed
            get: function (get) {
                return get('collapsed');
            },
            set: function (value) {
                this.set('collapsed', value);
            }
        },
        borderShow: {
            get: function (get) {
                var selected = get('selectedNode');
                return selected;
            }
        },
        headerColor: {
            get: function (get) {
                var selected = get('selectedNode');
                if (selected) return 'backgroundColor:red'
                return 'xx:xx';
            }
        },
        hideNodeCls: {
            get: function (get) {
                if (get('nodeHidden')) {
                    return "";
                }
                return "-slash";
            }
        },
        hideNodeText: {
            get: function (get) {
                if (get('nodeHidden')) {
                    return "Show node";
                }
                return "Hide node";
            }
        },
        hideNode: {
            get: function (get) {
                var hiddenSearch = get('nodeHiddenSearch');
                if (hiddenSearch) return true;
                var showHiddenNodes = get('showHiddenNodes');
                if (showHiddenNodes) return false;
                return get('nodeHidden');
            }
        },
        titlePanel: {
            get: function (get) {
                var title = get('title');
                var alias = get('alias');
                var id = get('id');
                if (alias) {
                    return alias + ' - ' + title + ' (' + id+ ')';
                } 
                return title + ' (' + id+ ')';
            }
        }
    },
   
});
