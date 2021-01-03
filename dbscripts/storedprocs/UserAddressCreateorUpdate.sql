-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE UserAddressCreateorUpdate
	 @phonenumber varchar(20)
	,@address_name varchar(100)
	,@address_details varchar(100)
	,@nearest_land_mark varchar(100)
	,@visible_options varchar(20)
	,@house_picture varchar(100)
	,@astatus varchar(1)
	,@homepic varchar(100)
	,@who varchar(20)
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	IF NOT EXISTS (SELECT 1 FROM users_address WHERE address_name = @address_name AND phonenumber = @phonenumber)
	BEGIN
		INSERT INTO [dbo].[users_address]
			   ([phonenumber]
			   ,[address_name]
			   ,[address_details]
			   ,[nearest_land_mark]
			   ,[visible_options]
			   ,[house_picture]			   
			   ,[astatus]			   
			   ,[homepic]
			   ,[createdby]
			   ,[createdtimestamp])
		 VALUES
			   (@phonenumber
			   ,@address_name
			   ,@address_details
			   ,@nearest_land_mark
			   ,@visible_options
			   ,@house_picture			   
			   ,@astatus			   
			   ,@homepic
			   ,@who
			   ,GETDATE())
	END

END
GO
