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
Create PROCEDURE [schooladmin].[InstitutionStudentCount]
	-- Add the parameters for the stored procedure here
	@InstitutionId int	
AS
BEGIN

SELECT count(*)
  FROM [schooladmin].[Student]
   WHERE InstitutionId = @InstitutionId and Active = 1

END

