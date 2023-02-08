using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using AngryMonkey.Core.Web;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

public partial class CorePage
{
	public bool HasEditor { get; set; } = false;
	private bool SEOIndex { get; set; } = true;
	private bool SEOFollow { get; set; } = true;

	public string RobotsMetadata
	{
		get
		{
			List<string> content = new();

			if (!SEOIndex)
				content.Add("noindex");

			if (!SEOFollow)
				content.Add("nofollow");

			if (content.Any())
				return string.Join(", ", content);

			return null;
		}
	}

	public CorePage SetIndexing(bool index)
	{
		SEOIndex = index;

		return this;
	}

	public CorePage SetFollowing(bool follow)
	{
		SEOFollow = follow;

		return this;
	}

	#region Title

	private CorePageTitle _title { get; set; }

	public CorePage SetTitle(string title)
	{
		return SetTitle(title, null);
	}

	public CorePage SetTitle(string title, string[] addOns)
	{
		_title = new CorePageTitle() { Value = title, AddOns = addOns };
		UpdateCorePage();

		return this;
	}

	public CorePage SetTitle(CorePageTitle title)
	{
		_title = title;
		UpdateCorePage();

		return this;
	}

	public string Title
	{
		get
		{
			StringBuilder builder = new(WebCoreConfig.Current.Head.DefaultTitle);

			if (_title == null)
				_title = new CorePageTitle();

			if (!string.IsNullOrEmpty(_title.Value))
				builder = new StringBuilder($"{WebCoreConfig.Current.Head.TitlePrefix}{_title.Value}{WebCoreConfig.Current.Head.TitleSuffix}");

			List<string> addOns = new();

			if (_title.AddOns?.Count() > 0)
				addOns.AddRange(_title.AddOns);

			if (WebCoreConfig.Current.Head.TitleAddOns?.Count() > 0)
				addOns.AddRange(WebCoreConfig.Current.Head.TitleAddOns);

			if (addOns.Count() > 0)
				foreach (string addText in addOns)
					if (builder.Length + addText.Length + 1 <= 64)
						builder.Append($"{addText}");

			return builder.ToString();
		}
	}

	#endregion

	#region Decription

	private string _description { get; set; }

	public string Description
	{
		get
		{
			if (_description != null && _description.Length > 160)
				_description = $"{_description.Substring(0, 157)}...";

			return _description;
		}
	}

	public CorePage SetDescription(string description)
	{
		_description = description;
		UpdateCorePage();

		return this;
	}

	#endregion

	#region Keywords

	public string[] Keywords { get; private set; }

	public CorePage SetKeywords(string[] keywords)
	{
		Keywords = keywords;
		UpdateCorePage();

		return this;
	}

	public CorePage SetKeywords(string keywords)
	{
		return SetKeywords(keywords.Replace(", ", ",").Split(','));
	}

	#endregion

	#region Bundles

	private string[] _bundles { get; set; } = new string[0];

	public string[] Styles
	{
		get
		{
			return FilterBundles("css");
		}
	}

	public string[] Scripts
	{
		get
		{
			return FilterBundles("js");
		}
	}

	private string[] FilterBundles(string extention)
	{
		return _bundles.Where(path => path.EndsWith($".{extention}", StringComparison.OrdinalIgnoreCase))
				.Select(path => path.StartsWith("http", StringComparison.OrdinalIgnoreCase)
							? path
							: $"/{path.TrimStart('/').Replace($".{extention}", string.Empty, StringComparison.OrdinalIgnoreCase)}")
				.ToArray();
	}

	private CorePage Bundle(string path, int index)
	{
		List<string> styles = new(_bundles);

		if (index >= styles.Count)
			index = styles.Count;

		styles.Insert(index, path);

		_bundles = styles.ToArray();

		UpdateCorePage();

		return this;
	}

	public CorePage Bundle(string path)
	{
		return Bundle(path, int.MaxValue);
	}

	public CorePage Bundle(params string[] paths)
	{
		foreach (string stylePath in paths)
			Bundle(stylePath);

		return this;
	}

	#endregion

	#region Html

	public string[] HeadHtml { get; set; }

	public CorePage AppendHeadHtml(params string[] htmlArray)
	{
		HeadHtml = AppendHtml(HeadHtml, htmlArray);

		return UpdateCorePage();
	}

	#endregion
}