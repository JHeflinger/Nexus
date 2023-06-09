USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetDoesUserLike')
BEGIN
    DROP PROCEDURE GetDoesUserLike;
END
GO

CREATE PROCEDURE GetDoesUserLike
    @Username VARCHAR(50),
    @docID INT
AS

BEGIN
    IF (@docID IS NULL OR @Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END
	DECLARE @foundLike BIT
	SET @foundLike = 0
    IF EXISTS (SELECT * FROM UserLikes WHERE UserLikes.UserName = @Username AND UserLikes.DocumentID = @docID)
	BEGIN
		SET @foundLike = 1
	END
	SELECT @foundLike AS FoundLike 
END;
GO