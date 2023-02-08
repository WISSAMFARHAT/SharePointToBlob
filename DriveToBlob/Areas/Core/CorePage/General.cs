using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using AngryMonkey.Core.Web;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

public partial class CorePage
{
	private readonly Microsoft.AspNetCore.Mvc.Controller _controller;
	public CorePage(Microsoft.AspNetCore.Mvc.Controller controller)
	{
		_controller = controller;

		controller.ViewData.Add("CorePageStatic", this);
	}

	public static CorePage Current(Microsoft.AspNetCore.Mvc.Controller controller)
	{
		return (CorePage)controller.ViewData["CorePageStatic"];
	}

	public static CorePage Current(ViewDataDictionary viewData)
	{
		return (CorePage)viewData["CorePageStatic"];
	}

	public string GoogleAnalyticsId { get; private set; }

	private CorePage UpdateCorePage()
	{
		_controller.ViewData["CorePageStatic"] = this;

		CorePage corePage = (CorePage)_controller.ViewData["CorePageStatic"];

		_controller.ViewData["CorePage"] = corePage;

		return this;
	}

	public CorePage SetGoogleAnalytics(string id)
	{
		GoogleAnalyticsId = id;
		UpdateCorePage();

		return this;
	}

	private string GetFullUrl(string url)
	{
		if (string.IsNullOrEmpty(url) || _controller.Url.IsLocalUrl(url))
			return $"{_controller.Request.Scheme}://{_controller.Request.Host}/{url.TrimStart('/') ?? string.Empty}";

		return url;
	}

	#region Header

	public string[] HeaderHtml { get; set; }

	public CorePage AppendHeaderHtml(params string[] htmlArray)
	{
		HeaderHtml = AppendHtml(HeaderHtml, htmlArray);

		return UpdateCorePage();
	}

	#endregion

	#region Footer

	public string[] FooterHtml { get; set; }

	public CorePage AppendFooterHtml(params string[] htmlArray)
	{
		FooterHtml = AppendHtml(FooterHtml, htmlArray);

		return UpdateCorePage();
	}

	#endregion

	#region Sidemenu

	public string[] SidemenuHtml { get; set; }

	public CorePage AppendSidemenuHtml(params string[] htmlArray)
	{
		SidemenuHtml = AppendHtml(SidemenuHtml, htmlArray);

		return UpdateCorePage();
	}

	#endregion

	private string[] AppendHtml(string[] property, params string[] htmlArray)
	{
		if (htmlArray.Count() == 1)
		{
			string html = htmlArray[0];

			return property != null ? new List<string>(property) { html }.ToArray() : new string[] { html };
		}
		else foreach (string html in htmlArray)
				property = AppendHtml(property, html);

		return property;
	}
}