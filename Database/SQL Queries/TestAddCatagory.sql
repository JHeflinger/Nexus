USE Nexus
GO

EXEC AddCatagory 
    @CatagoryName = 'TestCatagory',
    @CategoryDescription = 'TestDescription'
GO

EXEC AddCatagory 
    @CatagoryName = 'TestCatagory2',
    @CategoryDescription = NULL
GO

EXEC AddCatagory 
    @CatagoryName = NULL,
    @CategoryDescription = 'TestDescription2'
GO

EXEC AddCatagory 
    @CatagoryName = NULL,
    @CategoryDescription = NULL
GO