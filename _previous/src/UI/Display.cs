namespace UI
{
    public enum Display
    {
        Block,
        Flex,
        Inline,
        InlineBlock,
        None
    }

    public static class DisplayExtensions
    {
        public static string ToCssValue(this Display display) => display switch
        {
            Display.Block => "block",
            Display.Flex => "flex",
            Display.Inline => "inline",
            Display.InlineBlock => "inline-block",
            Display.None => "none",
            _ => throw new NotImplementedException()

        };

    }
}