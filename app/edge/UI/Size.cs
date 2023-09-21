namespace UI
{
    public enum Size
    {
        Small,
        Medium,
        Large,
        XLarge

    }

    public static class SizeExtensions
    {
        public static string ToCssValue(this Size size) => size switch
        {
            Size.Small => "0.25rem",
            Size.Medium => "0.5rem",
            Size.Large => "1rem",
            Size.XLarge => "2rem",
            _ => throw new NotImplementedException()
        };

    }
}