'use strict'

const AccountInfo = require('../models/account.info');

module.exports.populate = (req, res, next) => {
  AccountInfo.find()
  .then(accounts => {
      // fetch accounts and map them to only include name and price
      const mappedAccounts = accounts.map((index)=> {
          return { name: index.name, price: index.price}
      })
      res.json(mappedAccounts)
  })
}