namespace UI
{
    public enum FlexDirection
    {
        Row,
        Column
    }

    public static class FlexDirectionExtensions
    {
        public static string ToCssValue(this FlexDirection flexDirection) => flexDirection switch
        {
            FlexDirection.Row => "row",
            FlexDirection.Column => "column",
            _ => throw new NotImplementedException()
        };

    }
}