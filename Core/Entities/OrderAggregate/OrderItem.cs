namespace Core.Entities.OrderAggregate
{
    public class OrderItem : BaseEntity
    {
        public ProductItemOrdered ProductItemOrdered;

        public ProductItemOrdered ItemOrdered { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public OrderItem(ProductItemOrdered itemOrdered, decimal price, int quantity)
        {
            ItemOrdered = itemOrdered;
            Price = price;
            Quantity = quantity;
        }
        public OrderItem()
        {
        }
    }
}