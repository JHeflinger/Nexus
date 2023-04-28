USE Nexus
GO

CREATE TABLE InAnOrganization (
	UserName VARCHAR(20) NOT NULL,
	OrganizationID INT NOT NULL,
	FOREIGN KEY (UserName) REFERENCES Users(UserName),
	FOREIGN KEY (OrganizationID) REFERENCES Organization(OrganizationID)
);