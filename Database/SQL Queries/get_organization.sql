USE Nexus
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