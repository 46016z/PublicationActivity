namespace PublicationActivity.Models.Publication
{
    public class ContributorDto
    {
        public int Order { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public bool IsStudentOrDoctorant { get; set; }
    }
}
