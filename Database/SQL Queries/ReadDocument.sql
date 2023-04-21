USE Nexus;
GO

-- check if the procedure exists and drop it if it does
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'ReadDocument')
BEGIN
    DROP PROCEDURE ReadDocument;
END
GO


CREATE PROCEDURE ReadDocument
    @DocumentId INT,
    @DocumentData VARBINARY(MAX) OUTPUT
AS

BEGIN
    IF @DocumentId IS NULL
    BEGIN
        RAISERROR('DocumentId cannot be null', 16, 1);
        RETURN 1;
    END
    IF NOT EXISTS (SELECT * FROM dbo.Document WHERE DocumentId = @DocumentId)
    BEGIN
        RAISERROR('DocumentId does not exist', 16, 1);
        RETURN 2;
    END


    SELECT @DocumentData=DocumentData
    FROM dbo.Document
    WHERE DocumentId = @DocumentId;
END;