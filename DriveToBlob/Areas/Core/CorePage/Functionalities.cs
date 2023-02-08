using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using AngryMonkey.Core.Web;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

public partial class CorePage
{
    public CorePage AppendDateTimeFunctionality()
    {
        Bundle("css/core/datetimepicker.css", 1);
        Bundle("js/core/datetimepicker.js", 1);

        return this;
    }

    public CorePage AppendCarouselFunctionality()
    {
        Bundle("css/core/carousel.css", 1);
        Bundle("js/core/carousel.js", 1);

        return this;
    }

    public CorePage AppendMappingFunctionality()
    {
        Bundle("https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css");
        Bundle("https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js");

        return this;
    }
    public CorePage AppendEditorFunctionality()
    {
        this.HasEditor = true;

        return this;
    }
}