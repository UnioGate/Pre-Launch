(function(){
  function showConfirmation(message){
    var modal=document.getElementById("ug-waitlist-confirm");
    if(!modal){
      modal=document.createElement("dialog");
      modal.id="ug-waitlist-confirm";
      modal.className="rounded-2xl border border-white/10 bg-[#0b1325]/95 p-0 text-white shadow-[0_32px_64px_rgba(11,19,37,0.8)] backdrop:bg-black/70";
      modal.innerHTML='<div class="w-[min(92vw,28rem)] p-8 text-center"><span class="material-symbols-outlined text-5xl text-secondary">check_circle</span><h3 class="mt-4 font-headline text-3xl font-bold">Submission received</h3><p data-msg class="mt-3 text-sm leading-relaxed text-slate-300"></p><form method="dialog" class="mt-6"><button class="h-11 rounded-xl bg-secondary px-6 font-bold text-slate-950">Done</button></form></div>';
      document.body.appendChild(modal);
    }
    modal.querySelector("[data-msg]").textContent=message||"Thanks. Your waitlist request has been submitted successfully.";
    modal.showModal();
  }  document.addEventListener("submit",async function(e){
    var form=e.target;
    if(!form||form.id!=="ug-waitlist-form") return;
    e.preventDefault();
    var name=form.querySelector("#ug-waitlist-name");
    var email=form.querySelector("#ug-waitlist-email");
    var business=form.querySelector("#ug-waitlist-business");
    var submit=form.querySelector('button[type="submit"]');
    if(name) name.required=true;
    if(!form.reportValidity()) return;
    submit.disabled=true;
    submit.textContent="Submitting...";
    try{
      var response=await fetch("/api/waitlist",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:name?name.value.trim():"",
          email:email?email.value.trim():"",
          business:business?business.value.trim():"",
          sourcePage:location.pathname||"/"
        })
      });
      var result=await response.json().catch(function(){return {}});
      if(!response.ok) throw new Error(result.error||"We could not submit your details right now. Please try again.");      form.reset();
      if(window.UnioGateWaitlist&&window.UnioGateWaitlist.close) window.UnioGateWaitlist.close();
      showConfirmation(result.message);
    }catch(err){
      alert(err.message);
    }
    submit.disabled=false;
    submit.textContent="Join Waitlist";
  });
})();