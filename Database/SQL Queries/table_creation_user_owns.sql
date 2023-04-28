USE Nexus
GO

CREATE TABLE UserOwns (
	UserName VARCHAR(20) NOT NULL,
	DocumentID INT NOT NULL,
	FOREIGN KEY (UserName) REFERENCES Users(UserName),
	FOREIGN KEY (DocumentID) REFERENCES Document(DocumentID)
);