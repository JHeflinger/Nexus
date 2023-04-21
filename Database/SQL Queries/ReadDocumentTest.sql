USE Nexus
GO

DECLARE @DocDataOutput VARBINARY(MAX);

EXEC ReadDocument
@DocumentId = 1,
@DocumentData = @DocDataOutput OUTPUT;
GO

DECLARE @DocDataOutput VARBINARY(MAX);


EXEC ReadDocument
@DocumentId = 9,
@DocumentData = @DocDataOutput OUTPUT;

PRINT 'Document Data at ID = 3:';
PRINT @DocDataOutput;
GO
