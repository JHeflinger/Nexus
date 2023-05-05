USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetUserFileIDS')
BEGIN
    DROP PROCEDURE GetUserFileIDS;
END
GO

CREATE PROCEDURE GetUserFileIDS
    @Username VARCHAR(30)
AS

BEGIN
    IF @Username IS NULL
    BEGIN
        RAISERROR('Username cannot be null', 16, 1);
        RETURN 1;
    END

    SELECT DocumentID, DocumentName
	FROM Document
	LEFT JOIN UserOwns ON UserOwns.DocumentID = Document.DocumentID
	WHERE UserOwns.UserName = @Username
END;
GO