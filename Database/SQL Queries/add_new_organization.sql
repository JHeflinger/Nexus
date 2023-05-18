USE Nexus
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddNewOrganization')
BEGIN
    DROP PROCEDURE AddNewOrganization;
END
GO

CREATE PROCEDURE AddNewOrganization
    @Username VARCHAR(50)
AS
BEGIN
	IF @Username IS NULL
    BEGIN
        RAISERROR('Username cannot be null', 16, 1);
        RETURN 1;
    END

	INSERT INTO Organization ([Name], DateOfCreation, [Description], JoinMethod)
	VALUES ('New Organization', GETDATE(), 'Add a description here.', 'free admin')

	INSERT INTO InAnOrganization(UserName, OrganizationID)
	VALUES(@Username, IDENT_CURRENT('Organization'))
END;
GO