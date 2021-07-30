using Newtonsoft.Json;

namespace PublicationActivity.Models
{
    public class ExceptionDetails
    {
        public int StatusCode { get; set; }

        public string ExceptionType { get; set; }

        public string Description { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
