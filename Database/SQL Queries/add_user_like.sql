USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddUserLike')
BEGIN
    DROP PROCEDURE AddUserLike;
END
GO

CREATE PROCEDURE AddUserLike
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
		RAISERROR('user already likes this', 16, 1);
		RETURN 2;
	END

	INSERT INTO UserLikes (UserName, DocumentID)
	VALUES (@Username, @docID);
END;
GO