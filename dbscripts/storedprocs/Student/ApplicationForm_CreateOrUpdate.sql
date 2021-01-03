ALTER PROCEDURE [schooladmin].[ApplicationForm_CreateOrUpdate] 
			@ApplicationNumber varchar(50)
			,@ApplicationDate datetime
			,@Name varchar(100)
           ,@InstitutionId int
           ,@FirstName varchar(50)
           ,@LastName varchar(50)
           ,@DateOfBirth datetime
           ,@AdmissionNo varchar(50)
           ,@AdmissionDate datetime
           ,@Gender varchar(10)
           ,@ReligionId int
           ,@CasteId int
           ,@SubCasteId int
           ,@ReservationCategoryId int
           ,@MediumId int
           ,@PresentAddress varchar(500)
           ,@PermanentAddress varchar(500)
           ,@PhoneNumber varchar(20)
           ,@ParentId int
           ,@BloodGroup varchar(10)
           ,@PhysicallyChallenged bit
           ,@PatternId int
           ,@CurrentClassSectionMediumId int
           ,@Active bit
           ,@UserName varchar(50)
           ,@EmailId varchar(254)
           ,@Password varchar(50)
           ,@UserTypeId int
           ,@AlternativePhoneNumber varchar(20)
		   ,@AcademicYearId int
 		   ,@ClassId int
 		   ,@FeesAcademicYearId int
			,@IncomeAccountId int
			,@Description varchar(254)
			,@FeesAccountId int
			,@PaymentMethodId int
			,@Amount int
			,@Status varchar(50)
AS
Begin
exec [schooladmin].[StudentCreateOrUpdate] 
@Name =@Name ,
@InstitutionId =@InstitutionId ,
@StudentCode = '',
@ApplicationNumber=@ApplicationNumber,
@FirstName=@FirstName,
@LastName=@LastName,
@DateOfBirth=@DateOfBirth,
@AdmissionNo=@AdmissionNo,
@AdmissionDate=@AdmissionDate,
@Gender=@Gender,
@ReligionId=@ReligionId,
@CasteId=@CasteId,
@SubCasteId=@SubCasteId,
@ReservationCategoryId=@ReservationCategoryId,
@MediumId=@MediumId,
@PresentAddress=@PresentAddress,
@PermanentAddress=@PermanentAddress,
@PhoneNumber=@PhoneNumber,
@ParentId=@ParentId,
@BloodGroup=@BloodGroup,
@PhysicallyChallenged=@PhysicallyChallenged,
@PatternId=@PatternId,
@CurrentClassSectionMediumId=@CurrentClassSectionMediumId,
@Active=@Active,
@UserName=@UserName,
@EmailId =@EmailId ,
@Password =@Password ,
@UserTypeId =@UserTypeId,
@AlternativePhoneNumber =@AlternativePhoneNumber,
		   @AcademicYearId =@AcademicYearId,
 		   @ClassId =@ClassId
End
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [ApplicationForm] WHERE ApplicationNumber = @ApplicationNumber)
	BEGIN
		INSERT INTO [schooladmin].[ApplicationForm] ([ApplicationNumber], [ApplicationDate], [InstitutionId], [AcademicYearId], [IncomeAccountId], [Description], [FeesAccountId], [PaymentMethodId], [Amount], [Status]) VALUES (@ApplicationNumber, @ApplicationDate, @InstitutionId, @FeesAcademicYearId, @IncomeAccountId, @Description, @FeesAccountId, @PaymentMethodId, @Amount, @Status);
		   
	END
	ELSE 
	BEGIN
	UPDATE [schooladmin].[ApplicationForm] SET [ApplicationNumber] = @ApplicationNumber, [ApplicationDate] = @ApplicationDate, [InstitutionId] = @InstitutionId, [AcademicYearId] = @FeesAcademicYearId, [IncomeAccountId] = @IncomeAccountId, [Description] = @Description, [FeesAccountId] = @FeesAccountId, [PaymentMethodId] = @PaymentMethodId, [Amount] = @Amount, [Status] = @Status WHERE ([ApplicationNumber] = @ApplicationNumber)
	END
END
