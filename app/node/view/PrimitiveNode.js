Ext.define('MrG.node.view.PrimitiveNode', {
    extend: 'MrG.base.view.BaseNodeV',
    _nodeDefinition: {
        nodeTitle: 'Primitive',
        className: 'PrimitiveNode',
        comfyCategory: 'utils',
        // primitives start only with the out port
        fieldReferences: ['fld-Out']

    },
    _nodeConfig: {

    },
    viewModel: {
        xclass: 'MrG.node.vm.PrimitiveNodeVM'
    },
    controller: {
        xclass: 'MrG.node.ctrl.PrimitiveNodeC'
    },
    items: [
        blocksInterpreter.createField('Out', ["%", 'output'], 'PrimitiveNode'),
        
    ]
});