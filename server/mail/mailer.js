var sg = require('sendgrid').SendGrid('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')

exports.send = function(req, res, callback){
  var helper = require('sendgrid').mail
  from_email = new helper.Email("fidelizados2017@gmail.com")
  to_email = new helper.Email("fidelizados2017@gmail.com")
  subject = req.body.asunto + ' ('+ req.body.email +')'
  content = new helper.Content("text/html", req.body.template)
  mail = new helper.Mail(from_email, subject, to_email, content)

  var requestBody = mail.toJSON()
  var request = sg.emptyRequest()
  request.method = 'POST'
  request.path = '/v3/mail/send'
  request.body = requestBody
  sg.API(request, function (response) {
    callback(response);
  })

};

