// Property:
//   A cipher can only be written to a table that was created beforehand, 
//   and not deleted since then.

const property = {
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
};

module.exports = property;
