USE Nexus
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