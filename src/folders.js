const recorder = require('watchtower-recorder');
const aws      = require('aws-sdk');
const jws      = require('jws');
const bufferEq = require('buffer-equal-constant-time');

// const s3  = new aws.DynamoDb();
// const rek = new aws.Rekognition();

const mock = {
    'aws-sdk' : new Proxy(aws,{
        get: function(obj, prop) {
            // console.log(`####! Get for prop ${prop} in object ${obj}.`);
            if (prop === "DynamoDB") {
                const ddb = obj[prop];                
                const ddbProxy = new Proxy(ddb, {
                    // get: function(obj, prop) {
                    //     console.log(`##DDB! Get for prop ${prop} in object ${obj}.`);
                    //     return obj[prop];
                    // },
                        
                    construct: function (target, args) {
                        // console.log(`##DDB! ${target} constructor called.`);
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
                    
                    // apply: function(target, thisArg, argumentsList) {
                    //     console.log(`##DDB! Applying function: ${target}.`);
                    //     return target.apply(thisArg, argumentsList);
                    // },       
                });
                return ddbProxy;
            } else {
                return obj[prop];
            }
        },

        // construct: function (target, args) {
        //     console.log(`####! ${target} constructor called.`);

        //     return new target(...args);
        // },

        // apply: function(target, thisArg, argumentsList) {
        //     console.log(`####! Applying function: ${target}.`);

        //     return target.apply(thisArg, argumentsList);
        // },       
    }),
    'jws' : jws,
    'buffer-equal-constant-time' : 'bufferEq',
    // 'aws-sdk' : new Proxy(aws, {
    //     apply: function(target, thisArg, argumentsList) {
    //         console.log(`####! Applying function: ${target}.`);

    //         return target.apply(thisArg, argumentsList);
    //     },
        
    //     construct: function (target, args) {
    //         console.log(`####! ${target} constructor called.`);

    //         return new target(...args);
    //     },

    //     get: function(obj, prop) {
    //         console.log(`####! Get for prop ${prop} in object ${obj}.`);
    //         return obj[prop];
    //     }
};

module.exports.postHandler = recorder.createRecordingHandler('src/folders-original.js', 'postHandler' , mock);
module.exports.putHandler = recorder.createRecordingHandler('src/folders-original.js', 'putHandler' , mock);
module.exports.deleteHandler = recorder.createRecordingHandler('src/folders-original.js', 'deleteHandler' , mock);
