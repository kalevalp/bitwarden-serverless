const properties = [
    {
        name: 'writetoexistingfolder',
        quantifiedVariables: ['table', 'cipher'],
        projections: [['table'], ['table', 'cipher']],
        stateMachine: {
            'WRITING_TABLE' : {
                params: [
                    'table'
                ],
                'INITIAL' : {
                    to: 'created'
                }
            },
            'DELETING_TABLE' : {
                params: [
                    'table'
                ],
                'created' : {
                    to: 'deleted'
                }
            },
            'WRITING_CIPHER' : {
                params: [
                    'cipher',
                    'table'
                ],
                'INITIAL': {
                    to: 'FAILURE'
                },
                'deleted': {
                    to: 'FAILURE'
                },
                'created': {
                    to: 'SUCCESS'
                }
            },
        }
    }
];

module.exports = properties;
