USE Nexus
GO

DECLARE @returncode INT

-- test successful AddUser
EXEC @returncode = [dbo].[DeleteUser] 'heflinjn'
SELECT @returncode AS ReturnValue

-- test unsuccessful AddUser - should return 2 due to user already being deleted
EXEC @returncode = [dbo].[DeleteUser] 'heflinjn'
SELECT @returncode AS ReturnValue

-- current test status PASS