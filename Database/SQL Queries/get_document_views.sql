USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetDocumentViews')
BEGIN
    DROP PROCEDURE GetDocumentViews;
END
GO

CREATE PROCEDURE GetDocumentViews
    @docID INT,
	@views INT OUTPUT
AS

BEGIN
    IF @docID IS NULL
    BEGIN
        RAISERROR('Document ID cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT @views = Document.[Views]
	FROM Document
	WHERE Document.DocumentID = @docID
END;
GO