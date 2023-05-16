USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetFileByID')
BEGIN
    DROP PROCEDURE GetFileByID;
END
GO

CREATE PROCEDURE GetFileByID
    @docID INT
AS

BEGIN
    IF @docID IS NULL
    BEGIN
        RAISERROR('Document ID cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT 
            Document.DocumentName,
            Document.DocumentData,
            Document.Description,
            Document.LastModified,
            Document.DateOfCreation,
            Document.Annotations
	FROM Document
	WHERE Document.DocumentID = @docID;
END;
GO