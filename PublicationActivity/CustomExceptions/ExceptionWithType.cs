using System;

namespace PublicationActivity.CustomExceptions
{
    public class ExceptionWithType : Exception
    {
        public ExceptionWithType()
            : base()
        {
            this.Type = ExceptionType.Unknown;
        }

        public ExceptionWithType(string type)
            : base(type)
        {
            this.Type = type;
        }

        public ExceptionWithType(string type, string message)
            : base(message)
        {
            this.Type = type;
        }

        public string Type { get; set; }
    }
}
