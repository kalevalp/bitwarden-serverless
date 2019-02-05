const recorder = require('watchtower-recorder');
const aws      = require('aws-sdk');

// const s3  = new aws.DynamoDb();
// const rek = new aws.Rekognition();

const mock = {
    'aws-sdk' : new Proxy(aws, {
        apply: function(target, thisArg, argumentsList) {
            console.log(`####! Applying function: ${target}.`);

            return target.apply(thisArg, argumentsList);
        },
        
        construct: function (target, args) {
            console.log(`####! ${target} constructor called.`);

            return new target(...args);
        },

        get: function(obj, prop) {
            console.log(`####! Get for prop ${prop} in object ${obj}.`);
            return obj[prop];
        }
})};

module.exports.postHandler = recorder.createRecordingHandler('folders-original.js', 'postHandler' , mock);
module.exports.putHandler = recorder.createRecordingHandler('folders-original.js', 'putHandler' , mock);
module.exports.deleteHandler = recorder.createRecordingHandler('folders-original.js', 'deleteHandler' , mock);