(function(){
  var inquiryConfigs={
    partnership:{
      eyebrow:"Partnership Desk",
      title:"Build with UnioGate",
      description:"Tell us about your product, growth plans, and where UnioGate infrastructure can unlock the next phase.",
      subjectLabel:"Partnership Focus",
      messageLabel:"Partnership Brief",
      messagePlaceholder:"Tell us about your company, market, and the partnership you want to explore.",
      submitLabel:"Send Partnership Inquiry",
      options:[
        "Infrastructure Integration",
        "Volume Licensing",
        "Strategic Partnership"
      ]
    },
    "developer-support":{
      eyebrow:"Developer Support",
      title:"Get Integration Help",
      description:"Send your technical issue directly with the context our engineering team needs to troubleshoot fast.",
      subjectLabel:"Support Topic",
      messageLabel:"Technical Details",
      messagePlaceholder:"Share the integration issue, endpoint, environment, and any error details we should inspect.",
      submitLabel:"Request Developer Support",
      options:[
        "API Key Assistance",
        "Sandbox Setup",
        "Integration Bug"
      ]
    },
    "media-inquiry":{
      eyebrow:"Media Inquiry",
      title:"Contact the Press Team",
      description:"Share your deadline, publication, and the story or spokesperson request you want to coordinate.",
      subjectLabel:"Press Topic",
      messageLabel:"Coverage Request",
      messagePlaceholder:"Tell us about your outlet, deadline, interview request, or story angle.",
      submitLabel:"Send Media Inquiry",
      options:[
        "Press & Media",
        "Executive Interview",
        "Brand Assets Request"
      ]
    }
  };

  function showStatus(element, message, isError){
    if(!element) return;
    element.textContent=message;
    element.classList.remove("hidden", "text-secondary", "border-secondary/20", "bg-secondary/10", "text-error", "border-error/30", "bg-error-container/20");
    if(isError){
      element.classList.add("text-error", "border-error/30", "bg-error-container/20");
      return;
    }
    element.classList.add("text-secondary", "border-secondary/20", "bg-secondary/10");
  }

  function setTabState(button, isActive){
    button.setAttribute("aria-pressed", String(isActive));
    button.classList.toggle("bg-primary", isActive);
    button.classList.toggle("text-on-primary", isActive);
    button.classList.toggle("shadow-lg", isActive);
    button.classList.toggle("shadow-primary/20", isActive);
    button.classList.toggle("border", !isActive);
    button.classList.toggle("border-outline-variant", !isActive);
    button.classList.toggle("text-on-surface-variant", !isActive);
  }

  function replaceOptions(select, options){
    select.innerHTML="";
    options.forEach(function(optionText, index){
      var option=document.createElement("option");
      option.value=optionText;
      option.textContent=optionText;
      if(index===0) option.selected=true;
      select.appendChild(option);
    });
  }

  function initContactForm(){
    var form=document.getElementById("ug-contact-form");
    var tabs=document.querySelector("[data-contact-tabs]");
    if(!form||!tabs) return;

    var hiddenType=document.getElementById("ug-contact-type");
    var subject=document.getElementById("ug-contact-subject");
    var subjectLabel=document.getElementById("ug-contact-subject-label");
    var message=document.getElementById("ug-contact-message");
    var messageLabel=document.getElementById("ug-contact-message-label");
    var eyebrow=document.getElementById("ug-contact-eyebrow");
    var title=document.getElementById("ug-contact-title");
    var description=document.getElementById("ug-contact-description");
    var submit=form.querySelector('button[type="submit"]');
    var submitLabel=submit.querySelector("[data-contact-submit-label]");
    var status=document.getElementById("ug-contact-status");
    var buttons=Array.prototype.slice.call(tabs.querySelectorAll("[data-contact-type]"));
    var defaultSubmitMarkup=submit.innerHTML;

    function applyInquiryType(type){
      var config=inquiryConfigs[type]||inquiryConfigs.partnership;
      hiddenType.value=type;
      if(eyebrow) eyebrow.textContent=config.eyebrow;
      if(title) title.textContent=config.title;
      if(description) description.textContent=config.description;
      subjectLabel.textContent=config.subjectLabel;
      messageLabel.textContent=config.messageLabel;
      message.placeholder=config.messagePlaceholder;
      replaceOptions(subject, config.options);
      if(submitLabel) submitLabel.textContent=config.submitLabel;
      buttons.forEach(function(button){
        setTabState(button, button.getAttribute("data-contact-type")===type);
      });
    }

    tabs.addEventListener("click", function(event){
      var button=event.target.closest("[data-contact-type]");
      if(!button) return;
      applyInquiryType(button.getAttribute("data-contact-type"));
    });

    form.addEventListener("submit", async function(event){
      event.preventDefault();
      status.classList.add("hidden");
      if(!form.reportValidity()) return;

      submit.disabled=true;
      submit.innerHTML='Sending<span class="material-symbols-outlined animate-pulse">more_horiz</span>';

      try{
        var response=await fetch("/api/contact",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            inquiryType:hiddenType.value,
            name:(document.getElementById("ug-contact-name").value||"").trim(),
            email:(document.getElementById("ug-contact-email").value||"").trim(),
            subject:(subject.value||"").trim(),
            message:(message.value||"").trim(),
            sourcePage:location.pathname||"/"
          })
        });
        var result=await response.json().catch(function(){return {};});
        if(!response.ok) throw new Error(result.error||"We could not send your inquiry right now. Please try again.");
        form.reset();
        applyInquiryType(hiddenType.defaultValue||"partnership");
        showStatus(status, result.message||"Your inquiry has been sent successfully.", false);
      }catch(error){
        showStatus(status, error.message, true);
      }

      submit.disabled=false;
      submit.innerHTML=defaultSubmitMarkup;
    });

    applyInquiryType(hiddenType.value||"partnership");
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", initContactForm);
  }else{
    initContactForm();
  }
})();
