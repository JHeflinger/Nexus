USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddDocumentFromUser')
BEGIN
    DROP PROCEDURE AddDocumentFromUser;
END
GO

CREATE PROCEDURE AddDocumentFromUser
    @DocumentData VARBINARY(MAX),
	@Username VARCHAR(30)
AS

BEGIN
    IF @DocumentData IS NULL
    BEGIN
        RAISERROR('DocumentData cannot be null', 16, 1);
        RETURN 1;
    END

	IF @Username IS NULL
    BEGIN
        RAISERROR('Username cannot be null', 16, 1);
        RETURN 2;
    END

    INSERT INTO dbo.Document
        (DocumentData)
    VALUES
        (@DocumentData);

	DECLARE @docID INT
	SET @docID = SCOPE_IDENTITY()

	INSERT INTO dbo.UserOwns
		(UserName, DocumentID)
	VALUES
		(@Username, @docID)
END;
GO