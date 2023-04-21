USE Nexus
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'AddCatagory')
BEGIN
    DROP PROCEDURE AddCatagory;
END
GO

CREATE PROCEDURE AddCatagory
    @CatagoryName VARCHAR(50),
    @CategoryDescription VARCHAR(500)
AS
BEGIN
    IF @CatagoryName IS NULL
    BEGIN
        RAISERROR('CatagoryName cannot be null', 16, 1);
        RETURN 1;
    END
    IF @CategoryDescription IS NULL
    BEGIN
        RAISERROR('CategoryDescription cannot be null', 16, 1);
        RETURN 2;
    END
    INSERT INTO dbo.Category
        ([CategoryName], [Description])
    VALUES
        (@CatagoryName, @CategoryDescription);
END;