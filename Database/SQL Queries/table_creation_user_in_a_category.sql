USE Nexus
GO

CREATE TABLE InACategory (
	DocumentID INT NOT NULL,
	CategoryID INT NOT NULL,
	FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID),
	FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);