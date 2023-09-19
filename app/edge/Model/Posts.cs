namespace Model
{
    public static class Posts
    {
        private static readonly Post[] _posts = new Post[] {
            new ("bots-in-kubernetes", "Bots in Kubernetes", DateTime.Parse("2018-08-12")),
            new ("cherry-reflections", "Cherry Reflections", DateTime.Parse("2022-07-19")),
            new ("digital-assistants-azure-eventgrid", "Digital Assistants and Azure Event Grid",DateTime.Parse("2018-08-12")),
            new ("drake-and-trappist1", "Drake and Trappist-1",DateTime.Parse("2018-08-12")),
            new ("identity-politics", "Identity Politics",DateTime.Parse("2018-08-12")),
            new ("learning-to-trade", "Learning to Trade",DateTime.Parse("2018-08-12")),
            new ("on-free-will", "On Free Will",DateTime.Parse("2018-08-12")),
            new ("openai-windows", "OpenAI on Windows",DateTime.Parse("2018-08-12")),
            new ("review-our-broken-steps", "Review Our Broken Steps",DateTime.Parse("2018-08-12")),
            new ("secret-to-event-processing", "Secret to Event Processing",DateTime.Parse("2018-08-12")),
            new ("smarter-npcs-with-natural-language-processing", "Smarter NPCs with Natural Language Processing",DateTime.Parse("2018-08-12")),
            new ("tensorflow-keras-windows", "TensorFlow and Keras on Windows",DateTime.Parse("2018-08-12")),
            new ("the-battle-for-eurasia", "The Battle for Eurasia",DateTime.Parse("2018-08-12")),
            new ("the-power-of-stone", "The Power of Stone",DateTime.Parse("2018-08-12")),
            new ("what-happened-to-the-internet", "What Happened to the Internet",DateTime.Parse("2018-08-12")),
            new ("xamarin-chatbots", "Xamarin Chatbots",DateTime.Parse("2018-08-12"))
        };
        public static Post[] List() => _posts;
        public static Post Get(string postId) => _posts.First(_ => _.Id == postId);

    }
}