USE Nexus;
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE type = 'P' AND name = 'GetAvailableDocumentsFromUser')
BEGIN
    DROP PROCEDURE GetAvailableDocumentsFromUser;
END
GO

CREATE PROCEDURE GetAvailableDocumentsFromUser
    @Username VARCHAR(50),
	@OrderBy VARCHAR(10) = 'activity',
	@DecendingOrder BIT = 0
AS

BEGIN
    IF @Username IS NULL
    BEGIN
        RAISERROR('Username cannot be null', 16, 1);
        RETURN 1;
    END

	IF (@OrderBy = 'activity')
	BEGIN
		IF (@DecendingOrder = 1)
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			WHERE UserOwns.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY Document.LastModified DESC
		END
		ELSE
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			WHERE UserOwns.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY Document.LastModified ASC
		END
	END
	ELSE IF (@OrderBy = 'views')
	BEGIN
		IF (@DecendingOrder = 1)
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			WHERE UserOwns.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY COUNT(UserViewed.DocumentID) DESC
		END
		ELSE
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			WHERE UserOwns.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY COUNT(UserViewed.DocumentID) ASC
		END
	END
	ELSE IF (@OrderBy = 'likes')
	BEGIN
		IF (@DecendingOrder = 1)
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			WHERE UserOwns.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY COUNT(UserLikes.DocumentID) DESC
		END
		ELSE
		BEGIN
			SELECT Document.DocumentID AS [ID], Document.DocumentName AS [Name], Document.[Description] AS [Description], Document.LastModified AS [Date], COUNT(UserViewed.DocumentID) AS [Views], COUNT(UserLikes.DocumentID) AS [Likes]
			FROM UserOwns
			LEFT JOIN Document ON Document.DocumentID = UserOwns.DocumentID
			LEFT JOIN UserViewed ON UserViewed.DocumentID = Document.DocumentID
			LEFT JOIN UserLikes ON UserLikes.DocumentID = Document.DocumentID
			WHERE UserOwns.UserName = @Username
			GROUP BY Document.DocumentID, Document.DocumentName, Document.[Description], Document.LastModified
			ORDER BY COUNT(UserLikes.DocumentID) ASC
		END
	END
	ELSE
	BEGIN
		RAISERROR('invalid order by argument', 16, 1)
		RETURN 2;
	END
END;
GO