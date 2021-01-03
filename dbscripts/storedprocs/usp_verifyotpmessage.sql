USE [driveDB]
GO

/****** Object:  StoredProcedure [dbo].[usp_verifyotpmessage]    Script Date: 2/5/2019 12:15:01 PM ******/
DROP PROCEDURE [dbo].[usp_verifyotpmessage]
GO

/****** Object:  StoredProcedure [dbo].[usp_verifyotpmessage]    Script Date: 2/5/2019 12:15:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


/*
Select emailid from users
usp_validateemailidoruseridexists 'jon@gmail.com'
*/

CREATE PROCEDURE [dbo].[usp_verifyotpmessage]
	@phonenumber varchar(20),
    @otpmessage varchar(20),
	@userVerify BIT output    
AS
BEGIN

SET NOCOUNT ON
	
	set @userVerify = 0

	if exists (SELECT 1
	FROM users 
	WHERE [phonenumber] = @phonenumber and [otpmessage] = @otpmessage)
	BEGIN
		set @userVerify = 1
		RETURN  @userVerify
	END
	ELSE
	BEGIN
		RETURN  @userVerify
	END			

END


GO


