namespace Application.Users.Queries.SearchFriends;

public class SearchFriendsListDto
{
    public List<SearchFriendDto> Friends { get; set; }
    public int TotalCount { get; set; }
    public bool HasNextPage { get; set; }
}

public class SearchFriendDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Username { get; set; }
    public string Avatar { get; set; }
}