namespace Model
{
    public record Post

    {
        public Post(string id, string title, DateTime publishedAt)
        {
            Id = id;
            Title = title;
            PublishedAt = publishedAt;
        }
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime PublishedAt { get; set; }
    }
}