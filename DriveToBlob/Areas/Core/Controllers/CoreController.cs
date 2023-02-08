using AngryMonkey.Core;
using AngryMonkey.Core.Web;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;

public class CoreController : Controller
{
	internal string GetFullUrl(string url)
	{
		if (string.IsNullOrEmpty(url) || Url.IsLocalUrl(url))
			return $"{this.Request.Scheme}://{this.Request.Host}/{url.TrimStart('/') ?? string.Empty}";

		return url;
	}

	internal CorePage CorePage(string pageTitle)
	{
		CorePage corePage = new CorePage(this)
				.SetGoogleAnalytics(WebCoreConfig.Current.GoogleAnalytics?.ID)
				.Bundle("/css/core/core.css", "/js/core/core.js")
				.SetTitle(pageTitle);

		// Identity

		if (CoreConfig.Current.Security.SignInAvailable)
		{
			corePage.Bundle("css/core/identity.css");
			corePage.Bundle("js/core/identity.js");
		}

		// -----------------------------

		// Bundles

		if (WebCoreConfig.Current.Head?.Bundles != null)
			corePage.Bundle(WebCoreConfig.Current.Head.Bundles);

		#region Html

		if (WebCoreConfig.Current.Head?.Html != null)
			corePage.AppendHeadHtml(WebCoreConfig.Current.Head.Html);

		if (WebCoreConfig.Current.Sidemnu?.Html != null)
			corePage.AppendSidemenuHtml(WebCoreConfig.Current.Sidemnu.Html);

		if (WebCoreConfig.Current.Header?.Html != null)
			corePage.AppendHeaderHtml(WebCoreConfig.Current.Header.Html);

		if (WebCoreConfig.Current.Footer?.Html != null)
			corePage.AppendFooterHtml(WebCoreConfig.Current.Footer.Html);

		#endregion

		#region SEO Index + Follow

		corePage.SetIndexing(WebCoreConfig.Current.Head.SEOIndex);
		corePage.SetFollowing(WebCoreConfig.Current.Head.SEOFollow);

		string host = Request.Host.Host.ToLower();

		string[] robotsBlockUrls = new string[]
		{
			"azurewebsites.net"
		};

		if (robotsBlockUrls.Any(key => host.EndsWith(key)))
		{
			corePage.SetIndexing(false);
			corePage.SetFollowing(false);
		}

		#endregion

		return corePage;
	}

	private static LinkElement Parse(AngryMonkey.Core.WebCoreConfigLink link, string rawUrl)
	{
		LinkElement linkElement = new()
		{
			Title = link.Title,
			Url = $"/{link.Url.TrimStart('/')}",
			Value = link.Value,
			Visibility = link.Visibility,
			IsSelected = link.Url.Equals(rawUrl, StringComparison.OrdinalIgnoreCase)
		};

		if (linkElement.IsSelected)
			linkElement.Url = null;

		return linkElement;
	}

	private static LinkElement[] GetLinks(AngryMonkey.Core.WebCoreConfigLink[] links, string rawUrl)
	{
		if (links.Count() == 0)
			return new LinkElement[0];

		return links.Select(key => Parse(key, rawUrl))
					 .ToArray();

	}

	#region Identity

	internal Guid? GetUserId()
	{
		if (!User.Identity.IsAuthenticated)
			return default;

		var identity = User.Identity as ClaimsIdentity;

		return new Guid(identity.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/identity/claims/objectidentifier").Value);
	}

	internal Guid? GetTenantId()
	{
		if (!User.Identity.IsAuthenticated)
			return default;

		var identity = User.Identity as ClaimsIdentity;

		string tenantIdString = identity.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/identity/claims/tenantid")?.Value;
		Guid tenantId = Guid.Empty;

		if (!string.IsNullOrEmpty(tenantIdString))
			tenantId = new Guid(tenantIdString);

		if (tenantId == Guid.Empty || tenantId.Equals(new Guid("9188040d-6c67-4c5b-b112-36a304b66dad")))
			return default;

		return tenantId;
	}

	#endregion
}
