const stripe = require('stripe')('sk_test_ZaWMUUXlFjKGoG4VyftGyCQ9')
const Account = require('../models/account');

module.exports.eventListener = (req, res) => {
    if(req.body.type === 'invoiceItem.created'){
        console.log(req.body)
        res.send(200)
    }

    if(req.body.type === 'customer.subscription.created'){
        const subscriptionId = req.body.data.object.id
        const stripeUser = req.body.user_id
        const startTime = req.body.data.object.trial_start
        stripe.subscriptions.update(
            `${subscriptionId}`,
            { trial_end: startTime + 30 },
            { stripe_account: stripeUser },
            (err, subscription) => {
                if(err) {
                    console.log(err)
                } else {
                    res.send(200)
                }
            }
        )
    }
    if(req.body.type === 'invoice.created' && req.body.data.object.closed=== false){
        const invoiceId = req.body.data.object.id
        const invoicePrice = req.body.data.object.amount_due
        const planId = req.body.data.object.lines.data[0].plan.id || null
        const conditions = { plan: planId}
        const customer = req.body.data.object.customer
        const stripeUser = req.body.user_id
        if(planId != null) {
            Account.findOne(conditions)
            .then((account) => {
                const adjustedPrice = Math.floor((account.price/account.users) * 100)
                if(invoicePrice === adjustedPrice){
                    res.send(200)
                } else {
                    const creditToAdd = adjustedPrice - invoicePrice;
                        stripe.invoiceItems.create({
                            customer: customer,
                            amount: creditToAdd,
                            currency: 'usd',
                            invoice: invoiceId
                        }, {stripe_account: stripeUser },(err, item) => {
                            if(err){
                                console.log(err)
                            }
                            console.log(item)
                            res.send(200)
                        })
                }
            })
        }
        else {
            console.log(req.body)
            res.send(200)
        }
    }
    if(req.body.type === 'invoice.created' && req.body.data.object.closed=== true){
        res.send(200)
    }
}