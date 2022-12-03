namespace Application.Posts.Queries;

public class PaginatedPostDto
{
    public List<PostDto> Items { get; set; }
    public int TotalCount { get; set; }
    public bool HasNextPage { get; set; }
}