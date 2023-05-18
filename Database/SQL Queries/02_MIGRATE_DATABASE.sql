CREATE DATABASE Nexus_Blob
ON PRIMARY 
(NAME = 'Nexus_Blob', 
 FILENAME = 'D:\Database\MSSQL15.MSSQLSERVER\MSSQL\DATA\Nexus_Blob.mdf', 
 SIZE = 600MB, 
 MAXSIZE = 3000MB, 
 FILEGROWTH = 12%) 
LOG ON 
(NAME = 'Nexus_Blob_log', 
 FILENAME = 'D:\Database\MSSQL15.MSSQLSERVER\MSSQL\DATA\Nexus_Blob_log.ldf', 
 SIZE = 300MB, 
 MAXSIZE = 2200MB, 
 FILEGROWTH = 17%);

 USE Nexus_Blob
 GO

 CREATE USER [consaljj]
FROM
    LOGIN [consaljj];

exec sp_addrolemember 'db_owner',
'consaljj';

GO

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

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddDocumentFromOganization')
BEGIN
    DROP PROCEDURE AddDocumentFromOganization;
END
GO

CREATE PROCEDURE AddDocumentFromOganization
    @DocumentData VARBINARY(MAX),
	@OrgID VARCHAR(20)
AS

BEGIN
    IF @DocumentData IS NULL
    BEGIN
        RAISERROR('DocumentData cannot be null', 16, 1);
        RETURN 1;
    END

	IF @OrgID IS NULL
    BEGIN
        RAISERROR('Organization ID cannot be null', 16, 1);
        RETURN 2;
    END

    INSERT INTO dbo.Document
        (DocumentData)
    VALUES
        (@DocumentData);

	DECLARE @docID INT
	SET @docID = SCOPE_IDENTITY()

	INSERT INTO dbo.OrganizationOwns
		(OrganizationID, DocumentID)
	VALUES
		(@OrgID, @docID)
END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddDocumentFromUser')
BEGIN
    DROP PROCEDURE AddDocumentFromUser;
END
GO

CREATE PROCEDURE AddDocumentFromUser
    @UID VARCHAR(50),
    @DocumentData VARBINARY(MAX),
    @DocumentName VARCHAR(100),
    @Desc VARCHAR(2000),
    @LastModified DATE,
    @DateOfCreation DATE,
    @Annotations VARBINARY(MAX),
	@OrgID INT = -1
AS

