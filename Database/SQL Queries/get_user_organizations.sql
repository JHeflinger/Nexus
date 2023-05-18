USE Nexus
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