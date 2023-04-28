USE Nexus
GO

DECLARE @returncode INT

-- test successful DeleteOrganization
EXEC @returncode = [dbo].[DeleteOrganization] 1
SELECT @returncode AS ReturnValue

-- test unsuccessful DeleteOrganization - should return 2 due to org already being deleted
EXEC @returncode = [dbo].[DeleteOrganization] 1
SELECT @returncode AS ReturnValue

-- current test status PASS