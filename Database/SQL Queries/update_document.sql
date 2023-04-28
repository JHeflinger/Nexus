USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'UpdateUserDocument')
BEGIN
    DROP PROCEDURE UpdateDocument;
END
GO

CREATE PROCEDURE UpdateDocument
    @DocID INT,
	@DocumentData VARBINARY(MAX)
AS

BEGIN
    IF @DocID IS NULL
    BEGIN
        RAISERROR('DocumentID cannot be null', 16, 1);
        RETURN 1;
    END

	IF @DocumentData IS NULL
    BEGIN
        RAISERROR('Document Data cannot be null', 16, 1);
        RETURN 2;
    END

    UPDATE Document
	SET DocumentData = @DocumentData
	WHERE DocumentID = @DocID
END;
GO