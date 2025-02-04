function getElementViewModel(element)
{
	if (element.hasOwnProperty("isViewModel") && element.isViewModel)
	{
		return element;
	}
	
	switch (element.type)
	{
		case 'Section':
			return newSectionViewModel(element);
		case 'GalleryQuestion':
			return newGalleryViewModel(element);
		case 'Text':
			return newTextViewModel(element);
		case 'Image':
			return newImageViewModel(element);
		case 'Ruler':
			return newRulerViewModel(element);
		case 'FreeTextQuestion':
			return newFreeTextViewModel(element);
		case 'RegExQuestion':
			return newRegExViewModel(element);
		case 'SingleChoiceQuestion':
			return newSingleChoiceViewModel(element);
		case 'MultipleChoiceQuestion':
			return newMultipleChoiceViewModel(element);
		case 'NumberQuestion':
			return newNumberViewModel(element);
		case 'DateQuestion':
			return newDateViewModel(element);
		case 'TimeQuestion':
			return newTimeViewModel(element);
		case 'EmailQuestion':
			return newEmailViewModel(element);
		case 'Matrix':
			return newMatrixViewModel(element);
		case 'Table':
			return newTableViewModel(element);
		case 'Confirmation':
			return newConfirmationViewModel(element);
		case 'RatingQuestion':
			return newRatingViewModel(element);
		case 'Upload':
			return newUploadViewModel(element);
		case 'Download':
			return newDownloadViewModel(element);
	} 
}

function addElement(element, foreditor, forskin)
{
	var id;
	var uniqueId;
	if (element.hasOwnProperty("isViewModel") && element.isViewModel)
	{
		id = element.id()
		uniqueId = element.uniqueId();
	} else {
		id = element.id;
		uniqueId = element.uniqueId;
	}
	var container = $(".emptyelement[data-id=" + id + "]");
	$(container).removeClass("emptyelement").empty();
	
	addElementToContainer(element, container, foreditor, forskin);
	
	if ($(container).hasClass("matrixitem"))
	{
		$(container).find(".matrix-question.untriggered").each(function(){
			if (isTriggered(this, true))
			{
				$(this).removeClass("untriggered").show();
			}
		});
	}
	
	var validation = getValidationMessageByQuestion(uniqueId);
	if (validation.length > 0)
	{
		$(container).append('<div style="color: #f00" class="validation-error-server">' + validation + '</div>');
	}
	
	if (!foreditor && doAnswersExist())
	{       
 		checkTriggersAfterLoad(container);
 	 		                
 	 	//dependent matrix rows
 	 	$(container).find(".matrix-question.untriggered").each(function(){
 	 		checkTriggersAfterLoad(this);
 	 	});     
 	 }
	
	return container;
}

function checkTriggersAfterLoad(container)
{
	var dtriggers = $(container).attr("data-triggers");
	if (typeof dtriggers !== typeof undefined && dtriggers !== false && dtriggers.length > 0) {
		var triggers = dtriggers.split(";")
		for (var i = 0; i < triggers.length; i++) {
			if (triggers[i].length > 0)
			{
				if (triggers[i].indexOf("|") > -1) {
					//matrix cell
					checkDependenciesAsync($("[data-cellid='" + triggers[i] + "']")[0]);
				} else {
					//radio/checkbox/listbox/selectbox
					checkDependenciesAsync($("#" + triggers[i])[0]);
				}
			}
		}
	}
}

