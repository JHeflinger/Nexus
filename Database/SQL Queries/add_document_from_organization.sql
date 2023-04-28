USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddDocumentFromOganization')
BEGIN
    DROP PROCEDURE AddDocumentFromOganization;
END
GO

CREATE PROCEDURE AddDocumentFromOganization
    @DocumentData VARBINARY(MAX),
	@OrgID VARCHAR(20)
AS

BEGIN
    IF @DocumentData IS NULL
    BEGIN
        RAISERROR('DocumentData cannot be null', 16, 1);
        RETURN 1;
    END

	IF @OrgID IS NULL
    BEGIN
        RAISERROR('Organization ID cannot be null', 16, 1);
        RETURN 2;
    END

    INSERT INTO dbo.Document
        (DocumentData)
    VALUES
        (@DocumentData);

	DECLARE @docID INT
	SET @docID = SCOPE_IDENTITY()

	INSERT INTO dbo.OrganizationOwns
		(OrganizationID, DocumentID)
	VALUES
		(@OrgID, @docID)
END;
GO