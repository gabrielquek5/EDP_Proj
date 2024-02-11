namespace WebApplication1.EmailStuff
{
    public class EMAIL_Consts
    {
        public string EMAIL_API()
        {
            string api = "";
            return api;
        }

        public string Email_Subject(string subject)
        {
            return subject;
        }

        public string AddScheduleSuccess(string firstName, string eventTitle)
        {
            var htmlBody = $"<body style='font-family: Arial, sans-serif;'>" +
                $"<div style='border: 1px solid #ccc; border-radius: 10px; padding: 10px;'>" +
                $"<h1>Dear {firstName},</h1><p>Thank you for using our website. You have successfully <p style='font-weight: bold; color: green;'>ADDED</p> an event for <h2>{eventTitle}.</h2></p>" +
                $"<p>We hope you have a pleasant time.</p><p'>Best Regards,<br/>IT2166 - EDP Team</p>" +
                $"</div>" +
                $"</body>";
            return htmlBody;
        }
        public string DeleteSheduleRequest(string firstName, string eventTitle)
        {
            var htmlBody = $"<body style='font-family: Arial, sans-serif;'>" +
                $"<div style='border: 1px solid #ccc; border-radius: 10px; padding: 10px;'>" +
                $"<h1>Dear {firstName},</h1>" +
                $"<p>Thank you for using our website. You have requested for the event of <h2>{eventTitle}</h2> to be <h2 style='color: red; font-weight: bold;'>DELETED.</h2></p>" +
                $"<p>It is now waiting for approval from an Admin.</p>" +
                $"<p>We hope you have a pleasant time.</p><p'>Best Regards,<br/>IT2166 - EDP Team</p>" +
                $"</div>" +
                $"</body>";
            return htmlBody;
        }

        public string UpdateSheduleSuccess(string firstName, string eventTitle, string changes, string beforeValues, string afterValues)
        {
            var htmlBody = $"<body style='font-family: Arial, sans-serif;'>" +
                    $"<div style='border: 1px solid #ccc; border-radius: 10px; padding: 10px;'>" +
                    $"<h1>Dear {firstName},</h1><p>Thank you for using our website. You have successfully <p style='font-weight: bold; color: orange;'>UPATED</p> the event for <h2>{eventTitle}.</h2></p>" +
                    $"<h3>Changes:</h3><pre>{changes}</pre>" +
                    $"<h3>Before:</h3><pre>{beforeValues}</pre>" +
                    $"<h3>After:</h3><pre>{afterValues}</pre>" +
                    $"<p>We hope you have a pleasant time.</p><p'>Best Regards,<br/>IT2166 - EDP Team</p>" +
                    $"</div>" +
                    $"</body>";
            return htmlBody;
        }

        public string DeleteSheduleRequestApproved(string firstName, string eventTitle)
        {
            var htmlBody = $"<body style='font-family: Arial, sans-serif;'>" +
                $"<div style='border: 1px solid #ccc; border-radius: 10px; padding: 10px;'>" +
                $"<h1>Dear {firstName},</h1>" +
                $"<p>Thank you for using our website. The deletion request for event <h2>{eventTitle}</h2> has been <h2 style='color: green; font-weight: bold;'>APPROVED.</h2></p>" +
                $"<p>We hope you have a pleasant time.</p><p'>Best Regards,<br/>IT2166 - EDP Team</p>" +
                $"</div>" +
                $"</body>";
            return htmlBody;
        }

        public string DeleteSheduleRequestRejected(string firstName, string eventTitle)
        {
            var htmlBody = $"<body style='font-family: Arial, sans-serif;'>" +
                $"<div style='border: 1px solid #ccc; border-radius: 10px; padding: 10px;'>" +
                $"<h1>Dear {firstName},</h1>" +
                $"<p>Thank you for using our website. The deletion request for event <h2>{eventTitle}</h2> has been <h2 style='color: red; font-weight: bold;'>REJECTED.</h2></p>" +
                $"<p>We hope you have a pleasant time.</p><p'>Best Regards,<br/>IT2166 - EDP Team</p>" +
                $"</div>" +
                $"</body>";
            return htmlBody;
        }

        public string EventEnded(string firstName, string eventTitle)
        {
            var htmlBody = $"<body style='font-family: Arial, sans-serif;'>" +
                $"<div style='border: 1px solid #ccc; border-radius: 10px; padding: 10px;'>" +
                $"<h1>Dear {firstName},</h1>" +
                $"<p>Thank you for using our website. The event <h2>{eventTitle}</h2> has <h2 style='color: green; font-weight: bold;'>ENDED.</h2></p>" +
                $"<p>We hope you have a pleasant time.</p><p'>Best Regards,<br/>IT2166 - EDP Team</p>" +
                $"</div>" +
                $"</body>";
            return htmlBody;
        }
    }
}
