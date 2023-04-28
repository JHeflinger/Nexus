USE Nexus
GO

CREATE TABLE Category (
	CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName VARCHAR(20),
    Description VARCHAR(200)
);