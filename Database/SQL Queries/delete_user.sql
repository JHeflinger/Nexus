USE Nexus
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