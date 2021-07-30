namespace PublicationActivity
{
    public static class EmailMessages
    {
        public static readonly string AccountCreatedSubject = "Нов профил";
        public static readonly string AccountCreatedContent = @"Здравейте,
Създаден Ви е нов профил в PublicationActivity с временна парола - <b>{0}</b>
Можете да промените своята парола от <a href='{1}'>ТУК</a>";

        public static readonly string ResetPasswordSubject = "Промяна на парола";
        public static readonly string ResetPasswordContent = @"Здравейте,
Моля променете Вашата парола от <a href='{0}'>ТУК</a>";
    }
}
