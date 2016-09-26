'use strict'

const mongoose = require('mongoose');
const mongoUrl = 'mongodb://localhost:27017/streambuddies';

mongoose.Promise = Promise;

module.exports.connect = () => mongoose.connect(mongoUrl);