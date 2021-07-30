namespace PublicationActivity.Data.Models
{
    public class ContributorPublication
    {
        public int ContributorId { get; set; }
        
        public int PublicationId { get; set; }

        public int Order { get; set; }

        public Contributor Contributor { get; set; }
        
        public Publication Publication { get; set; }
    }
}
