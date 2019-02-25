const recorder = require('watchtower-recorder');

// Loading modules that fail when required via vm2
const jws      = require('jws');
const bufferEq = require('buffer-equal-constant-time');
const sax      = require('sax');

const mock = {
    'jws' : jws,
    'buffer-equal-constant-time' : bufferEq ,
    'sax' : sax,
};

module.exports.postHandler = recorder.createRecordingHandler('src/folders-original.js', 'postHandler' , mock);
module.exports.putHandler = recorder.createRecordingHandler('src/folders-original.js', 'putHandler' , mock);
module.exports.deleteHandler = recorder.createRecordingHandler('src/folders-original.js', 'deleteHandler' , mock);
