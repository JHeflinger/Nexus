USE Nexus
GO

DECLARE @returncode INT

-- test successful AddUser
EXEC @returncode = [dbo].[AddUser] 'heflinjn', 'Jason', 'Nam Quan', 'Heflinger', 'insecure_password_123'
SELECT @returncode AS ReturnValue

-- test unsuccessful AddUser - should return 2 due to duplicate user
EXEC @returncode = [dbo].[AddUser] 'heflinjn', 'Jason', 'Nam Quan', 'Heflinger', 'insecure_password_123'
SELECT @returncode AS ReturnValue

-- test unsuccessful AddUser - should return error due to null values
EXEC @returncode = [dbo].[AddUser] 'failure', NULL, NULL, NULL, NULL
SELECT @returncode AS ReturnValue

-- current test status FAIL