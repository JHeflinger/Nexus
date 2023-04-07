USE Nexus;

GO
    CREATE TABLE Document (
        DocumentID INT PRIMARY KEY,
        DocumentData VARBINARY(MAX)
    );