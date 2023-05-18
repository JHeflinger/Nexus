USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddDocumentFromUser')
BEGIN
    DROP PROCEDURE AddDocumentFromUser;
END
GO

CREATE PROCEDURE AddDocumentFromUser
    @UID VARCHAR(50),
    @DocumentData VARBINARY(MAX),
    @DocumentName VARCHAR(100),
    @Desc VARCHAR(2000),
    @LastModified DATE,
    @DateOfCreation DATE,
    @Annotations VARBINARY(MAX),
	@OrgID INT = -1
AS

BEGIN
    IF (@DocumentData IS NULL OR @UID IS NULL OR @DocumentName IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

    INSERT INTO dbo.Document
        (DocumentData, DocumentName, [Description], LastModified, DateOfCreation, Annotations)
    VALUES
        (@DocumentData, @DocumentName, @Desc, @LastModified, @DateOfCreation, @Annotations);

    DECLARE @docID INT;
    SET @docID = SCOPE_IDENTITY();

    INSERT INTO dbo.UserOwns
        (UserName, DocumentID)
    VALUES
        (@UID, @docID);

	IF (@OrgID != -1)
	BEGIN
		INSERT INTO OrganizationOwns (OrganizationID, DocumentID)
		VALUES(@OrgID, @docID)
	END
END;
GO