USE Nexus
GO

DECLARE @returncode INT
CREATE TABLE #tempUsers
(
    UserName NVARCHAR(20),
    FirstName NVARCHAR(20),
    MiddleName NVARCHAR(20),
    LastName NVARCHAR(50),
    [Password] NVARCHAR(50)
)

-- test successful GetUser
INSERT INTO #tempUsers
EXEC @returncode = [dbo].[GetUser] 'heflinjn'
SELECT * FROM #tempUsers

-- test unsuccessful GetUser - user should not exist
INSERT INTO #tempUsers
EXEC @returncode = [dbo].[GetUser] 'invalidusername123123123'
SELECT @returncode AS ReturnCode

-- test unsuccessful GetUser - user cannot be null
INSERT INTO #tempUsers
EXEC @returncode = [dbo].[GetUser] NULL
SELECT @returncode AS ReturnCode

DROP TABLE #tempUsers

-- test status PASS