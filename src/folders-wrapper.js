const recorder = require('watchtower-recorder');

// Loading modules that fail when required via vm2
const jws      = require('jws');
const bufferEq = require('buffer-equal-constant-time');
const sax      = require('sax');

const mock = {
    'aws-sdk' : new Proxy(aws,{
        get: function(obj, prop) {
            if (prop === "DynamoDB") {
                const ddb = obj[prop];                
                const ddbProxy = new Proxy(ddb, {
                    construct: function (target, args) {
                        newddbProxy = new Proxy (new target(...args),{
                            construct: function (target, args) {
                                console.log(`##DDB! ${target} constructor called.`);
                                return new target(...args);
                            },
                            get: function(obj, prop) {
                                console.log(`##DDB! Get for prop ${prop} in object ${obj}.`);
                                return obj[prop];
                            },
                            apply: function(target, thisArg, argumentsList) {
                                console.log(`##DDB! Applying function: ${target}.`);
                                return target.apply(thisArg, argumentsList);
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

module.exports.postHandler = recorder.createRecordingHandler('src/folders-original.js', 'postHandler' , mock);
module.exports.putHandler = recorder.createRecordingHandler('src/folders-original.js', 'putHandler' , mock);
module.exports.deleteHandler = recorder.createRecordingHandler('src/folders-original.js', 'deleteHandler' , mock);
