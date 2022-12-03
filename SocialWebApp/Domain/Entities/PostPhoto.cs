namespace Domain.Entities;

public class PostPhoto
{
    public int Id { get; set; }
    public string Photo { get; set; }
        
    public int PostId { get; set; }
    public Post Post { get; set; }
}