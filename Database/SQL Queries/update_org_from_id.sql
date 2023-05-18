USE Nexus
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