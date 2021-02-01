namespace stockapi.Helpers
{
    public class AppSettings
    {
        public string Secret { get; set; }

        // refresh token time to live (in days), inactive tokens are
        // automatically deleted from the database after this time
        public int RefreshTokenTTL { get; set; }
        public string EmailFrom { get; set; }
        public string NameFrom { get; set; }
        public string SmtpHost { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUser { get; set; }
        public string SmtpPass { get; set; }
        public string YooMoneyShopId { get; set; }
        public string YooMoneySecretKey { get; set; }
        public string RobokassaShopName { get; set; }
        public string RobokassaFirstPassw { get; set; }
        public string RobokassaSecondPassw { get; set; }
        public string CloudinaryCloudName { get; set; }
        public string CloudinaryApiKey { get; set; }
        public string CloudinaryApiSecret { get; set; }
    }
}
