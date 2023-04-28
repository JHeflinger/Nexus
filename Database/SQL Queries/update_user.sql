USE Nexus
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