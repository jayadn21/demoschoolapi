USE [driveDB]
GO

/****** Object:  StoredProcedure [dbo].[usp_validateLogin]    Script Date: 2/5/2019 12:16:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[usp_validateLogin]
    @phonenumber VARCHAR(20),
    @password varchar(20)
AS
BEGIN

SET NOCOUNT ON

	Declare @profileExists as Bit
	Declare @expiryDate as datetime
	
	set @profileExists = 0

	if exists (SELECT 1
	FROM users_address 
	WHERE [phonenumber]=@phonenumber)
	BEGIN
		set @profileExists = 1
	END	

	SELECT fullname, [phonenumber], ISNULL(dateofbirth,0) as dateofbirth, 
		isotpverified, @profileExists as profileExists, createdtimestamp, DateAdd(DD, 7, createdtimestamp) as profileexpirytimestamp
	FROM users 
	WHERE [phonenumber]=@phonenumber AND upassword=@password

END


GO


