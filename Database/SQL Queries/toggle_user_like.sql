USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'ToggleUserLike')
BEGIN
    DROP PROCEDURE ToggleUserLike;
END
GO

CREATE PROCEDURE ToggleUserLike
    @Username VARCHAR(50),
    @docID INT
AS

BEGIN
    IF (@docID IS NULL OR @Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

	IF EXISTS (SELECT * FROM UserLikes WHERE UserLikes.UserName = @Username AND UserLikes.DocumentID = @docID)
	BEGIN
		DELETE FROM UserLikes
		WHERE UserLikes.UserName = @Username AND UserLikes.DocumentID = @docID
	END
	ELSE
	BEGIN
		INSERT INTO UserLikes (UserName, DocumentID)
		VALUES (@Username, @docID);
	END
END;
GO