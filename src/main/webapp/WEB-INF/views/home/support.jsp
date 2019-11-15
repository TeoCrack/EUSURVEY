<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html>

<head>
<title>EUSurvey - <spring:message code="label.Support" />
</title>
	<%@ include file="../includes.jsp" %>	
	
	<script type="text/javascript">
		function checkAndSubmit()
		{
			$(".validation-error").remove();
			var result = validateInput($("#supportForm"));
			
			 if ($(".g-recaptcha.unset").length > 0)	{
				$('#runner-captcha-error').show();
				return;
			 }
			
			if (result == false)
			{
				goToFirstValidationError($("#supportForm"));
			} else {
				$("#supportForm").submit();
			}			
		}
		
		function showHideAdditionalInfo()
		{
			if ($("#erroroption").is(":selected"))
			{
				$("#additionalinfodiv").show();
			} else {
				$("#additionalinfodiv").hide();
			}
		}
	
		function toggleAdditionalInfo(checkbox)
		{
			if ($(checkbox).is(":checked"))
			{
				$("#additionalinfo").removeAttr("readonly");
			} else {
				$("#additionalinfo").prop("readonly", "readonly");
			}
		}
		
		function deleteUploadedFile(button)
		{
			var uid = $(button).closest(".uploadedfile").attr("data-id");
			var request = $.ajax({
				  url: contextpath + "/home/support/deletefile",
				  data: {uid : uid},
				  cache: false,
				  dataType: "json",
				  success: function(data)
				  {
					  if (!data.success)
					  {
						showError("the file could not be deleted from the server");			 
					  } else {
						  $(button).closest(".uploadedfile").remove();
						  
						  if ($(".uploadedfile").length < 2)
				    	  {
				    		$("#file-uploader-support").show();
				    	  }
					  }		
				  }
				});
		}
		
		$(function() {
			$("[data-toggle]").tooltip();
			showHideAdditionalInfo();
			
			var uploader = new qq.FileUploader({
			    element: $("#file-uploader-support")[0],
			    action: contextpath + '/home/support/uploadfile',
			    uploadButtonText: selectFileForUpload,
			    params: {
			    	'_csrf': csrftoken
			    },
			    multiple: false,
			    cache: false,
			    sizeLimit: 1048576,
			    onComplete: function(id, fileName, responseJSON)
				{
			    	if (responseJSON.success)
			    	{
			    		$("#file-uploader-support-div").append("<div class='uploadedfile' data-id='" + responseJSON.uid + "'>" + responseJSON.name + "<a onclick='deleteUploadedFile(this)'><span class='glyphicon glyphicon-trash'></span></a><input type='hidden' name='uploadedfile' value='" + responseJSON.uid + "' /></div>")
				    	$("#file-uploader-support-div").show();
			    		
			    		if ($(".uploadedfile").length > 1)
			    		{
			    			$("#file-uploader-support").hide();
			    		}
			    	} else {
			    		showError(invalidFileError);
			    	}
				},
				showMessage: function(message){
					$("#file-uploader-support").append("<div class='validation-error'>" + message + "</div>");
				},
				onUpload: function(id, fileName, xhr){
					$("#file-uploader-support").find(".validation-error").remove();			
				}
			});
			
			$(".qq-upload-button").addClass("btn btn-default").removeClass("qq-upload-button");
			$(".qq-upload-list").hide();
			$(".qq-upload-drop-area").css("margin-left", "-1000px");
			
			<c:if test="${messagesent != null}">
				showInfo('<spring:message code="support.messagesent" />')
			</c:if>
			
		});
	</script>
	
	<style type="text/css">
		.uploadedfile {
			margin-top: 10px;
		}
		
		.uploadedfile a {
			color: #f00;
			margin-left: 15px;
		}
	</style>
	
	<c:if test="${runnermode != null }">
		<script type="text/javascript">
			$(function() {
				 $(".headerlink, .header a").each(function(){
					 if ($(this).attr("href").indexOf("?") == -1)
					$(this).attr("href", $(this).attr("href") + "/runner");
				 });
			});
		</script>
	</c:if>
</head>

