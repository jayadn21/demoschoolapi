USE [SchoolProject]
GO
/****** Object:  StoredProcedure [schooladmin].[InstitutionGroupDetails]    Script Date: 7/12/2019 4:24:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [schooladmin].[InstitutionGroupDetails]
-- Add the parameters for the stored procedure here	
			@Id int
AS
BEGIN

Exec  InstitutionGroupSelectById @Id

Exec InstitutionSelectByInstitutionGroupId @Id

END