const ingestion = require('watchtower-log-ingestion');
const eventTable = process.env['WATCHTOWER_EVENT_TABLE'];
const property = require('./property');

module.exports.handler = ingestion.createIngestionHandler(eventTable, [property]);