BEGIN
    IF (@DocumentData IS NULL OR @UID IS NULL OR @DocumentName IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

    INSERT INTO dbo.Document
        (DocumentData, DocumentName, [Description], LastModified, DateOfCreation, Annotations)
    VALUES
        (@DocumentData, @DocumentName, @Desc, @LastModified, @DateOfCreation, @Annotations);

    DECLARE @docID INT;
    SET @docID = SCOPE_IDENTITY();

    INSERT INTO dbo.UserOwns
        (UserName, DocumentID)
    VALUES
        (@UID, @docID);

	IF (@OrgID != -1)
	BEGIN
		INSERT INTO OrganizationOwns (OrganizationID, DocumentID)
		VALUES(@OrgID, @docID)
	END
END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddDocumentTag')
BEGIN
    DROP PROCEDURE AddDocumentTag;
END
GO

CREATE PROCEDURE AddDocumentTag
    @docID INT,
	@tag VARCHAR(20)
AS

BEGIN
    IF (@docID IS NULL OR @tag IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END
	
	IF NOT EXISTS (SELECT * FROM Category WHERE Category.CategoryName = @tag)
	BEGIN
		INSERT INTO Category (CategoryName, [Description])
		VALUES(@tag, '');
	END

	DECLARE @tagID INT
	SELECT @tagID = Category.CategoryID
	FROM Category
	WHERE Category.CategoryName = @tag

	IF NOT EXISTS (SELECT * FROM InACategory WHERE InACategory.DocumentID = @docID AND InACategory.CategoryID = @tagID)
	BEGIN
		INSERT INTO InACategory (DocumentID, CategoryID)
		VALUES(@docID, @tagID)
	END

END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddNewOrganization')
BEGIN
    DROP PROCEDURE AddNewOrganization;
END
GO

CREATE PROCEDURE AddNewOrganization
    @Username VARCHAR(50)
AS
BEGIN
	IF @Username IS NULL
    BEGIN
        RAISERROR('Username cannot be null', 16, 1);
        RETURN 1;
    END

	INSERT INTO Organization ([Name], DateOfCreation, [Description], JoinMethod)
	VALUES ('New Organization', GETDATE(), 'Add a description here.', 'free admin')

	INSERT INTO InAnOrganization(UserName, OrganizationID)
	VALUES(@Username, IDENT_CURRENT('Organization'))
END;
GO

CREATE PROCEDURE [dbo].[AddOrganization]
	@name VARCHAR(20),
	@dateOfCreation DATE,
	@description VARCHAR(200),
	@joinmethod VARCHAR(50) -- check if join method is the exact correct strings later
AS
BEGIN
	IF (@name = NULL OR @dateOfCreation = NULL or @joinmethod = NULL)
	BEGIN
		PRINT 'ERROR: The only parameter that can be null is @description';
		RETURN (1)
	END
	INSERT INTO [Organization]([Name], DateOfCreation, [Description], JoinMethod)
	VALUES(@name, @dateOfCreation, @description, @joinmethod);
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'AddUser')
BEGIN
	DROP PROCEDURE AddUser;
END
GO

CREATE PROCEDURE [dbo].[AddUser]
	@username NVARCHAR(30),
	@firstname NVARCHAR(50),
	@middlename NVARCHAR(20),
	@lastname NVARCHAR(50),
	@password NVARCHAR(50)
AS
BEGIN
	-- this error check isn't working at the moment, not sure why?
	IF (@username = NULL OR @firstname = NULL OR @lastname = NULL or @password = NULL) -- convert to use hashed passwords and salts later
	BEGIN
		PRINT 'ERROR: The only parameter that can be null is @middlename';
		RETURN (1)
	END

	IF EXISTS (SELECT * FROM [Users] WHERE [Users].UserName = @username)
	BEGIN
		PRINT 'ERROR: User already exists!';
		RETURN (2)
	END
	INSERT INTO [Users](UserName, FirstName, MiddleName, LastName, [Password])
	VALUES(@username, @firstname, @middlename, @lastname, @password);
	RETURN (0);
END
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddUserLike')
BEGIN
    DROP PROCEDURE AddUserLike;
END
GO

CREATE PROCEDURE AddUserLike
    @Username VARCHAR(50),
    @docID INT
AS

BEGIN
    IF (@docID IS NULL OR @Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

	IF EXISTS (SELECT * FROM UserLikes WHERE UserLikes.UserName = @Username AND UserLikes.DocumentID = @docID)
	BEGIN
		RAISERROR('user already likes this', 16, 1);
		RETURN 2;
	END

	INSERT INTO UserLikes (UserName, DocumentID)
	VALUES (@Username, @docID);
END;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'AddUserToOrg')
BEGIN
	DROP PROCEDURE AddUserToOrg;
END
GO

CREATE PROCEDURE AddUserToOrg
	@email VARCHAR(50),
	@orgID INT
AS
BEGIN
	IF (@email IS NULL OR @orgID IS NULL)
	BEGIN
		PRINT 'no null params';
		RETURN (1)
	END

	IF NOT EXISTS (SELECT * FROM Users WHERE Users.FirstName = @email)
	BEGIN
		RETURN 2;
	END

	IF NOT EXISTS (SELECT * 
					FROM InAnOrganization 
					JOIN Users ON InAnOrganization.UserName = Users.UserName
					WHERE Users.FirstName = @email)
	BEGIN
		DECLARE @uname NVARCHAR(100)
		SELECT @uname = Users.UserName
		FROM Users
		WHERE Users.FirstName = @email

		INSERT INTO InAnOrganization(UserName, OrganizationID)
		VALUES (@uname, @orgID)
	END
END
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddUserViewed')
BEGIN
    DROP PROCEDURE AddUserViewed;
END
GO

CREATE PROCEDURE AddUserViewed
    @Username VARCHAR(50),
    @docID INT
AS

BEGIN
    IF (@docID IS NULL OR @Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

	IF NOT EXISTS (SELECT * FROM UserViewed WHERE UserViewed.UserName = @Username AND UserViewed.DocumentID = @docID)
	BEGIN
		INSERT INTO UserViewed (UserName, DocumentID)
		VALUES (@Username, @docID);
	END
	ELSE
	BEGIN
		PRINT('User has already viewed this. No changes were made')
	END
END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'DeleteDocumentByID')
BEGIN
    DROP PROCEDURE DeleteDocumentByID;
END
GO

CREATE PROCEDURE DeleteDocumentByID
    @id INT
AS

BEGIN
    IF @id IS NULL
    BEGIN
        RAISERROR('Document ID cannot be null', 16, 1);
        RETURN 1;
    END

	IF EXISTS (SELECT * FROM UserOwns WHERE UserOwns.DocumentID = @id)
	BEGIN
		DELETE FROM UserOwns
		WHERE UserOwns.DocumentID = @id
	END

	IF EXISTS (SELECT * FROM OrganizationOwns WHERE OrganizationOwns.DocumentID = @id)
	BEGIN
		DELETE FROM OrganizationOwns
		WHERE OrganizationOwns.DocumentID = @id
	END

    DELETE FROM Document
	WHERE Document.DocumentID = @id
END;
GO

CREATE PROCEDURE [dbo].[DeleteOrganization]
	@orgID INT
AS
BEGIN
	IF @orgID = NULL
	BEGIN
		PRINT 'ERROR: @orgID cannot be null'
		RETURN (1)
	END

	IF NOT EXISTS (SELECT * FROM [Organization] WHERE [Organization].OrganizationID = @orgID)
	BEGIN
		PRINT 'ERROR: Organization does not exist!';
		RETURN (2)
	END
	DELETE FROM [Organization]
	WHERE [Organization].OrganizationID = @orgID --make sure this safely deletes everything related to org as well later
END
GO

CREATE PROCEDURE [dbo].[DeleteUser]
	@username VARCHAR(20)
AS
BEGIN
	IF @username = NULL
	BEGIN
		PRINT 'ERROR: @username cannot be null'
		RETURN (1)
	END

	IF NOT EXISTS (SELECT * FROM [Users] WHERE [Users].Username = @username)
	BEGIN
		PRINT 'ERROR: User does not exist!';
		RETURN (2)
	END
	DELETE FROM [Users]
	WHERE [Users].UserName = @username --make sure this safely deletes everything related to user as well later
END
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'DeleteUserLike')
BEGIN
    DROP PROCEDURE DeleteUserLike;
