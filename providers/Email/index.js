const sendgrid = require('@sendgrid/mail');
const defaults = require('defaults');

class Email {
  constructor(config) {
    this._config = config;
    sendgrid.setApiKey(config.apiKey);
    sendgrid.setSubstitutionWrappers('{{', '}}');
    this.sendgrid = sendgrid;
  }

  _send({
    to,
    from,
    subject,
    html,
    attachments = [],
    templateId,
    substitutions,
    dynamic_template_data = {},
  }) {
    if (templateId) {
      dynamic_template_data.subject = subject; // fix sendgrid transactional email
      return this.sendgrid.send({
        to, from, subject, attachments, templateId, substitutions, dynamic_template_data,
      });
    }
    return this.sendgrid.send({
      to, from, subject, html, attachments,
    });
  }

  send(options) {
    options = defaults(options, this._config);
    return this._send(options);
  }
}

module.exports = Email;
