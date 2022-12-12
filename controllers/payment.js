const braintree = require("braintree");

var gateway = braintree.connect({
  environment:  braintree.Environment.Sandbox,
  merchantId:   '4x9x2y7kr27ddxjf',
  publicKey:    'z5ptwpkyy76v4679',
  privateKey:   '7bd48646f5899390d191062dc09df813'
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.send(response);
        }
    });
}

exports.processPayment = (req, res) => {

    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amount = req.body.amount

    gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: nonceFromTheClient,
        
        options: {
          submitForSettlement: true
        }
      }).then(result => { 
        res.json(result);
      })
      .catch(err => {
        res.status(500).json(err);
      });
}