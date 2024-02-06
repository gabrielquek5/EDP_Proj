using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;
using WebApplication1.EmailStuff;

namespace WebApplication1
{
    public class EmailService
    {
        private readonly string _sendGridApiKey;

        public EmailService(string sendGridApiKey)
        {
            _sendGridApiKey = sendGridApiKey;
        }

        public async Task SendEventAddedEmail(string toEmail, string firstName, string eventTitle)
        {
            var client = new SendGridClient(_sendGridApiKey);
            var _htmlConsts = new EMAIL_Consts();
            var subject = _htmlConsts.Email_Subject("Event Added Successfully!");
            var htmlBody = _htmlConsts.AddScheduleSuccess(firstName, eventTitle);
            var from = new EmailAddress("khai@8mpty.com", "IT2166 - EDP Team");
            var to = new EmailAddress(toEmail);

            var message = MailHelper.CreateSingleEmail(from, to, subject, htmlBody, htmlBody);
            await client.SendEmailAsync(message);
        }

        public async Task SendEventRequestDeleteEmail(string toEmail, string firstName, string eventTitle)
        {
            var client = new SendGridClient(_sendGridApiKey);
            var _htmlConsts = new EMAIL_Consts();
            var subject = _htmlConsts.Email_Subject("Event Deletion Requested!");
            var htmlBody = _htmlConsts.DeleteSheduleRequest(firstName, eventTitle);
            var from = new EmailAddress("khai@8mpty.com", "IT2166 - EDP Team");
            var to = new EmailAddress(toEmail);

            var message = MailHelper.CreateSingleEmail(from, to, subject, htmlBody, htmlBody);
            await client.SendEmailAsync(message);
        }

        public async Task SendScheduleUpdateEmail(string toEmail, string firstName, string eventTitle, string changes, string beforeValues, string afterValues)
        {
            var client = new SendGridClient(_sendGridApiKey);
            var _htmlConsts = new EMAIL_Consts();
            var subject = _htmlConsts.Email_Subject("Event Updated!");
            var htmlBody = _htmlConsts.UpdateSheduleSuccess(firstName, eventTitle,changes, beforeValues,afterValues);
            var from = new EmailAddress("khai@8mpty.com", "IT2166 - EDP Team");
            var to = new EmailAddress(toEmail);

            var message = MailHelper.CreateSingleEmail(from, to, subject, htmlBody, htmlBody);
            await client.SendEmailAsync(message);
        }

        public async Task SendEventDeleteApprovedEmail(string toEmail, string firstName, string eventTitle)
        {
            var client = new SendGridClient(_sendGridApiKey);
            var _htmlConsts = new EMAIL_Consts();
            var subject = _htmlConsts.Email_Subject("Event Deletion Approved!");
            var htmlBody = _htmlConsts.DeleteSheduleRequestApproved(firstName, eventTitle);
            var from = new EmailAddress("khai@8mpty.com", "IT2166 - EDP Team");
            var to = new EmailAddress(toEmail);

            var message = MailHelper.CreateSingleEmail(from, to, subject, htmlBody, htmlBody);
            await client.SendEmailAsync(message);
        }

        public async Task SendEventDeleteRejectedEmail(string toEmail, string firstName, string eventTitle)
        {
            var client = new SendGridClient(_sendGridApiKey);
            var _htmlConsts = new EMAIL_Consts();
            var subject = _htmlConsts.Email_Subject("Event Deletion Rejected!");
            var htmlBody = _htmlConsts.DeleteSheduleRequestRejected(firstName, eventTitle);
            var from = new EmailAddress("khai@8mpty.com", "IT2166 - EDP Team");
            var to = new EmailAddress(toEmail);

            var message = MailHelper.CreateSingleEmail(from, to, subject, htmlBody, htmlBody);
            await client.SendEmailAsync(message);
        }

        public async Task SendEventEndedEmail(string toEmail, string firstName, string eventTitle)
        {
            var client = new SendGridClient(_sendGridApiKey);
            var _htmlConsts = new EMAIL_Consts();
            var subject = _htmlConsts.Email_Subject("Event Ended!");
            var htmlBody = _htmlConsts.EventEnded(firstName, eventTitle);
            var from = new EmailAddress("khai@8mpty.com", "IT2166 - EDP Team");
            var to = new EmailAddress(toEmail);

            var message = MailHelper.CreateSingleEmail(from, to, subject, htmlBody, htmlBody);
            await client.SendEmailAsync(message);
        }
    }
}
