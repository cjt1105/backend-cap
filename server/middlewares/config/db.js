'use strict'

const mongoose = require('mongoose');
const mongoUrl = process.env.MONGODB_URL ||'mongodb://localhost:27017/streambuddies';

mongoose.Promise = Promise;

module.exports.connect = () => mongoose.connect(mongoUrl);