function addElementToContainer(element, container, foreditor, forskin)
{
	var viewModel = getElementViewModel(element);
	
	viewModel.foreditor = foreditor;
	viewModel.ismobile = false;
	viewModel.isresponsive = false;
	viewModel.istablet = false;
	
	try {
	
		if (isresponsive)
		{
			var isMobile = window.matchMedia("only screen and (max-width: 760px)");	
			viewModel.ismobile = isMobile.matches;
			
			var isResponsive = window.matchMedia("only screen and (max-width: 1000px)");	
			viewModel.isresponsive = isResponsive.matches;
			
			viewModel.istablet = isResponsive.matches && !isMobile.matches;
		}
	
	} catch (e) {}
	
	if (viewModel.type == 'Section')
	{
		$(container).addClass("sectionitem");
		var s = $("#section-template").clone().attr("id","");	
		$(container).append(s);
	} else if (viewModel.type == 'Text')
	{
		$(container).addClass("textitem");
		var s = $("#text-template").clone().attr("id","");	
		$(container).append(s);
	} else if (viewModel.type == 'Image')
	{
		$(container).addClass("imageitem");
		var s = $("#image-template").clone().attr("id","");
		$(container).append(s);
	} else if (viewModel.type == 'Ruler')
	{
		$(container).addClass("ruleritem");
		var s = $("#ruler-template").clone().attr("id","");
		$(container).append(s);
	} else if (viewModel.type == 'FreeTextQuestion' || viewModel.type == 'RegExQuestion')
	{
		if (viewModel.type == 'RegExQuestion')
		{
			$(container).addClass("regexitem");
		} else {
			$(container).addClass("freetextitem");
		}
		
		if (viewModel.isPassword())
		{
			var s = $("#password-template").clone().attr("id","");			
			$(container).append(s);
		} else {
			var s = $("#freetext-template").clone().attr("id","");			
			$(container).append(s);
		}		
	} else if (viewModel.type == 'NumberQuestion') {
		$(container).addClass("numberitem");
		var s = $("#number-template").clone().attr("id","");			
		$(container.append(s));		
	} else if (viewModel.type == 'SingleChoiceQuestion') {
		$(container).addClass("singlechoiceitem");
		var s = $("#single-choice-template").clone().attr("id","");			
		$(container).append(s);				
	} else if (viewModel.type == 'MultipleChoiceQuestion') {
		$(container).addClass("multiplechoiceitem");
		var s = $("#multiple-choice-template").clone().attr("id","");			
		$(container).append(s);			
	} else if (viewModel.type == 'DateQuestion') {
		$(container).addClass("dateitem");
		var s = $("#date-template").clone().attr("id","");
		$(container.append(s));
	} else if (viewModel.type == 'TimeQuestion') {
		$(container).addClass("timeitem");
		var s = $("#time-template").clone().attr("id","");
		$(container.append(s));
	} else if (viewModel.type == 'EmailQuestion') {
		$(container).addClass("emailitem");
		var s = $("#email-template").clone().attr("id","");			
		$(container.append(s));
	} else if (viewModel.type == 'Matrix') {
		$(container).addClass("matrixitem");
		var s = $("#matrix-template").clone().attr("id","");			
		$(container.append(s));		
	} else if (viewModel.type == 'Table') {
		$(container).addClass("mytableitem");
		var s = $("#table-template").clone().attr("id","");	
		$(container.append(s));
	} else if (viewModel.type == 'Upload') {
		$(container).addClass("uploaditem");
		var s = $("#upload-template").clone().attr("id","");
		$(container.append(s));
	} else if (viewModel.type == 'Download') {
		$(container).addClass("downloaditem");
		var s = $("#download-template").clone().attr("id","");			
		$(container.append(s));
	} else if (viewModel.type == 'GalleryQuestion') {
		$(container).addClass("galleryitem");
		var s = $("#gallery-template").clone().attr("id","");			
		$(container.append(s));		
	} else if (viewModel.type == 'Confirmation') {
		$(container).addClass("confirmationitem");
		var s = $("#confirmation-template").clone().attr("id","");			
		$(container.append(s));
	} else if (viewModel.type == 'RatingQuestion') {
		$(container).addClass("ratingitem");
		var s = $("#rating-template").clone().attr("id","");			
		$(container.append(s));
	}
	
	ko.applyBindings(viewModel, $(container)[0]);

	if (viewModel.type == 'Upload') {
		$(container).find(".file-uploader").each(function() {
			createUploader(this, viewModel.maxFileSize());
		});
		
		$(container).find(".qq-upload-button").addClass("btn btn-default").removeClass("qq-upload-button");
		$(container).find(".qq-upload-drop-area").css("margin-left", "-1000px");
		$(container).find(".qq-upload-list").hide();
	} else if (element.type == 'DateQuestion') {
		$(container).find(".datepicker").each(function(){			
			createDatePicker(this);						
		});
	} else if (element.type == 'Confirmation') {
		if (getValueByQuestion(viewModel.uniqueId()) == 'on')
		{
			$(container).find("input").first().prop("checked", "checked");
		}
	} else if (viewModel.type == 'GalleryQuestion' && !viewModel.foreditor) {
		if (viewModel.ismobile)
		{
			viewModel.columns(1);
		} else if (viewModel.istablet)
		{
			viewModel.columns(2);
		}
	}
	
	$(container).find(".matrixtable").each(function(){
		var matrix = this;
		$(this).find("input").click(function(){
			$(matrix).addClass("clicked");
		});
		
		$(this).hover(function() {
		}, function() {
			if ($(this).hasClass("clicked")) {
				validateInput($(this).parent(),true);
				$(this).removeClass("clicked");
			}
		});
		
		if (foreditor && viewModel.tableType() == 2)
		{
			$(matrix).find("tr").first().find("th").each(function(index){	
				var cell = this;
				$(this).resizable({
					handles: "e",
					start: function ( event, ui) { $(cell).attr("data-originalwidth", $(cell).width())},
					stop: function( event, ui ) {
						_undoProcessor.addUndoStep(["CELLWIDTH", cell, $(cell).attr("data-originalwidth"), $(cell).width()]);
					} 
				});										
			});
		}
	});
	
	$(container).find(".tabletable").each(function(){
		var table = this;
		if (foreditor && viewModel.tableType() == 2)
		{
			$(table).find("tr").first().find("th").each(function(index){
				var cell = this;
				$(this).resizable({
					handles: "e",
					start: function ( event, ui) { $(cell).attr("data-originalwidth", $(cell).width())},
					stop: function( event, ui ) {
						_undoProcessor.addUndoStep(["CELLWIDTH", cell, $(cell).attr("data-originalwidth"), $(cell).width()]);
					} 
				});										
			});
		}
	});
	
	$(container).find(".answer-columns").each(function(){
		var cols = this;
		$(this).find("input").click(function(){
			$(cols).addClass("clicked");
		});
		$(this).find("a").click(function(){
			$(cols).addClass("clicked");
		});
		
		$(this).hover(function() {
		}, function() {
			if ($(this).hasClass("clicked")) {
						validateInput($(this).parent(),true);
						$(this).removeClass("clicked");
					}
		});
	});
	
	$(container).find(".confirmationelement").each(function(){
		var cols = this;
		$(this).find("input").click(function(){
			$(cols).addClass("clicked");
		});
		$(this).find("a").click(function(){
			$(cols).addClass("clicked");
		});
		
		$(this).hover(function() {
		}, function() {
			if ($(this).hasClass("clicked")) {
						validateInput($(this).parent(),true);
						$(this).removeClass("clicked");
					}
		});		
	});
	
	initModals($(container).find(".modal-dialog").first());
	
	$(container).find(".expand").TextAreaExpander();
	
	$(container).find("input, textarea, select").change(function() {
		  lastEditDate = new Date();
	});	
	
	$(container).find("select.single-choice").prepend("<option value=''></option>");
				
	$(container).find(".tabletable").find("textarea").each(function(){
		var height = $(this).parent().height();
			if (height < 35) height = 35;
		$(this).height(height);
	});
	
	$(container).find(".ratingquestion").each(function(){
		var val = $(this).find("input").first().val();
		if (val != null && val.length > 0)
		{
			var pos = parseInt(val);
			if (pos > 0)
			{
				updateRatingIcons(pos-1, $(this));
			}
		}
	});
	
	if (foreditor)
	{
		$(container).find("textarea, input").not(":hidden").attr("disabled", "disabled");
		$(container).find("select").click(function(event){
			event.stopImmediatePropagation();
			event.preventDefault();
		}).change(function(event){
			$(this).val("");
		});
		$(container).find("a").removeAttr("href").removeAttr("onkeypress").removeAttr("onclick");
		
		if (viewModel.locked())
		{
			$(container).addClass("locked");
		}
	}
		
	if (!foreditor && !forskin)
	readCookiesForParent($(container));
	
	$(container).find(".freetext").each(function(){
		countChar(this);
		
		$(this).bind('paste', function(event) {
	        var _this = this;
	        // Short pause to wait for paste to complete
	        setTimeout( function() {
	        	countChar(_this);
	        }, 100);
	    });
	});
	
	$(container).find(".sliderbox").each(function(){
		initSlider(this, foreditor, viewModel);
	});
	
	return viewModel;
}

var modelsForSlider = [];

function initSlider(input, foreditor, viewModel)
{
	try {
		$(input).bootstrapSlider().bootstrapSlider('destroy');
	} catch (e) {
		//ignore
	}
		
	$(input).bootstrapSlider({
		formatter: function(value) {
			return value;
		},
		tooltip: 'always',
		ticks_labels: viewModel.labels(),
		enabled: !foreditor
	});
	
	modelsForSlider[viewModel.uniqueId()] = viewModel;
}

function getWidth(widths, index)
{
	if (widths != null)
	{
		var w = widths.split(";")
		return w[index] + "px";
	}
	
	return "50px";
}