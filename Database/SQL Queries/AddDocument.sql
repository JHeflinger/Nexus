USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'AddDocument')
BEGIN
    DROP PROCEDURE AddDocument;
END
GO

CREATE PROCEDURE AddDocument
    @DocumentData VARBINARY(MAX)

AS

BEGIN
    IF @DocumentData IS NULL
    BEGIN
        RAISERROR('DocumentData cannot be null', 16, 1);
        RETURN 1;
    END
    INSERT INTO dbo.Document
        (DocumentData)
    VALUES
        (@DocumentData);
END;
GO