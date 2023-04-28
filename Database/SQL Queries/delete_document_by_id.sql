USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'DeleteDocumentByID')
BEGIN
    DROP PROCEDURE DeleteDocumentByID;
END
GO

CREATE PROCEDURE DeleteDocumentByID
    @id INT
AS

BEGIN
    IF @id IS NULL
    BEGIN
        RAISERROR('Document ID cannot be null', 16, 1);
        RETURN 1;
    END

	IF EXISTS (SELECT * FROM UserOwns WHERE UserOwns.DocumentID = @id)
	BEGIN
		DELETE FROM UserOwns
		WHERE UserOwns.DocumentID = @id
	END

	IF EXISTS (SELECT * FROM OrganizationOwns WHERE OrganizationOwns.DocumentID = @id)
	BEGIN
		DELETE FROM OrganizationOwns
		WHERE OrganizationOwns.DocumentID = @id
	END

    DELETE FROM Document
	WHERE Document.DocumentID = @id
END;
GO