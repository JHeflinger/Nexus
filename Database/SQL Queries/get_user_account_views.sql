USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetUserAccountViews')
BEGIN
    DROP PROCEDURE GetUserAccountViews;
END
GO

CREATE PROCEDURE GetUserAccountViews
    @Username VARCHAR(50)
AS

BEGIN
    IF (@Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END
	
	SELECT COUNT(UserOwns.UserName) AS [Views]
	FROM UserOwns
	JOIN UserViewed ON UserViewed.DocumentID = UserOwns.DocumentID
	WHERE UserOwns.UserName = @Username
	GROUP BY UserOwns.UserName

END;
GO