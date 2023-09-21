namespace Model
{
    public static class Posts
    {
        public const string CherryReflections = "cherry-reflections";
        public const string LearningToTrade = "learning-to-trade";
        public const string PowerOfStone = "the-power-of-stone";
        public const string OnFreeWill = "on-free-will";
        public const string WhatHappenedToTheInternet = "what-happened-to-the-internet";


        private static readonly Post[] _posts = new Post[] {
            new ("bots-in-kubernetes", "Bots in Kubernetes", DateTime.Parse("2018-08-12")),
            new ("cherry-reflections", "Cherry Reflections", DateTime.Parse("2022-07-19")),
            new ("digital-assistants-azure-eventgrid", "Digital Assistants and Azure Event Grid", DateTime.Parse("2018-03-04")),
            new ("drake-and-trappist1", "Drake and Trappist-1", DateTime.Parse("2017-08-21")),
            new ("identity-politics", "Identity Politics", DateTime.Parse("2015-05-23")),
            new ("learning-to-trade", "Learning to Trade", DateTime.Parse("2017-11-11")),
            new ("on-free-will", "On Free Will", DateTime.Parse("2014-10-23")),
            new ("openai-windows", "OpenAI on Windows", DateTime.Parse("2018-02-07")),
            new ("review-our-broken-steps", "Review Our Broken Steps", DateTime.Parse("2017-01-11")),
            new ("secret-to-event-processing", "Secret to Event Processing", DateTime.Parse("2022-05-20")),
            new ("smarter-npcs-with-natural-language-processing", "Smarter NPCs with Natural Language Processing", DateTime.Parse("2018-05-23")),
            new ("tensorflow-keras-windows", "TensorFlow and Keras on Windows", DateTime.Parse("2018-01-28")),
            new ("the-battle-for-eurasia", "The Battle for Eurasia", DateTime.Parse("2014-05-23")),
            new ("the-power-of-stone", "The Power of Stone", DateTime.Parse("2016-12-23")),
            new ("what-happened-to-the-internet", "What Happened to the Internet", DateTime.Parse("2017-11-23")),
            new ("xamarin-chatbots", "Xamarin Chatbots", DateTime.Parse("2018-03-11"))
        };
        public static Post[] List() => _posts;
        public static Post Get(string postId) => _posts.FirstOrDefault(_ => _.Id == postId) ?? throw new Exception($"Post {postId} not found");

    }
}