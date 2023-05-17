USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetUserAccountLikes')
BEGIN
    DROP PROCEDURE GetUserAccountLikes;
END
GO

CREATE PROCEDURE GetUserAccountLikes
    @Username VARCHAR(50)
AS

BEGIN
    IF (@Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END
	
	SELECT COUNT(UserOwns.UserName) AS [Likes]
	FROM UserOwns
	JOIN UserLikes ON UserLikes.DocumentID = UserOwns.DocumentID
	WHERE UserOwns.UserName = @Username
	GROUP BY UserOwns.UserName

END;
GO