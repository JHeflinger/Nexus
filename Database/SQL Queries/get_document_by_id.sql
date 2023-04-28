USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetDocumentByID')
BEGIN
    DROP PROCEDURE GetDocumentByID;
END
GO

CREATE PROCEDURE GetDocumentByID
    @id INT
AS

BEGIN
    IF @id IS NULL
    BEGIN
        RAISERROR('Document ID cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT DocumentData
	FROM Document
	WHERE Document.DocumentID = @id
END;
GO