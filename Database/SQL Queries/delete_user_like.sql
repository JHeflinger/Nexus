USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'DeleteUserLike')
BEGIN
    DROP PROCEDURE DeleteUserLike;
END
GO

CREATE PROCEDURE DeleteUserLike
    @Username VARCHAR(50),
    @docID INT
AS

BEGIN
    IF (@docID IS NULL OR @Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

	IF NOT EXISTS (SELECT * FROM UserLikes WHERE UserLikes.UserName = @Username AND UserLikes.DocumentID = @docID)
	BEGIN
		RAISERROR('user already does not like this', 16, 1);
		RETURN 2;
	END

	DELETE FROM UserLikes
	WHERE UserLikes.UserName = @Username AND UserLikes.DocumentID = @docID
END;
GO