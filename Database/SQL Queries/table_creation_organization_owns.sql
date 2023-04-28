USE Nexus
GO

CREATE TABLE OrganizationOwns (
	OrganizationID INT NOT NULL,
	DocumentID INT NOT NULL,
	FOREIGN KEY (OrganizationID) REFERENCES Organization(OrganizationID),
	FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID)
);