USE Nexus
GO

DECLARE @CategoryName VARCHAR(50);
DECLARE @CategoryDescription VARCHAR(500);

EXEC ReadCatagory
    @CategoryID = 1,
    @CategoryName = @CategoryName OUTPUT,
    @CategoryDescription = @CategoryDescription OUTPUT;

PRINT 'CategoryName: ' + @CategoryName;
PRINT 'CategoryDescription: ' + @CategoryDescription;
GO

DECLARE @CategoryName VARCHAR(50);
DECLARE @CategoryDescription VARCHAR(500);

EXEC ReadCatagory
    @CategoryID = 2,
    @CategoryName = @CategoryName OUTPUT,
    @CategoryDescription = @CategoryDescription OUTPUT;
GO