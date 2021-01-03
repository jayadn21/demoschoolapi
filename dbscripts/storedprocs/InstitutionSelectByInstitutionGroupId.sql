USE [SchoolProject]
GO
/****** Object:  StoredProcedure [schooladmin].[InstitutionSelectByInstitutionGroupId]    Script Date: 7/12/2019 2:44:49 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [schooladmin].[InstitutionSelectByInstitutionGroupId]
-- Add the parameters for the stored procedure here	
			@InstitutionGroupId int
AS
BEGIN
SELECT [Id]
      ,[InstitutionGroupId]
      ,[Name]
      ,[Address]
      ,[City]
      ,[District]
      ,[State]
      ,[Country]
      ,[Pincode]
      ,[TeachingMedium]
      ,[Phone1]
      ,[Phone2]
      ,[EmailId]
      ,[Fax]
      ,[Logo]
      ,[DiseNumber]
  FROM [schooladmin].[Institution]
   WHERE InstitutionGroupId = @InstitutionGroupId
END
