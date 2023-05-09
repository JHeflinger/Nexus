USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddUserViewed')
BEGIN
    DROP PROCEDURE AddUserViewed;
END
GO

CREATE PROCEDURE AddUserViewed
    @Username VARCHAR(50),
    @docID INT
AS

BEGIN
    IF (@docID IS NULL OR @Username IS NULL)
    BEGIN
        RAISERROR('params cannot be null', 16, 1);
        RETURN 1;
    END

	IF EXISTS (SELECT * FROM UserViewed WHERE UserViewed.UserName = @Username AND UserViewed.DocumentID = @docID)
	BEGIN
		RAISERROR('user already likes this', 16, 1);
		RETURN 2;
	END

	INSERT INTO UserViewed (UserName, DocumentID)
	VALUES (@Username, @docID);
END;
GO