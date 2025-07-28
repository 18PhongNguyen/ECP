IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [DeliveryMethods] (
    [Id] int NOT NULL IDENTITY,
    [ShortName] nvarchar(max) NULL,
    [DeliveryTime] nvarchar(max) NULL,
    [Description] nvarchar(max) NULL,
    [Price] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_DeliveryMethods] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [productBrands] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NULL,
    CONSTRAINT [PK_productBrands] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [productTypes] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NULL,
    CONSTRAINT [PK_productTypes] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Orders] (
    [Id] int NOT NULL IDENTITY,
    [BuyerEmail] nvarchar(max) NULL,
    [OrderDate] datetimeoffset NOT NULL,
    [ShipToAddress_FirstName] nvarchar(max) NULL,
    [ShipToAddress_LastName] nvarchar(max) NULL,
    [ShipToAddress_Street] nvarchar(max) NULL,
    [ShipToAddress_City] nvarchar(max) NULL,
    [ShipToAddress_State] nvarchar(max) NULL,
    [ShipToAddress_Zipcode] nvarchar(max) NULL,
    [DeliveryMethodId] int NULL,
    [Subtotal] decimal(18,2) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [PaymentIntentId] nvarchar(max) NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Orders_DeliveryMethods_DeliveryMethodId] FOREIGN KEY ([DeliveryMethodId]) REFERENCES [DeliveryMethods] ([Id])
);
GO

CREATE TABLE [Products] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(180) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [PictureUrl] nvarchar(max) NOT NULL,
    [ProductTypeId] int NOT NULL,
    [ProductBrandId] int NOT NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Products_productBrands_ProductBrandId] FOREIGN KEY ([ProductBrandId]) REFERENCES [productBrands] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Products_productTypes_ProductTypeId] FOREIGN KEY ([ProductTypeId]) REFERENCES [productTypes] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [OrderItems] (
    [Id] int NOT NULL IDENTITY,
    [ItemOrdered_ProductItemId] int NULL,
    [ItemOrdered_ProductName] nvarchar(max) NULL,
    [ItemOrdered_PictureUrl] nvarchar(max) NULL,
    [Price] decimal(18,2) NOT NULL,
    [Quantity] int NOT NULL,
    [OrderId] int NULL,
    CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);
GO

CREATE INDEX [IX_Orders_DeliveryMethodId] ON [Orders] ([DeliveryMethodId]);
GO

CREATE INDEX [IX_Products_ProductBrandId] ON [Products] ([ProductBrandId]);
GO

CREATE INDEX [IX_Products_ProductTypeId] ON [Products] ([ProductTypeId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250725082722_InitialSqlServerMigration', N'8.0.11');
GO

COMMIT;
GO

