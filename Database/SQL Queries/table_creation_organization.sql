USE Nexus
GO

CREATE TABLE Organization (
	OrganizationID INT PRIMARY KEY,
	Name VARCHAR(20),
	DateOfCreation DATE,
	Description VARCHAR(200),
	JoinMethod VARCHAR(50)
);