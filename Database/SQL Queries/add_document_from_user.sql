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
    @DocumentData VARBINARY(MAX),
	@Username VARCHAR(30),
	@DocumentName VARCHAR(100)
AS

BEGIN
    IF (@DocumentData IS NULL OR @Username IS NULL OR @DocumentName IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

    INSERT INTO dbo.Document
        (DocumentData, DocumentName, [Views])
    VALUES
        (@DocumentData, @DocumentName, 0);

	DECLARE @docID INT
	SET @docID = SCOPE_IDENTITY()

	INSERT INTO dbo.UserOwns
		(UserName, DocumentID)
	VALUES
		(@Username, @docID)
END;
GO