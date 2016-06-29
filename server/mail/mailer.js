var async = require("async");
var nodemailer = require("nodemailer");

var fs = require('fs');
var express        			= require('express');
var app            			= express.Router();


// This will store emails needed to send.
// We can fetch it from DB (MySQL,Mongo) and store here.
var listofemails = ["adfitfidelizacion@gmail.com"]; //DEPRECADO
// Will store email sent successfully.
var success_email = [];
// Will store email whose sending is failed. 
var failure_email = [];

var transporter;

var userMail = 'adfitfidelizacion@gmail.com';
var example = '';



var data_html = '';
var subject = '';
var email = '';

/* Loading modules done. */

function massMailer() {
    var self = this;
    transporter = nodemailer.createTransport("SMTP",{
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: userMail,
            pass: 'fidelizacionadfit'
         },
          tls: {rejectUnauthorized: false},
          debug:true
        });
    // Fetch all the emails from database and push it in listofemails
        // Will do it later.
    self.invokeOperation();
};

/* Invoking email sending operation at once */

massMailer.prototype.invokeOperation = function() {
    var self = this;
    async.each(listofemails,self.SendEmail,function(){
        console.log(success_email);
        console.log(failure_email);
    });
}

/* 
* This function will be called by multiple instance.
* Each instance will contain one email ID
* After successfull email operation, it will be pushed in failed or success array.
*/

massMailer.prototype.SendEmail = function(Email,callback) {
    console.log("Sending email to " + Email);
    var self = this;
    self.status = false;
    // waterfall will go one after another
    // So first email will be sent
    // Callback will jump us to next function
    // in that we will update DB
    // Once done that instance is done.
    // Once every instance is done final callback will be called.
    async.waterfall([
        function(callback) {                
            var mailOptions = {
                from: userMail,     
                to: email,
                subject: subject, 
                //html: "<h1>Hello Worl</h1>d !" + ' ' + example
                html: data_html
            };
            transporter.sendMail(mailOptions, function(error, info) {               
                if(error) {
                    console.log(error)
                    failure_email.push(Email);
                } else {
                    self.status = true;
                    success_email.push(Email);
                }
                callback(null,self.status,Email);
            });
        },
        function(statusCode,Email,callback) {
                console.log("Will update DB here for " + Email + "With " + statusCode);
                callback();
        }
        ],function(){
            //When everything is done return back to caller.    
            callback();
    });
}

exports.prepare = function(req, res){
    
};

exports.send = function(req, res){
    example = req.body.publicidad.producto;
    subject = req.body.asunto;
    //email = req.body.email;
    email = 'adfitfidelizacion@gmail.com';

    data_html = req.body.template;

    new massMailer(); //lets begin
   
};