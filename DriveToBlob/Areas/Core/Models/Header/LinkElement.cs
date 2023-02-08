using System.Text;

namespace AngryMonkey.Core.Web
{
    public class LinkElement
    {
        public string Title { get; set; }
        public string Url { get; set; }
        public string Value { get; set; }
        public string Visibility { get; set; } = "stack-shy";
        public bool IsSelected { get; set; } = false;

        public string Classes
        {
            get
            {
                return Visibility;
            }
        }
    }
}