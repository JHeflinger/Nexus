USE Nexus
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