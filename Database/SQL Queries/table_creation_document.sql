USE Nexus
GO

CREATE TABLE Document (
    DocumentID INT PRIMARY KEY IDENTITY(1,1),
    DocumentData VARBINARY(MAX),

);