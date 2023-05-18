USE Nexus
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

	SELECT *
	FROM Organization
	WHERE Organization.OrganizationID = @orgID
END
GO