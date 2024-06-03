Ext.define('MrG.base.vm.BaseNodeVM', {
    extend: 'MrG.base.vm.BaseVM',
    data: {
        title: '',
        description: '',
        id: -1,
        className: '',
        order: 0,
        fieldReferences: [], 
        nodeHidden: false,
        nodeHiddenSearch: false,
        selectedNode: false,
        comfyCategory: null,

        hideLoadDefaultLayout: false,
        hideSetLayoutAsDefault: false,
    },
    formulas: {
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
                var id = get('id');
                return title + ' (' + id+ ')';
            }
        }
    },
   
});
