USE Nexus
GO

DECLARE @returncode INT

-- test successful AddOrganization
EXEC @returncode = [dbo].[AddOrganization] 'People Republic', '10-10-2000', 'a lovely organization', 'PRIVATE'
SELECT @returncode AS ReturnValue

-- test unsuccessful AddOrganization - should return error due to null values
EXEC @returncode = [dbo].[AddOrganization] NULL, '10-10-2000', 'a lovely organization', NULL
SELECT @returncode AS ReturnValue

-- current test status PASS