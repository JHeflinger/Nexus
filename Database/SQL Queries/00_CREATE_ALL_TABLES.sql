USE Nexus;

GO
    CREATE TABLE Users (
        UserName VARCHAR(50) PRIMARY KEY,
        FirstName NVARCHAR(50),
        MiddleName NVARCHAR(50),
        LastName NVARCHAR(50),
        Password NVARCHAR(50)
    );

GO
    CREATE TABLE Category (
        CategoryID INT PRIMARY KEY IDENTITY(1,1),
        CategoryName VARCHAR(20),
        Description VARCHAR(200)
    );

GO
    CREATE TABLE Document (
        DocumentID INT PRIMARY KEY IDENTITY(1,1),
        DocumentData VARBINARY(MAX),
		DocumentName VARCHAR(100),
		[Description] VARCHAR(2000),
        LastModified DATE,
        DateOfCreation DATE,
		Annotations VARBINARY(MAX)
    );

GO
    CREATE TABLE Organization (
        OrganizationID INT IDENTITY(1,1) PRIMARY KEY,
        Name VARCHAR(20),
        DateOfCreation DATE,
        Description VARCHAR(200),
        JoinMethod VARCHAR(50)
    );

GO
    CREATE TABLE InAnOrganization (
        UserName VARCHAR(50) NOT NULL,
        OrganizationID INT NOT NULL,
        FOREIGN KEY (UserName) REFERENCES Users(UserName) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (OrganizationID) REFERENCES Organization(OrganizationID) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY(UserName, OrganizationID)
    );

GO
    CREATE TABLE OrganizationOwns (
        OrganizationID INT NOT NULL,
        DocumentID INT NOT NULL,
        FOREIGN KEY (OrganizationID) REFERENCES Organization(OrganizationID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID) ON DELETE CASCADE ON UPDATE CASCADE
    );

GO
    CREATE TABLE InACategory (
        DocumentID INT NOT NULL,
        CategoryID INT NOT NULL,
        FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID) ON DELETE CASCADE ON UPDATE CASCADE
    );

GO
    CREATE TABLE UserOwns ( -- Don't need a separate table for 1 to Many relationship put a UserName key in Document
        UserName VARCHAR(50) NOT NULL,
        DocumentID INT NOT NULL,
        FOREIGN KEY (UserName) REFERENCES Users(UserName) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID) ON DELETE CASCADE ON UPDATE CASCADE
    );

GO
	CREATE TABLE UserLikes (
        UserName VARCHAR(50) NOT NULL,
        DocumentID INT NOT NULL,
        FOREIGN KEY (UserName) REFERENCES Users(UserName) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID) ON DELETE CASCADE ON UPDATE CASCADE
    );

GO

	CREATE TABLE UserViewed (
        UserName VARCHAR(50) NOT NULL,
        DocumentID INT NOT NULL,
        FOREIGN KEY (UserName) REFERENCES Users(UserName) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID) ON DELETE CASCADE ON UPDATE CASCADE
    );

GO

	CREATE TABLE [RegionLabel] (
		LabelID INT PRIMARY KEY,
        UserName VARCHAR(50) NOT NULL,
        DocumentID INT NOT NULL,
		XPos INT NOT NULL,
		YPos INT NOT NULL,
		Width INT NOT NULL,
		Height INT NOT NULL,
		Content VARCHAR(1000) NOT NULL,
        FOREIGN KEY (UserName) REFERENCES Users(UserName) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID) ON DELETE CASCADE ON UPDATE CASCADE
    );

GO