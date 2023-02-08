using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;
using System.Linq;

public static class AngryMonkeyHtmlHelpers
{
    //public static void BundleScript(this IHtmlHelper html, string script)
    //{
    //    List<string> scripts = (List<string>)html.ViewData["PageScripts"];

    //    if (scripts == null)
    //        scripts = new List<string>();

    //    scripts.Add(script.Replace(".js", string.Empty, System.StringComparison.OrdinalIgnoreCase));
    //    html.ViewData["PageScripts"] = scripts;
    //}

    //public static void BundleStyle(this IHtmlHelper html, string style)
    //{
    //    List<string> styles = (List<string>)html.ViewData["PageStyles"];

    //    if (styles == null)
    //        styles = new List<string>();

    //    styles.Add(style.Replace(".css", string.Empty, System.StringComparison.OrdinalIgnoreCase));
    //    html.ViewData["PageStyles"] = styles;
    //}

    public static void Bundle(this IHtmlHelper html, string file)
    {
        CorePage.Current(html.ViewData).Bundle(file);
    }
}