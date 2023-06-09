USE Nexus
GO

CREATE TABLE UserCreated (
	UserName VARCHAR(30) NOT NULL,
	DataID INT NOT NULL,
	FOREIGN KEY (UserName) REFERENCES Users(UserName) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (DataID) REFERENCES UserInputtedData(DataID) ON DELETE CASCADE ON UPDATE CASCADE
);