END
GO

CREATE PROCEDURE DeleteUserLike
    @Username VARCHAR(50),
    @docID INT
AS

BEGIN
    IF (@docID IS NULL OR @Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

	IF NOT EXISTS (SELECT * FROM UserLikes WHERE UserLikes.UserName = @Username AND UserLikes.DocumentID = @docID)
	BEGIN
		RAISERROR('user already does not like this', 16, 1);
		RETURN 2;
	END

	DELETE FROM UserLikes
	WHERE UserLikes.UserName = @Username AND UserLikes.DocumentID = @docID
END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetAvailableDocumentsFromUser')
BEGIN
    DROP PROCEDURE GetAvailableDocumentsFromUser;
END
GO

CREATE PROCEDURE GetAvailableDocumentsFromUser
    @Username VARCHAR(50),
	@OrderBy VARCHAR(10) = 'activity',
	@DecendingOrder BIT = 0
AS

BEGIN
    IF @Username IS NULL
    BEGIN
        RAISERROR('Username cannot be null', 16, 1);
        RETURN 1;
    END

	IF (@OrderBy = 'activity')
	BEGIN
		IF (@DecendingOrder = 1)
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			LEFT JOIN OrganizationOwns ON OrganizationOwns.DocumentID = Document.DocumentID
			LEFT JOIN InAnOrganization ON InAnOrganization.OrganizationID = OrganizationOwns.OrganizationID
			WHERE UserOwns.UserName = @Username OR InAnOrganization.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY Document.LastModified DESC
		END
		ELSE
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			LEFT JOIN OrganizationOwns ON OrganizationOwns.DocumentID = Document.DocumentID
			LEFT JOIN InAnOrganization ON InAnOrganization.OrganizationID = OrganizationOwns.OrganizationID
			WHERE UserOwns.UserName = @Username OR InAnOrganization.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY Document.LastModified ASC
		END
	END
	ELSE IF (@OrderBy = 'views')
	BEGIN
		IF (@DecendingOrder = 1)
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			LEFT JOIN OrganizationOwns ON OrganizationOwns.DocumentID = Document.DocumentID
			LEFT JOIN InAnOrganization ON InAnOrganization.OrganizationID = OrganizationOwns.OrganizationID
			WHERE UserOwns.UserName = @Username OR InAnOrganization.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY COUNT(UserViewed.DocumentID) DESC
		END
		ELSE
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			LEFT JOIN OrganizationOwns ON OrganizationOwns.DocumentID = Document.DocumentID
			LEFT JOIN InAnOrganization ON InAnOrganization.OrganizationID = OrganizationOwns.OrganizationID
			WHERE UserOwns.UserName = @Username OR InAnOrganization.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY COUNT(UserViewed.DocumentID) ASC
		END
	END
	ELSE IF (@OrderBy = 'likes')
	BEGIN
		IF (@DecendingOrder = 1)
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			LEFT JOIN OrganizationOwns ON OrganizationOwns.DocumentID = Document.DocumentID
			LEFT JOIN InAnOrganization ON InAnOrganization.OrganizationID = OrganizationOwns.OrganizationID
			WHERE UserOwns.UserName = @Username OR InAnOrganization.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY COUNT(UserLikes.DocumentID) DESC
		END
		ELSE
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			LEFT JOIN OrganizationOwns ON OrganizationOwns.DocumentID = Document.DocumentID
			LEFT JOIN InAnOrganization ON InAnOrganization.OrganizationID = OrganizationOwns.OrganizationID
			WHERE UserOwns.UserName = @Username OR InAnOrganization.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY COUNT(UserLikes.DocumentID) ASC
		END
	END
	ELSE
	BEGIN
		RAISERROR('invalid order by argument', 16, 1)
		RETURN 2;
	END
END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetFileByID')
BEGIN
    DROP PROCEDURE GetFileByID;
END
GO

CREATE PROCEDURE GetFileByID
    @docID INT
AS

BEGIN
    IF @docID IS NULL
    BEGIN
        RAISERROR('Document ID cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT 
            Document.DocumentName,
            Document.DocumentData,
            Document.Description,
            Document.LastModified,
            Document.DateOfCreation,
            Document.Annotations
	FROM Document
	WHERE Document.DocumentID = @docID;
END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetDocumentLikes')
BEGIN
    DROP PROCEDURE GetDocumentLikes;
END
GO

CREATE PROCEDURE GetDocumentLikes
    @docID INT
AS

BEGIN
    IF @docID IS NULL
    BEGIN
        RAISERROR('Document ID cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT COUNT(*) AS Likes
	FROM UserLikes
	WHERE UserLikes.DocumentID = @docID
END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetDocumentTags')
BEGIN
    DROP PROCEDURE GetDocumentTags;
END
GO

CREATE PROCEDURE GetDocumentTags
    @docID INT
AS

BEGIN
    IF (@docID IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END
	
	SELECT Category.CategoryName AS [Tag]
	FROM InACategory
	JOIN Category ON InACategory.CategoryID = Category.CategoryID
	WHERE InACategory.DocumentID = @docID

END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetDocumentViews')
BEGIN
    DROP PROCEDURE GetDocumentViews;
END
GO

CREATE PROCEDURE GetDocumentViews
    @docID INT
AS

BEGIN
    IF @docID IS NULL
    BEGIN
        RAISERROR('Document ID cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT COUNT(*) AS [Views]
	FROM UserViewed
	WHERE UserViewed.DocumentID = @docID
END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetDoesUserLike')
BEGIN
    DROP PROCEDURE GetDoesUserLike;
END
GO

CREATE PROCEDURE GetDoesUserLike
    @Username VARCHAR(50),
    @docID INT
AS

BEGIN
    IF (@docID IS NULL OR @Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END
	DECLARE @foundLike BIT
	SET @foundLike = 0
    IF EXISTS (SELECT * FROM UserLikes WHERE UserLikes.UserName = @Username AND UserLikes.DocumentID = @docID)
	BEGIN
		SET @foundLike = 1
	END
	SELECT @foundLike AS FoundLike 
END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetOrgFileIDs')
BEGIN
    DROP PROCEDURE GetOrgFileIDs;
END
GO

CREATE PROCEDURE GetOrgFileIDs
    @orgID VARCHAR(50)
AS

BEGIN
    IF @orgID IS NULL
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT Document.DocumentID, Document.DocumentName
	FROM Document
	LEFT JOIN OrganizationOwns ON OrganizationOwns.DocumentID = Document.DocumentID
	WHERE OrganizationOwns.OrganizationID = @orgID
END;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetOrgFromID')
BEGIN
	DROP PROCEDURE GetOrgFromID;
END
GO

CREATE PROCEDURE GetOrgFromID
	@orgID INT
AS
BEGIN
	IF (@orgID IS NULL)
	BEGIN
		PRINT 'no null params';
		RETURN (1)
	END

	SELECT [Name], [Description]
	FROM Organization
	WHERE Organization.OrganizationID = @orgID
END
GO

CREATE PROCEDURE [dbo].[GetOrganization]
	@orgID INT
AS
BEGIN
	IF @orgID = NULL
	BEGIN
		PRINT 'ERROR: @orgID cannot be null'
		RETURN (1)
	END

	IF NOT EXISTS (SELECT * FROM [Organization] WHERE [Organization].OrganizationID = @orgID)
	BEGIN
		PRINT 'ERROR: Organization does not exist!';
		RETURN (2)
	END
	SELECT * FROM [Organization] WHERE [Organization].OrganizationID = @orgID
END
GO

CREATE PROCEDURE [dbo].[GetUser]
	@username NVARCHAR(20)
AS
BEGIN
	IF @username = NULL
	BEGIN
		PRINT 'ERROR: @username cannot be null'
		RETURN (1)
	END

	IF NOT EXISTS (SELECT * FROM [Users] WHERE [Users].UserName = @username)
	BEGIN
		PRINT 'ERROR: User does not exist!';
		RETURN (2)
	END
	SELECT * FROM [Users] WHERE [Users].UserName = @username
END
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetUserAccountLikes')
BEGIN
    DROP PROCEDURE GetUserAccountLikes;
END
GO

CREATE PROCEDURE GetUserAccountLikes
    @Username VARCHAR(50)
AS

BEGIN
    IF (@Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END
	
	SELECT COUNT(UserOwns.UserName) AS [Likes]
	FROM UserOwns
	JOIN UserLikes ON UserLikes.DocumentID = UserOwns.DocumentID
	WHERE UserOwns.UserName = @Username
	GROUP BY UserOwns.UserName

END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetUserAccountViews')
BEGIN
    DROP PROCEDURE GetUserAccountViews;
END
GO

CREATE PROCEDURE GetUserAccountViews
    @Username VARCHAR(50)
AS

BEGIN
    IF (@Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END
	
	SELECT COUNT(UserOwns.UserName) AS [Views]
	FROM UserOwns
	JOIN UserViewed ON UserViewed.DocumentID = UserOwns.DocumentID
	WHERE UserOwns.UserName = @Username
	GROUP BY UserOwns.UserName

END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetUserFileIDS')
BEGIN
    DROP PROCEDURE GetUserFileIDS;
END
GO

CREATE PROCEDURE GetUserFileIDS
    @Username VARCHAR(50)
AS

BEGIN
    IF @Username IS NULL
    BEGIN
        RAISERROR('Username cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT Document.DocumentID, Document.DocumentName
	FROM Document
	LEFT JOIN UserOwns ON UserOwns.DocumentID = Document.DocumentID
	WHERE UserOwns.UserName = @Username
END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetUserOrganizations')
BEGIN
    DROP PROCEDURE GetUserOrganizations;
END
GO

CREATE PROCEDURE GetUserOrganizations
    @Username VARCHAR(50)
AS
BEGIN
	IF @Username IS NULL
    BEGIN
        RAISERROR('Username cannot be null', 16, 1);
        RETURN 1;
    END

	SELECT Organization.OrganizationID, Organization.[Name], Organization.DateOfCreation, Organization.[Description], Organization.JoinMethod 
	FROM Organization
	LEFT JOIN InAnOrganization ON InAnOrganization.OrganizationID = Organization.OrganizationID
	WHERE InAnOrganization.UserName = @Username

END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'ToggleUserLike')
BEGIN
    DROP PROCEDURE ToggleUserLike;
END
GO

CREATE PROCEDURE ToggleUserLike
    @Username VARCHAR(50),
    @docID INT
AS

BEGIN
    IF (@docID IS NULL OR @Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

	IF EXISTS (SELECT * FROM UserLikes WHERE UserLikes.UserName = @Username AND UserLikes.DocumentID = @docID)
	BEGIN
		DELETE FROM UserLikes
		WHERE UserLikes.UserName = @Username AND UserLikes.DocumentID = @docID
	END
	ELSE
	BEGIN
		INSERT INTO UserLikes (UserName, DocumentID)
		VALUES (@Username, @docID);
	END
END;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'UpdateDocument')
BEGIN
    DROP PROCEDURE UpdateDocument;
END
GO

CREATE PROCEDURE UpdateDocument
    @DocID INT,
	@DocumentName VARCHAR(100),
	@Description VARCHAR(2000),
    @Annotation VARBINARY(MAX)
AS

BEGIN
    IF (@DocID IS NULL OR @DocumentName IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

    UPDATE Document
	SET Document.DocumentName = @DocumentName,
        Document.[Description] = @Description,
        Document.Annotations = @Annotation
	WHERE DocumentID = @DocID;
END;
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'UpdateOrgFromID')
BEGIN
	DROP PROCEDURE UpdateOrgFromID;
END
GO

CREATE PROCEDURE UpdateOrgFromID
	@orgID INT,
	@name VARCHAR(50),
	@description VARCHAR(2000)
AS
BEGIN
	IF (@orgID IS NULL)
	BEGIN
		PRINT 'no null params';
		RETURN (1)
	END

	BEGIN
		UPDATE Organization
		SET [Name] = @name, [Description] = @description
		WHERE OrganizationID = @orgID
	END
END
GO

CREATE PROCEDURE [dbo].[UpdateUser]
	@username NVARCHAR(20),
	@firstname NVARCHAR(20) = NULL,
	@middlename NVARCHAR(20) = NULL,
	@lastname NVARCHAR(50) = NULL,
	@password NVARCHAR(50) = NULL
AS
BEGIN
	IF NOT EXISTS (SELECT * FROM [Users] WHERE [Users].UserName = @username)
	BEGIN
		PRINT 'ERROR: User does not exist!';
		RETURN (1)
	END

	IF @firstname = NULL
	BEGIN
		SELECT @firstname = FirstName
		FROM [Users] 
		WHERE [Users].UserName = @username
	END

	IF @middlename = NULL
	BEGIN
		SELECT @middlename = MiddleName
		FROM [Users] 
		WHERE [Users].UserName = @username
	END

	IF @lastname = NULL
	BEGIN
		SELECT @lastname = LastName
		FROM [Users] 
		WHERE [Users].UserName = @username
	END

	IF @password = NULL
	BEGIN
		SELECT @password = [Password]
		FROM [Users] 
		WHERE [Users].UserName = @username
	END

	UPDATE [Users]
	SET FirstName = @firstname, MiddleName = @middlename, LastName = @lastname, [Password] = @password
	WHERE UserName = @username
END
GO

USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'UserExists')
BEGIN
    DROP PROCEDURE UserExists;
END
GO

CREATE PROCEDURE UserExists
    @FirebaseToken VARCHAR(30)

AS
BEGIN
    IF @FirebaseToken IS NULL
    BEGIN
        RAISERROR('FirebaseToken cannot be null', 16, 1);
        RETURN 1;
    END
    DECLARE @Exists BIT;
    IF EXISTS (SELECT *
    FROM [dbo].[Users]
    WHERE [Users].UserName = @FirebaseToken)
        BEGIN
        SELECT @Exists = 1;
    END
    ELSE
        BEGIN
        SELECT @Exists = 0;
    END;
    SELECT @Exists;
END;