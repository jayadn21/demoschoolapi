USE [driveDB]
GO

/****** Object:  StoredProcedure [dbo].[usp_validateusernumberexists]    Script Date: 2/5/2019 12:15:01 PM ******/
DROP PROCEDURE [dbo].[usp_validateusernumberexists]
GO

/****** Object:  StoredProcedure [dbo].[usp_validateusernumberexists]    Script Date: 2/5/2019 12:15:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


/*
Select emailid from users
usp_validateemailidoruseridexists 'jon@gmail.com'
*/

CREATE PROCEDURE [dbo].[usp_validateusernumberexists]
	@phonenumber varchar(20),
	@userExists BIT output    
AS
BEGIN

SET NOCOUNT ON
	
	set @userExists = 0

	if exists (SELECT 1
	FROM users 
	WHERE userid=@phonenumber OR [phonenumber] = @phonenumber)
	BEGIN
		set @userExists = 1
		RETURN  @userExists
	END
	ELSE
	BEGIN
		RETURN  @userExists
	END			

END


GO


