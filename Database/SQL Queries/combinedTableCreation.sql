USE Nexus;

GO
    CREATE TABLE Users (
        UserName VARCHAR(20) PRIMARY KEY,
        FirstName VARCHAR(20),
        MiddleName VARCHAR(20),
        LastName VARCHAR(50),
        Password VARCHAR(50)
    );

GO
    CREATE TABLE Category (
        CategoryID INT PRIMARY KEY,
        CategoryName VARCHAR(20),
        Description VARCHAR(200)
    );

GO
    CREATE TABLE Document (
        DocumentID INT PRIMARY KEY,
        DocumentData VARBINARY(MAX)
    );

GO
    CREATE TABLE Organization (
        OrganizationID INT PRIMARY KEY,
        Name VARCHAR(20),
        DateOfCreation DATE,
        Description VARCHAR(200),
        JoinMethod VARCHAR(50)
    );

GO
    CREATE TABLE InAnOrganization (
        UserName VARCHAR(20) NOT NULL,
        OrganizationID INT NOT NULL,
        FOREIGN KEY (UserName) REFERENCES Users(UserName) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (OrganizationID) REFERENCES Organization(OrganizationID) ON DELETE CASCADE ON UPDATE CASCADE
    );

GO
    CREATE TABLE OrganizationOwns (
        OrganizationID INT NOT NULL,
        DocumentID INT NOT NULL,
        FOREIGN KEY (OrganizationID) REFERENCES Organization(OrganizationID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID) ON DELETE CASCADE ON UPDATE CASCADE
    );

GO
    CREATE TABLE UserInputtedData (
        DataID INT PRIMARY KEY,
        LastModified DATE,
        DateOfCreation DATE
    );

GO
    CREATE TABLE UserCreated (
        UserName VARCHAR(20) NOT NULL,
        DataID INT NOT NULL,
        FOREIGN KEY (UserName) REFERENCES Users(UserName) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (DataID) REFERENCES UserInputtedData(DataID) ON DELETE CASCADE ON UPDATE CASCADE
    );

GO
    CREATE TABLE InACategory (
        DocumentID INT NOT NULL,
        CategoryID INT NOT NULL,
        FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID) ON DELETE CASCADE ON UPDATE CASCADE
    );

GO
    CREATE TABLE UserOwns (
        UserName VARCHAR(20) NOT NULL,
        DocumentID INT NOT NULL,
        FOREIGN KEY (UserName) REFERENCES Users(UserName) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID) ON DELETE CASCADE ON UPDATE CASCADE
    );

GO