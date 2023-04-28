USE Nexus
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