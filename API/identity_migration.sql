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

CREATE TABLE [AspNetRoles] (
    [Id] TEXT NOT NULL,
    [Name] TEXT NULL,
    [NormalizedName] TEXT NULL,
    [ConcurrencyStamp] TEXT NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AspNetUsers] (
    [Id] TEXT NOT NULL,
    [DisplayName] TEXT NULL,
    [UserName] TEXT NULL,
    [NormalizedUserName] TEXT NULL,
    [Email] TEXT NULL,
    [NormalizedEmail] TEXT NULL,
    [EmailConfirmed] INTEGER NOT NULL,
    [PasswordHash] TEXT NULL,
    [SecurityStamp] TEXT NULL,
    [ConcurrencyStamp] TEXT NULL,
    [PhoneNumber] TEXT NULL,
    [PhoneNumberConfirmed] INTEGER NOT NULL,
    [TwoFactorEnabled] INTEGER NOT NULL,
    [LockoutEnd] TEXT NULL,
    [LockoutEnabled] INTEGER NOT NULL,
    [AccessFailedCount] INTEGER NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [AspNetRoleClaims] (
    [Id] INTEGER NOT NULL,
    [RoleId] TEXT NOT NULL,
    [ClaimType] TEXT NULL,
    [ClaimValue] TEXT NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Address] (
    [Id] INTEGER NOT NULL,
    [FirstName] TEXT NULL,
    [LastName] TEXT NULL,
    [Street] TEXT NULL,
    [City] TEXT NULL,
    [State] TEXT NULL,
    [Zipcode] TEXT NULL,
    [AppUserId] TEXT NULL,
    CONSTRAINT [PK_Address] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Address_AspNetUsers_AppUserId] FOREIGN KEY ([AppUserId]) REFERENCES [AspNetUsers] ([Id])
);
GO

CREATE TABLE [AspNetUserClaims] (
    [Id] INTEGER NOT NULL,
    [UserId] TEXT NOT NULL,
    [ClaimType] TEXT NULL,
    [ClaimValue] TEXT NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] TEXT NOT NULL,
    [ProviderKey] TEXT NOT NULL,
    [ProviderDisplayName] TEXT NULL,
    [UserId] TEXT NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserRoles] (
    [UserId] TEXT NOT NULL,
    [RoleId] TEXT NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [AspNetUserTokens] (
    [UserId] TEXT NOT NULL,
    [LoginProvider] TEXT NOT NULL,
    [Name] TEXT NOT NULL,
    [Value] TEXT NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_Address_AppUserId] ON [Address] ([AppUserId]);
GO

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
GO

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]);
GO

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
GO

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
GO

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
GO

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250327033831_IdentityInitial', N'8.0.11');
GO

COMMIT;
GO

