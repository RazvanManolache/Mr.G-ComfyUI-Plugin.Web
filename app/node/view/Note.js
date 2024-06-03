Ext.define('MrG.node.view.Note', {
    extend: 'MrG.base.view.BaseNodeV',
    _nodeDefinition: {
        nodeTitle: 'Note',
        className: 'Note',
        comfyCategory: 'utils',
        fieldReferences: ['fld-Note']

    },
    _nodeConfig: {

    },
    viewModel: {
        xclass: 'MrG.node.vm.NoteVM'
    },
    controller: {
        xclass: 'MrG.node.ctrl.NoteC'
    },
    items: [
        blocksInterpreter.createField('Note', ['STRING', {}], 'Note'),
    ]
});