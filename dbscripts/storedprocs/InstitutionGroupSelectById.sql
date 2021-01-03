USE [SchoolProject]
GO
/****** Object:  StoredProcedure [schooladmin].[InstitutionGroupSelectById]    Script Date: 7/12/2019 2:46:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [schooladmin].[InstitutionGroupSelectById]
-- Add the parameters for the stored procedure here	
			@Id int		
           
AS
BEGIN
SELECT [Id]
      ,[Name]
      ,[Address]
      ,[City]
      ,[District]
      ,[State]
      ,[Country]
      ,[Pincode]
      ,[Phone1]
      ,[Phone2]
      ,[Fax]
      ,[EmailId]
      ,[Logo]
      ,[WebsiteUrl]
      ,[FacebookUrl]
      ,[TwitterUrl]
      ,[InstagramUrl]
      ,[IsReadOnlyMode]
  FROM [schooladmin].[InstitutionGroup]
   WHERE Id = @Id
END
