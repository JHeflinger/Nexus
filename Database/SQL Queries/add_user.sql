USE Nexus
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