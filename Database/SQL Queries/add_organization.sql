USE Nexus
GO
CREATE PROCEDURE [dbo].[AddOrganization]
	@name VARCHAR(20),
	@dateOfCreation DATE,
	@description VARCHAR(200),
	@joinmethod VARCHAR(50) -- check if join method is the exact correct strings later
AS
BEGIN
	IF (@name = NULL OR @dateOfCreation = NULL or @joinmethod = NULL)
	BEGIN
		PRINT 'ERROR: The only parameter that can be null is @description';
		RETURN (1)
	END
	INSERT INTO [Organization]([Name], DateOfCreation, [Description], JoinMethod)
	VALUES(@name, @dateOfCreation, @description, @joinmethod);
END
GO