<body id="bodyHelpSupport">

	<%@ include file="../header.jsp" %>		

	<c:choose>
		<c:when test="${USER != null && runnermode == null && responsive == null}">
			<%@ include file="../menu.jsp" %>	
			<div class="page" style="margin-top: 110px">
		</c:when>
		<c:when test="${responsive != null}">
			<div class="page"
				style="margin-top: 40px; width: 100%; padding: 10px;">
		</c:when>
		<c:otherwise>
			<div class="page" style="margin-top: 40px">
		</c:otherwise>
	</c:choose>	
	
		<div class="pageheader">
		<h1>
			<spring:message code="label.Support" />
		</h1>
		</div>
	<c:choose>
		<c:when test="${oss}">
			<spring:message code="support.oss.text" />
		</c:when>
		<c:otherwise>
			<spring:message code="support.checkfaq" arguments="${contextpath}/home/documentation" />	<br /><br />
			
			<form:form id="supportForm" method="POST" action="${contextpath}/home/support?${_csrf.parameterName}=${_csrf.token}" enctype="multipart/form-data" modelAttribute="form">
				<label><span class="mandatory">*</span><spring:message code="support.ContactReason" /></label><br />
				<select class="form-control" onchange="showHideAdditionalInfo()" style="max-width: 400px" name="contactreason">			
					<c:choose>
						<c:when test="${fromerrorpage != null}">
							<option><spring:message code="support.GeneralQuestion" /></option>
							<option><spring:message code="support.idea" /></option>
							<option id="erroroption" selected="selected"><spring:message code="support.problem" /></option>
							<option><spring:message code="support.GDPR" /></option>
							<option><spring:message code="support.otherreason" /></option>
						</c:when>
						<c:otherwise>
							<option selected="selected"><spring:message code="support.GeneralQuestion" /></option>
							<option><spring:message code="support.idea" /></option>
							<option id="erroroption"><spring:message code="support.problem" /></option>
							<option><spring:message code="support.GDPR" /></option>
							<option><spring:message code="support.otherreason" /></option>
						</c:otherwise>				
					</c:choose>
				</select><br /><br />
				
				<label><span class="mandatory">*</span><spring:message code="label.yourname" /></label><br />
				<input type="text" class="form-control required" name="name" value='${USER != null ? USER.getFirstLastName() : "" }' /><br /><br />
				
				<label><span class="mandatory">*</span><spring:message code="label.youremail" /></label> <span class="helptext">(<spring:message code="support.forlatercontact" />)</span><br />
				<input type="text" class="form-control required email" id="supportemail" name="email" value='${USER != null ? USER.getEmail() : "" }' /><br /><br />
				
				<label><span class="mandatory">*</span><spring:message code="support.subject" /></label><br />
				<input type="text" class="form-control required" name="subject" /><br /><br />
						
				<label><span class="mandatory">*</span><spring:message code="support.yourmessagetous" /></label>
				<div class="helptext"><spring:message code="support.yourmessagetoushelp" /></div>
				<textarea class="form-control required" rows="10" name="message"></textarea><br /><br />
				
				<div id="additionalinfodiv">
					<label><spring:message code="support.additionalinfo" /></label>
					<div class="helptext"><spring:message code="support.additionalinfohelp" /></div>
					<textarea class="form-control" rows="6" name="additionalinfo" id="additionalinfo" readonly="readonly">${additionalinfo}</textarea>
					<input type="checkbox" onclick="toggleAdditionalInfo(this)" /> <spring:message code="label.ClickToEdit" /><br /><br />
				</div>
						
				<label><spring:message code="support.upload" /></label>
				<a data-toggle="tooltip" title="<spring:message code="support.maxfilesize" />"><span class="glyphicon glyphicon-question-sign"></span></a>
				<div id="file-uploader-support"></div>
				<div id="file-uploader-support-div"></div>
				
				<div class="captcha" style="margin-left: 0px; margin-bottom: 20px; margin-top: 40px;">			
					<c:if test="${!captchaBypass}">
					<%@ include file="../captcha.jsp" %>					
					</c:if>
		       	</div>
		       	<span id="error-captcha" class="validation-error hideme">
		       		<c:if test="${!captchaBypass}">
		       		<spring:message code="message.captchawrongnew" />
		       		</c:if>
		       	</span>
		       	
		       	<div style="text-align: center; margin: 50px;">
		       		<a class="btn btn-info" onclick="checkAndSubmit()"><spring:message code="label.Submit" /></a>
		       	</div>
		    </form:form>
	    </c:otherwise>
	</c:choose>
	</div>

	<%@ include file="../footer.jsp" %>
	<%@ include file="../generic-messages.jsp" %>
</body>

</html>