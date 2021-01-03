USE [SchoolProject]
GO
/****** Object:  StoredProcedure [schooladmin].[UserDefaultInstitution]    Script Date: 7/22/2019 6:49:12 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [schooladmin].[UserDefaultInstitution]
	-- Add the parameters for the stored procedure here
	@UserLoginId int	
AS
BEGIN
DECLARE @InstitutionId int
SELECT @InstitutionId = InstitutionId
  FROM [schooladmin].[InstitutionUserMapping]
   WHERE UserLoginId = @UserLoginId and IsDefault = 1


Exec  InstitutionSelectById @InstitutionId
END

