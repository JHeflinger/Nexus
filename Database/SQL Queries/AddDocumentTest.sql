USE Nexus;
GO


DECLARE @BinaryVariable BINARY(2) = 0x1234;

EXEC AddDocument
@DocumentData = @BinaryVariable;
GO

EXEC AddDocument
@DocumentData = NULL;
GO