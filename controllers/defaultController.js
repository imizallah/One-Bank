
// const moment = require('moment');
const http = require("http");
const crypto = require("crypto");
const { nibss } = require('innovation-sandbox')
const axios = require('axios')
const User = require('../models/user').User;


module.exports = {

  index: (req, res) => {
    res.render("default/index")

  },

  verifyAccountName: async (req, res) => {

    User.findOne({ email: req.body.email }).then(async(user) => {
      if (user){
        req.flash('error-message', 'Email already exists!!')
        res.redirect('/')

      }else{
        var {bankName, accountNumber} = req.body
        bankName = bankName.toLowerCase()

        console.log(req.body)
        
        axios({
          method: 'get',
          baseURL: 'https://sterlingservice.azure-api.net',
          url: '/TransferAPIs/api/Spay/InterbankNameEnquiry?',
          params: {
              Referenceid: "01",
              RequestType: "01",
              Translocation: "01",
              ToAccount: accountNumber,
              destinationbankcode: "058"
            },
          headers: {
            "Sandbox-Key": "fa2465f34b8ce4093fb15d4263864953",
            "Ocp-Apim-Subscription-Key": "1cc664165bd4490e97019c61a492d19a",
            "Ocp-Apim-Trace": "true",
            "Appid": "69",
            "Content-Type": "application/json",
            "ipval": 0
            }
          })
          .then((response) => {
            console.log(response)

            const newUser = new User({
              fullName: response.data.data.AccountName,
              accountNumber: response.data.data.AccountNumber, 
              bvn: response.data.data.BVN,
              bankName: req.body.bankName,
              password: req.body.password,
              email: req.body.email

            });
      
            newUser.save()
            req.flash('success-message', "Registration Successful!!!");
            res.redirect('/login');

          })
          .catch((error) => console.log(error))
      }
    })

    
  }, 

  loginGet: (req, res) => {
    res.render("default/login")
  },

  dashboard: (req, res) => {
    res.render("default/dashboard")
  },

  logout: (req, res) => {

    req.logOut();
    req.flash('success-message', 'Logout was successful');
    res.redirect('/');
  }
}



