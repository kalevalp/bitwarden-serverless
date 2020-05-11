const recorder = require('watchtower-recorder');

const eventsStreamName = process.env['WATCHTOWER_EVENT_KINESIS_STREAM'];
const eventPublisher = recorder.createEventPublisher(eventsStreamName);


// Loading modules that fail when required via vm2
const jws      = require('jws');
const bufferEq = require('buffer-equal-constant-time');
const sax      = require('sax');
const aws      = require('aws-sdk');

const cipherTableName = process.env.CIPHERS_TABLE;

let context;
let lambdaExecutionContext;
let lambdaInputEvent;
function updateContext(name, event, lambdaContext) {
    context = name;
    lambdaExecutionContext = lambdaContext;
    lambdaInputEvent = event;
}

const mock = {
    'aws-sdk' : new Proxy(aws,{
        get: function(obj, prop) {
            if (prop === "DynamoDB") {
                const ddb = obj[prop];
                const ddbProxy = new Proxy(ddb, {
                    construct: function (target, args) {
                        newddbProxy = new Proxy (new target(...args),{
                            get: function(obj, prop) {
        			if (prop === 'constructor') {
        			    return new Proxy (obj[prop], {
        				get: function(obj, prop) {
        				    if (prop === '__super__') {
        					return new Proxy (obj[prop], {
        					    construct: function (target, args) {
        						return new Proxy (new target(...args), {
        						    get: function(obj, prop) {
        							if (prop === 'makeRequest') {
        							    return new Proxy(obj[prop], {
        								apply: function(target, thisArg, argumentsList) {
                                                                            console.log("Running makeRequest from proxy!");

                                                                            if (argumentsList[0] === 'putItem' &&
                                                                                argumentsList[1] &&
                                                                                argumentsList[1].TableName === cipherTableName &&
                                                                                argumentsList[1].Item &&
                                                                                argumentsList[1].Item.folderUuid) {

                                                                                return target.
                                                                                    apply(thisArg, argumentsList).
                                                                                    on('success', (response) => {
                                                                                        eventPublisher({name: "WRITING_CIPHER", params: { cipher : argumentsList[1].Item.uuid, table : argumentsList[1].Item.folderUuid}},
                                                                                                       lambdaExecutionContext);
                                                                                    });
                                                                            } else if (argumentsList[0] === 'deleteItem' &&
                                                                                       argumentsList[1] &&
                                                                                       argumentsList[1].TableName === cipherTableName &&
                                                                                       argumentsList[1].Key &&
                                                                                       argumentsList[1].Key.uuid) {
                                                                                return target.
                                                                                    apply(thisArg, argumentsList).
                                                                                    on('success', function(response) {
                                                                                        eventPublisher({name: "DELETING_CIPHER", params: { cipher : argumentsList[1].Key.uuid}},
                                                                                                       lambdaExecutionContext);
                                                                                    });
                                                                            } else {
        								        return target.apply(thisArg, argumentsList);
                                                                            }
        								}
        							    });
        							} else {
        							    return obj[prop];
        							}
        						    }
        						});
        					    }
        					});
        				    } else {
        					return obj[prop];
        				    }
        				}
        			    });
        			} else {
                                    return obj[prop];
        			}
                            },
                        });
                        return newddbProxy;
                    },
                });
                return ddbProxy;
            } else {
                return obj[prop];
            }
        },
    }),
    'jws' : jws,
    'buffer-equal-constant-time' : bufferEq,
    'sax' : sax,
};

module.exports.postHandler = recorder.createRecordingHandler('src/ciphers-original.js', 'postHandler' , mock, false, updateContext, true);
module.exports.putHandler = recorder.createRecordingHandler('src/ciphers-original.js', 'putHandler' , mock, false, updateContext, true);
module.exports.deleteHandler = recorder.createRecordingHandler('src/ciphers-original.js', 'deleteHandler' , mock, false, updateContext, true);

/*

					construct: function (target, args) {
					    console.log(`##DDB! ${target} constructor called.`);
					    return new target(...args);
					},
					apply: function(target, thisArg, argumentsList) {
					    console.log(`##DDB! Applying function: ${target}.`);
					    return target.apply(thisArg, argumentsList);
					},
					get: function(obj, prop) {
					    console.log(`##DDB! Get for prop ${prop} in object ${obj}.`);
					    return obj[prop];
					}

*/
