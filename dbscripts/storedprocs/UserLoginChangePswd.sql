USE [SchoolProject]
GO
/****** Object:  StoredProcedure [schooladmin].[UserLoginChangePswd]    Script Date: 7/13/2019 9:43:49 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [schooladmin].[UserLoginChangePswd] 
	-- Add the parameters for the stored procedure here
	@UserName varchar(50), 
	@OldPassword varchar(50), 
	@NewPassword varchar(50),
	@Exists INT OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	

    IF EXISTS (SELECT 1 FROM UserLogin WHERE UserName = @UserName AND [Password] = @OldPassword)
	BEGIN	

	UPDATE UserLogin set [Password] = @NewPassword,
	 LastPassword = @OldPassword , LastPasswordChangedDate = sysdatetime()		  
 WHERE UserName = @UserName
SELECT @Exists = 1
 END
 ELSE
 BEGIN
            SELECT @Exists = 0
      END
 END
