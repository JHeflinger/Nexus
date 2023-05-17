USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetDocumentTags')
BEGIN
    DROP PROCEDURE GetDocumentTags;
END
GO

CREATE PROCEDURE GetDocumentTags
    @docID INT
AS

BEGIN
    IF (@docID IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END
	
	SELECT Category.CategoryName AS [Tag]
	FROM InACategory
	JOIN Category ON InACategory.CategoryID = Category.CategoryID
	WHERE InACategory.DocumentID = @docID

END;
GO