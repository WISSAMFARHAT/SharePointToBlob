using Connection;
using Connection.Model;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DotCompoments.Compoments;
public partial class Index
{
    [Parameter] public SiteModel? Site { get; set; }
    public List<ItemModel>? Items { get; set; }

    public bool Loading { get; set; } = false;
    public bool Overwrite { get; set; } = false;
    public int TotalFile { get; set; } = 0;
    public int FileCount { get; set; } = 0;
    public int Percentage { get; set; } = 0;

    public string Url { get; set; } = $"";
    protected override async Task OnInitializedAsync()
    {

        if (!string.IsNullOrEmpty(Site.Name))
            Url = $"/{Site.Name}";

        if (string.IsNullOrEmpty(Site.ID) && string.IsNullOrEmpty(Site.ListID) && string.IsNullOrEmpty(Site.FolderID))
            Items = await _sharePointGraph.GetAllSides();

        else if (string.IsNullOrEmpty(Site.ListID) && string.IsNullOrEmpty(Site.FolderID))
        {
            Items = await _sharePointGraph.GetAllListSide(Site.ID);
            Url += $"/{Site.ID}";
        }
        else if (string.IsNullOrEmpty(Site.FolderID))
        {
            Items = await _sharePointGraph.GetAllFolderList(Site.ID, Site.ListID);
            Url += $"/{Site.ID}/{Site.ListID}";
        }
        else
        {
            Items = await _sharePointGraph.GetAllItemsFolder(Site.ID, Site.ListID, Site.FolderID);
            Url += $"/{Site.ID}/{Site.ListID}";
        }
    }


    public void Close()
    {
        Loading = false;
        this.StateHasChanged();
    }

    public async Task Archive()
    {

        try
        {
            List<ItemModel> allfiles = new()
                {
                    new ItemModel
                    {
                        FolderID = Site.FolderID,
                        Name = Site.Name,
                    }
                };

            Loading = true;
            this.StateHasChanged();

            allfiles.AddRange(await _sharePointGraph.GetAll(Site.Name.Replace("|", "/"), Site.ID, Site.ListID, Site.FolderID));
            allfiles.Reverse();

            List<Task> tasks = new();
            int parallelTasksCount = 0;
            int maxParallelTasks = 20;

            TotalFile = allfiles.Count;
            this.StateHasChanged();

            foreach (ItemModel file in allfiles)
            {
                if (parallelTasksCount >= maxParallelTasks)
                    await Task.WhenAny(tasks);

                parallelTasksCount++;

                tasks.Add(Task.Factory.StartNew(async () =>
                {
                    await _sharePointGraph.SaveDelete(Site.ID, Site.ListID, file, Overwrite);
                    parallelTasksCount--;

                    FileCount++;
                    Percentage = (100 * FileCount) / TotalFile;

                    await InvokeAsync(() => this.StateHasChanged());
                }));
            }

            await Task.WhenAll(tasks.ToArray());

            List<ItemModel> folders = allfiles.Where(x => !string.IsNullOrEmpty(x.FolderID)).ToList();

            while (folders.Any(key => !key.IsDeleted))
                foreach (ItemModel file in folders.Where(key => !key.IsDeleted))
                    file.IsDeleted = await _sharePointGraph.DeleteSubFolderEmpty(Site.ID, Site.ListID, file.FolderID);

            Loading = false;
            this.StateHasChanged();

            await JS.InvokeVoidAsync("Return");

        }
        catch (Exception e)
        {
            await JS.InvokeAsync<object>("Refresh");
        }

    }
}
