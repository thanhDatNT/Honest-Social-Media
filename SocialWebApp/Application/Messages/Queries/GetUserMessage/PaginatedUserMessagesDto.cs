namespace Application.Messages.Queries.GetUserMessage;

public class PaginatedUserMessagesDto
{
    public List<UserMessageDto> Items { get; set; }
    public int TotalCount { get; set; }
    public bool HasNextPage { get; set; }
}