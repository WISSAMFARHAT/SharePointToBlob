namespace Connection.Model;

public class ResultModel
{
    public bool Success { get; set; }

    public string? Error { get; set; }

    public StatusModel? Status { get; set; }
   
}


public enum StatusModel
{
    Succeed,
    Failed,
    Skip
}