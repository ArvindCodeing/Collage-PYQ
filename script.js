// script.js

// Toggle display for branch/year/semester nodes
function toggleNode(el){
  // el is the clicked head element (branch-head, year-head, sem-head)
  const parent = el.parentElement;
  // find the immediate body (branch-body, year-body, sem-body)
  const body = parent.querySelector(':scope > .branch-body, :scope > .year-body, :scope > .sem-body');
  if(body) body.classList.toggle('active');
  // prevent event bubbling if used as onclick on nested elements
  if(window.event) window.event.stopPropagation();
}

// Simple search for each side
function setupSearch(inputId, containerId){
  const input = document.getElementById(inputId);
  const container = document.getElementById(containerId);

  input.addEventListener('input', function(){
    const q = this.value.trim().toLowerCase();
    // show all if empty
    if(!q){
      // collapse nothing, just show all subjects
      const allSubjects = container.querySelectorAll('.subject');
      allSubjects.forEach(s => s.style.display = '');
      return;
    }
    // filter subjects by data-name or text
    const subjects = container.querySelectorAll('.subject');
    subjects.forEach(s => {
      const name = (s.dataset.name || s.textContent || '').toLowerCase();
      if(name.includes(q)) s.style.display = '';
      else s.style.display = 'none';
    });
    // Optionally expand parents that contain visible subjects
    const semesters = container.querySelectorAll('.semester');
    semesters.forEach(sem => {
      const visible = sem.querySelectorAll('.subject:not([style*="display: none"])').length > 0;
      const semBody = sem.querySelector(':scope > .sem-body');
      if(semBody) semBody.classList.toggle('active', visible);
      // show year if any semester visible
      const year = sem.closest('.year');
      if(year){
        const anySemVisible = year.querySelectorAll('.sem-body.active').length > 0;
        const yearBody = year.querySelector(':scope > .year-body');
        if(yearBody) yearBody.classList.toggle('active', anySemVisible);
      }
      // show branch if any year visible
      const branch = sem.closest('.branch');
      if(branch){
        const anyYearVisible = branch.querySelectorAll('.year-body.active').length > 0;
        const branchBody = branch.querySelector(':scope > .branch-body');
        if(branchBody) branchBody.classList.toggle('active', anyYearVisible);
      }
    });
  });
}

// initialize searches for both panels
document.addEventListener('DOMContentLoaded', function(){
  setupSearch('searchJut', 'jutBranches');
  setupSearch('searchChai', 'chaiBranches');
});