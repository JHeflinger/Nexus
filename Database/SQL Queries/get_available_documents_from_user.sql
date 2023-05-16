USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetAvailableDocumentsFromUser')
BEGIN
    DROP PROCEDURE GetAvailableDocumentsFromUser;
END
GO

CREATE PROCEDURE GetAvailableDocumentsFromUser
    @Username VARCHAR(50)
AS

BEGIN
    IF @Username IS NULL
    BEGIN
        RAISERROR('Username cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description]
	FROM UserOwns
	LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
	WHERE UserOwns.UserName = @Username

END;
GO