CREATE USER [heflinjn]
FROM
    LOGIN [heflinjn];

exec sp_addrolemember 'db_owner',
'heflinjn';

GO