USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddDocumentTag')
BEGIN
    DROP PROCEDURE AddDocumentTag;
END
GO

CREATE PROCEDURE AddDocumentTag
    @docID INT,
	@tag VARCHAR(20)
AS

BEGIN
    IF (@docID IS NULL OR @tag IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END
	
	IF NOT EXISTS (SELECT * FROM Category WHERE Category.CategoryName = @tag)
	BEGIN
		INSERT INTO Category (CategoryName, [Description])
		VALUES(@tag, '');
	END

	DECLARE @tagID INT
	SELECT @tagID = Category.CategoryID
	FROM Category
	WHERE Category.CategoryName = @tag

	IF NOT EXISTS (SELECT * FROM InACategory WHERE InACategory.DocumentID = @docID AND InACategory.CategoryID = @tagID)
	BEGIN
		INSERT INTO InACategory (DocumentID, CategoryID)
		VALUES(@docID, @tagID)
	END

END;
GO