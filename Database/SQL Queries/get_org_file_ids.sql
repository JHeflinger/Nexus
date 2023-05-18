USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetOrgFileIDs')
BEGIN
    DROP PROCEDURE GetOrgFileIDs;
END
GO

CREATE PROCEDURE GetOrgFileIDs
    @orgID VARCHAR(50)
AS

BEGIN
    IF @orgID IS NULL
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT Document.DocumentID, Document.DocumentName
	FROM Document
	LEFT JOIN OrganizationOwns ON OrganizationOwns.DocumentID = Document.DocumentID
	WHERE OrganizationOwns.OrganizationID = @orgID
END;
GO