USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddDocumentView')
BEGIN
    DROP PROCEDURE AddDocumentView;
END
GO

CREATE PROCEDURE AddDocumentView
    @docID INT
AS

BEGIN
    IF (@docID IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

	IF NOT EXISTS (SELECT * FROM Document WHERE Document.DocumentID = @docID)
	BEGIN
		RAISERROR('document does not exist', 16, 1);
		RETURN 2;
	END

	UPDATE Document
    SET [Views] = [Views] + 1
    WHERE DocumentID = @docid;
END;
GO