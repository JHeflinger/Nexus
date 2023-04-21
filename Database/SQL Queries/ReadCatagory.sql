USE Nexus
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'ReadCatagory')
BEGIN
    DROP PROCEDURE ReadCatagory;
END
GO

CREATE PROCEDURE ReadCatagory
    @CategoryID INT,
    @CategoryName VARCHAR(50) OUTPUT,
    @CategoryDescription VARCHAR(500) OUTPUT
AS
BEGIN
    IF @CategoryID IS NULL
    BEGIN
        RAISERROR('CategoryID cannot be null', 16, 1);
        RETURN 1;
    END
    IF NOT EXISTS (SELECT *
    FROM dbo.Category
    WHERE [CategoryID] = @CategoryID)
    BEGIN
        RAISERROR('CategoryID does not exist', 16, 1);
        RETURN 2;
    END
    SELECT @CategoryName = [CategoryName], @CategoryDescription = [Description]
    FROM dbo.Category
    WHERE [CategoryID] = @CategoryID;
END;
