USE [driveDB]
GO

/****** Object:  StoredProcedure [dbo].[UserMaster]    Script Date: 2/5/2019 12:14:06 PM ******/
DROP PROCEDURE [dbo].[UserMaster]
GO

/****** Object:  StoredProcedure [dbo].[UserMaster] this is the branch    Script Date: 2/5/2019 12:14:06 PM ******/ 
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UserMaster] 
		    @fullname varchar(100)
           ,@upassword varchar(100)
           ,@phonenumber varchar(100)
           ,@dateofbirth datetime
           ,@userid varchar(100)
		   ,@who varchar(100)
		   ,@profilepic varchar(100)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	 Declare @currentimestamp datetime

	 SET @currentimestamp = GETDATE()
	 --SET @isAmountBalance 
	 Declare @sub_period as int
	 Declare @joiningdate as Datetime

	 SET @joiningdate = @currentimestamp

	
    IF NOT EXISTS (SELECT 1 FROM USERS WHERE phonenumber = @phonenumber OR userid = @phonenumber)
	BEGIN
		INSERT INTO [dbo].[users]
           (
            [fullname]
           ,[upassword]
           ,[roletype]
           ,[phonenumber]
           ,[dateofbirth]
           ,[createdby]
           ,[createdtimestamp]
           ,[userid]
           ,[ustatus]
           ,[otpmessage]
           ,[isotpverified]
		   ,[profilepic])
     VALUES
           (
			@fullname
           ,@upassword
           ,'User'
           ,@phonenumber
           ,@dateofbirth
           ,@who   
           ,@currentimestamp
           ,@userid
           ,'A'
		   ,'1122'
		   ,'N'
		   ,@profilepic)

	END
	ELSE 
	BEGIN
		UPDATE [dbo].[users]
			   SET 				   
				   [fullname] = @fullname				  
				  ,[phonenumber] = @phonenumber
				  ,[dateofbirth] = @dateofbirth
				  ,[updatedby] = @who
				  ,[updateddate] = @currentimestamp			  
			 WHERE phonenumber = @phonenumber OR userid = @phonenumber
	END
END
GO