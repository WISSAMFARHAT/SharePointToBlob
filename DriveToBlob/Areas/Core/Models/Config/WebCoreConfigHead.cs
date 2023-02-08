
namespace AngryMonkey.Core
{
    public partial class WebCoreConfigHead
    {
        public string DefaultTitle { get; set; }

        public string TitlePrefix { get; set; }

        public string TitleSuffix { get; set; }

        public string[] TitleAddOns { get; set; }

        public string[] Bundles;

        public string[] Html;

        public bool SEOIndex { get; set; } = true;

        public bool SEOFollow { get; set; } = true;
    }
}