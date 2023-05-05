USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetDocumentLikes')
BEGIN
    DROP PROCEDURE GetDocumentLikes;
END
GO

CREATE PROCEDURE GetDocumentLikes
    @docID INT
AS

BEGIN
    IF @docID IS NULL
    BEGIN
        RAISERROR('Document ID cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT COUNT(*) AS Likes
	FROM UserLikes
	WHERE UserLikes.DocumentID = @docID
END;
GO