namespace IEvangelist.VideoChat.Options
{
    public class TwilioSettings
    {
        /// <summary>
        /// The primary Twilio account SID, displayed prominently on your twilio.com/console dashboard.
        /// </summary>
        public string AccountSid { get; set; }
        
        /// <summary>
        /// The auth token for your primary Twilio account, hidden on your twilio.com/console dashboard.
        /// </summary>
        public string AuthToken { get; set; }

        /// <summary>
        /// Signing Key SID, also known as the API SID or API Key.
        /// </summary>
        public string ApiKey { get; set; }

        /// <summary>
        /// The API Secret that corresponds to the <see cref="ApiKey"/>.
        /// </summary>
        public string ApiSecret { get; set; }
    }
}