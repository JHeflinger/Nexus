USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'UpdateDocument')
BEGIN
    DROP PROCEDURE UpdateDocument;
END
GO

CREATE PROCEDURE UpdateDocument
    @DocID INT,
	@DocumentName VARCHAR(100),
	@Description VARCHAR(2000),
    @Annotation VARBINARY(MAX)
AS

BEGIN
    IF (@DocID IS NULL OR @DocumentName IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

    UPDATE Document
	SET Document.DocumentName = @DocumentName,
        Document.[Description] = @Description,
        Document.Annotations = @Annotation
	WHERE DocumentID = @DocID;
END;
GO