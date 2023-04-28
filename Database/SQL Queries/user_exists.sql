SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
SET ANSI_NULLS ON;

USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'UserExists')
BEGIN
    DROP PROCEDURE UserExists;
END
GO

CREATE PROCEDURE UserExists
    @FirebaseToken VARCHAR(30)

AS
BEGIN
    IF @FirebaseToken IS NULL
    BEGIN
        RAISERROR('FirebaseToken cannot be null', 16, 1);
        RETURN 1;
    END
    DECLARE @Exists BIT;
    IF EXISTS (SELECT *
    FROM [dbo].[Users]
    WHERE [Users].UserName = @FirebaseToken)
        BEGIN
        SELECT @Exists = 1;
    END
    ELSE
        BEGIN
        SELECT @Exists = 0;
    END;
    SELECT @Exists;
END;