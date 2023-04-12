using Connection.Model;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace DotCompoments.Compoments;

public partial class Index
{
    [Parameter] public SiteModel? Site { get; set; }
    public List<ItemModel>? Items { get; set; }
    public List<ItemModel>? TempItems { get; set; }
    public bool Loading { get; set; } = false;
    public bool Overwrite { get; set; } = false;
    public string FileExisting { get; set; } = FileExistingModel.Override.ToString();
    public int TotalFile { get; set; } = 0;
    public string? DisplayTotalSize { get; set; }
    public string ProgressTitle => Finalizing ? "Finalizing" : (TotalFile == 0 ? "Gathering files" : $"{FileCount}/{TotalFile} ({TransferTasks.Count(key => !key.IsCompleted)} running tasks)");
    public bool Finalizing { get; set; } = false;
    public bool ShowError { get; set; } = false;
    public long? TotalSize { get; set; } = 0;
    public int FileCount { get; set; } = 0;
    public int Percentage { get; set; } = 0;
    public List<string> TransferFailedFiles { get; set; } = new();
    public string Url { get; set; } = $"";
    public string? ErrorDescription { get; set; }
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

        if (Items == null)
        {
            await JS.InvokeVoidAsync("Return");
            return;
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

        StateHasChanged();
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
                    new ItemModel
                    {
                        FolderID = Site.FolderID,
                        Name = Site.Name,
                    }
                };

            Loading = true;
            StateHasChanged();

            allfiles.AddRange(await _sharePointGraph.GetAll(Site.Name.Replace("|", "/"), Site.ID, Site.ListID, Site.FolderID));
            allfiles.Reverse();

            TransferTasks = new();
            TransferFailedFiles = new();
            Finalizing = false;
            FileCount = 0;
            Percentage = 0;
            int maxParallelTasks = 5;

            TotalFile = allfiles.Count;
            StateHasChanged();

            foreach (ItemModel file in allfiles)
            {
                TransferTasks.Add(Task.Run(async () =>
                {
                    ResultModel transfered = await _sharePointGraph.SaveDelete(Site.ID, Site.ListID, file, FileExisting);

                    if (!transfered.Success)
                        TransferFailedFiles.Add($"{file.Name} [{file.DisplaySize}] | {transfered.Error} [{transfered.Status}]");

                    Percentage = 100 * FileCount++ / TotalFile;

                    await InvokeAsync(() => StateHasChanged());
                }));

                if (TransferTasks.Count > maxParallelTasks)
                {
                    TransferTasks.Remove(await Task.WhenAny(TransferTasks));

                    if (TransferTasks.Any(key => key.IsCompleted))
                        TransferTasks.RemoveAll(key => key.IsCompleted);
                }

                StateHasChanged();
            }

            while (FileCount < TotalFile)
                await Task.Delay(TimeSpan.FromSeconds(1));

            await Task.WhenAll(TransferTasks);

            ShowError = TransferFailedFiles.Any();
            Finalizing = true;

            StateHasChanged();

            List<ItemModel> folders = allfiles.Where(x => !string.IsNullOrEmpty(x.FolderID)).ToList();

            int deleteTryCount = 3;
            while (folders.Any(key => !key.IsDeleted) && deleteTryCount >= 0)
            {
                deleteTryCount--;

                foreach (ItemModel file in folders.Where(key => !key.IsDeleted))
                    try { file.IsDeleted = await _sharePointGraph.DeleteSubFolderEmpty(Site.ID, Site.ListID, file.FolderID); }
                    catch { }
            }

            Loading = false;
            StateHasChanged();

            await JS.InvokeVoidAsync("Return");
        }
        catch (Exception ex)
        {
            ErrorDescription = ex.Message;
            //await JS.InvokeAsync<object>("Refresh");
        }
    }
}
