using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrdersWithItemAndOrderingSpecification : BaseSpecification<Order>
    {
        public OrdersWithItemAndOrderingSpecification(string email)
            : base(o => o.BuyerEmail == email)
        {
            AddInclude(o => o.DeliveryMethod);
            AddInclude(o => o.OrderItems);
            //AddInclude(o => o.OrderItems.Select(i => i.ItemOrdered));
            AddOrderByDescending(o => o.OrderDate);
        }

        public OrdersWithItemAndOrderingSpecification(int id, string email)
            : base(o => o.Id == id && o.BuyerEmail == email)
        {
            AddInclude(o => o.DeliveryMethod);
            AddInclude(o => o.OrderItems);
            //AddInclude(o => o.OrderItems.Select(i => i.ItemOrdered));
        }
    }
}