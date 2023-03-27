using Connection;
using Connection.Model;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using System.Drawing;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DotCompoments.Compoments;
public partial class Index
{
    [Parameter] public SiteModel? Site { get; set; }
    public List<ItemModel>? Items { get; set; }
    public List<ItemModel>? TempItems { get; set; }
    public bool Loading { get; set; } = false;
    public bool Overwrite { get; set; } = false;
    public int TotalFile { get; set; } = 0;
    public string? DisplayTotalSize { get; set; }
    public string ProgressTitle => Finalizing ? "Finalizing" : (TotalFile == 0 ? "Gathering files" : $"{FileCount}/{TotalFile} ({TransferTasks.Count} running tasks)");
    public bool Finalizing { get; set; } = false;
    public long? TotalSize { get; set; } = 0;
    public int FileCount { get; set; } = 0;
    public int Percentage { get; set; } = 0;
    public List<string> TransferFailedFiles { get; set; } = new();
    public string Url { get; set; } = $"";
    public string ErrorDescription { get; set; }
    private List<Task> TransferTasks { get; set; } = new();

    protected override async Task OnInitializedAsync()
    {

        if (!string.IsNullOrEmpty(Site.Name))
            Url = $"/{Site.Name}";

        if (string.IsNullOrEmpty(Site.ID) && string.IsNullOrEmpty(Site.ListID) && string.IsNullOrEmpty(Site.FolderID))
            Items = await _sharePointGraph.Fetch();

        else if (string.IsNullOrEmpty(Site.ListID) && string.IsNullOrEmpty(Site.FolderID))
        {
            Items = await _sharePointGraph.Fetch(Site.ID);
            Url += $"/{Site.ID}";
        }
        else if (string.IsNullOrEmpty(Site.FolderID))
        {
            Items = await _sharePointGraph.GetAllFolder(Site.ID, Site.ListID);
            Url += $"/{Site.ID}/{Site.ListID}";
        }
        else
        {
            Items = await _sharePointGraph.GetAllFolder(Site.ID, Site.ListID, Site.FolderID);
            Url += $"/{Site.ID}/{Site.ListID}";
        }

        TempItems = Items;

        TotalSize = Items.Sum(x => x.Size);

        if (TotalSize == 0)
            DisplayTotalSize = "0 KB";
        else if (TotalSize < 1024 * 1024)
            DisplayTotalSize = $"({(TotalSize / 1024.0)?.ToString("0.00")}) KB";
        else if (TotalSize < 1024 * 1024 * 1024)
            DisplayTotalSize = $"({(TotalSize / ((1024.0 * 1024.0)))?.ToString("0.00")}) MB";
        else
            DisplayTotalSize = $"({(TotalSize / ((1024.0 * 1024.0 * 1024.0)))?.ToString("0.00")}) GB";

        this.StateHasChanged();
    }
    public async Task Search(ChangeEventArgs e)
    {
        TempItems = Items.Where(x => x.Name.ToLower().StartsWith(e.Value.ToString().ToLower())).ToList();
        this.StateHasChanged();
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
                    //new ItemModel
                    //{
                    //    FolderID = Site.FolderID,
                    //    Name = Site.Name,
                    //}
                };

            Loading = true;
            this.StateHasChanged();

            allfiles.AddRange(await _sharePointGraph.GetAll(Site.Name.Replace("|", "/"), Site.ID, Site.ListID, Site.FolderID));
            allfiles.Reverse();

            TransferTasks = new();
            TransferFailedFiles = new();
            Finalizing = false;
            FileCount = 0;
            Percentage = 0;
            int maxParallelTasks = 6;

            TotalFile = allfiles.Count;
            StateHasChanged();

            foreach (ItemModel file in allfiles)
            {
                while (TransferTasks.Count >= maxParallelTasks)
                {
                    await Task.WhenAny(TransferTasks);
                    TransferTasks.RemoveAll(task => task.IsCompleted);
                }

                TransferTasks.Add(Task.Factory.StartNew(async () =>
                {
                    bool transfered = await _sharePointGraph.SaveDelete(Site.ID, Site.ListID, file, Overwrite);

                    if (!transfered)
                        TransferFailedFiles.Add($"{file.Name} [{file.DisplaySize}]");

                    Percentage = 100 * FileCount++ / TotalFile;

                    await InvokeAsync(() => StateHasChanged());
                }));

                StateHasChanged();
            }

            while (FileCount < TotalFile)
                await Task.Delay(TimeSpan.FromSeconds(1));

            await Task.WhenAll(TransferTasks);

            Finalizing = true;

            StateHasChanged();

            List<ItemModel> folders = allfiles.Where(x => !string.IsNullOrEmpty(x.FolderID)).ToList();

            while (folders.Any(key => !key.IsDeleted))
                foreach (ItemModel file in folders.Where(key => !key.IsDeleted))
                    file.IsDeleted = await _sharePointGraph.DeleteSubFolderEmpty(Site.ID, Site.ListID, file.FolderID);

            Loading = false;
            this.StateHasChanged();

            await JS.InvokeVoidAsync("Return");

        }
        catch (Exception ex)
        {
            ErrorDescription = ex.Message;
            //await JS.InvokeAsync<object>("Refresh");
        }

    }
}
