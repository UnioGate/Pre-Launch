(function(){
  function setButtonState(button, isActive){
    button.setAttribute("aria-pressed", String(isActive));
    button.classList.toggle("bg-primary", isActive);
    button.classList.toggle("text-on-primary", isActive);
    button.classList.toggle("bg-surface-container-highest", !isActive);
    button.classList.toggle("text-on-surface-variant", !isActive);
  }

  function initRoleFilters(){
    var filterGroup=document.querySelector("[data-role-filters]");
    var cards=Array.prototype.slice.call(document.querySelectorAll("[data-role-card]"));
    if(!filterGroup||!cards.length) return;

    var buttons=Array.prototype.slice.call(filterGroup.querySelectorAll("[data-role-filter]"));
    function applyFilter(category){
      buttons.forEach(function(button){
        setButtonState(button, button.getAttribute("data-role-filter")===category);
      });

      cards.forEach(function(card){
        var matches=category==="all"||card.getAttribute("data-role-category")===category;
        card.hidden=!matches;
      });
    }

    filterGroup.addEventListener("click", function(event){
      var button=event.target.closest("[data-role-filter]");
      if(!button) return;
      applyFilter(button.getAttribute("data-role-filter")||"all");
    });

    applyFilter("all");
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", initRoleFilters);
  }else{
    initRoleFilters();
  }
})();
