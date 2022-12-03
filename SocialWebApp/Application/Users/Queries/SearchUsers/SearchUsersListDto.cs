using Application.Common.Models;

namespace Application.Users.Queries.SearchUsers;

public class SearchUsersListDto
{
    public List<SearchUserDto> Users { get; set; }
    public int TotalCount { get; set; }
    public bool HasNextPage { get; set; }
}

public class SearchUserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public string Avatar { get; set; }
    public RelationshipType Relationship { get; set; }
}