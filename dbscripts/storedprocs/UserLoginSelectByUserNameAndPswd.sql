USE [SchoolProject]
GO
/****** Object:  StoredProcedure [schooladmin].[UserLoginSelectByUserNameAndPswd]    Script Date: 7/12/2019 2:22:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [schooladmin].[UserLoginSelectByUserNameAndPswd]
-- Add the parameters for the stored procedure here	
			@UserName varchar(50)
			,@Password varchar(50)           
AS
BEGIN

SELECT [Id]
      ,[EmailId]
	  ,[InstitutionGroupId]
      ,[RoleTypeId] = (SELECT UserType FROM [UserType] UT WHERE UT.Id = UL.RoleTypeId)
  FROM [schooladmin].[UserLogin] UL
  WHERE UserName = @UserName
  AND [Password] = @Password
END
