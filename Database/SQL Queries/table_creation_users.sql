USE NexusTmp;
GO
	CREATE TABLE Users (
		UserName VARCHAR(20) PRIMARY KEY,
		FirstName VARCHAR(20),
		MiddleName VARCHAR(20),
		LastName VARCHAR(50),
		Password VARCHAR(50)
	);