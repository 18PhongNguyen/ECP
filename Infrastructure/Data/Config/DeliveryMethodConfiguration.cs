using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class DeliveryMethodConfiguration
    : IEntityTypeConfiguration<Core.Entities.OrderAggregate.DeliveryMethod>
    {
        public void Configure(EntityTypeBuilder<Core.Entities.OrderAggregate.DeliveryMethod> builder)
        {
            builder.Property(d => d.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}