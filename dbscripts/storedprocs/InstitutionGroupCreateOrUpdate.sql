USE [SchoolProject]
GO
/****** Object:  StoredProcedure [schooladmin].[InstitutionGroupCreateOrUpdate]    Script Date: 7/19/2019 5:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================

ALTER PROCEDURE [schooladmin].[InstitutionGroupCreateOrUpdate]
	-- Add the parameters for the stored procedure here
			@Id int
	    	,@Name varchar(200)
           ,@Address varchar(500)
           ,@City varchar(200)
           ,@District varchar(200)
           ,@State varchar(200)
           ,@Country varchar(200)
           ,@Pincode int
           ,@Phone1 varchar(15)
           ,@Phone2 varchar(15)
           ,@Fax varchar(15)
           ,@EmailId varchar(200)
           ,@Logo varchar(200)
           ,@WebsiteUrl varchar(200)
           ,@FacebookUrl varchar(200)
           ,@TwitterUrl varchar(200)
           ,@InstagramUrl varchar(200)
           ,@IsReadOnlyMode bit

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM InstitutionGroup WHERE Id = @Id)
	BEGIN	

INSERT INTO [schooladmin].[InstitutionGroup]
           ([Name]
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
           ,[IsReadOnlyMode])
     VALUES
           (@Name
           ,@Address
           ,@City
           ,@District
           ,@State
           ,@Country
           ,@Pincode
           ,@Phone1
           ,@Phone2
           ,@Fax
           ,@EmailId
           ,@Logo
           ,@WebsiteUrl
           ,@FacebookUrl
           ,@TwitterUrl
           ,@InstagramUrl
           ,@IsReadOnlyMode)
	END
	ELSE 
	BEGIN

	UPDATE [schooladmin].[InstitutionGroup]
   SET [Name] = @Name
      ,[Address] = @Address
      ,[City] = @City
      ,[District] = @District
      ,[State] = @State
      ,[Country] = @Country
      ,[Pincode] = @Pincode
      ,[Phone1] = @Phone1
      ,[Phone2] = @Phone2
      ,[Fax] = @Fax
      ,[EmailId] = @EmailId
      ,[Logo] = @Logo
      ,[WebsiteUrl] = @WebsiteUrl
      ,[FacebookUrl] = @FacebookUrl
      ,[TwitterUrl] = @TwitterUrl
      ,[InstagramUrl] = @InstagramUrl
      ,[IsReadOnlyMode] = @IsReadOnlyMode
 WHERE Id = @Id
END
END