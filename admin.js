// admin.js

const PASSWORD = 'admin123';

const defaultData = {};

let data = null;
let currentSection = '';

// Load admin data preferring the project JSON file (authoritative). If fetch
// fails, fall back to localStorage (previous admin edits) or the empty default.
(function initAdminData(){
  const url = 'pyq-data.json?_=' + Date.now();
  fetch(url).then(r => {
    if (!r.ok) throw new Error('no-file');
    return r.json();
  }).then(json => {
    data = json;
    try { localStorage.setItem('pyqData', JSON.stringify(data)); } catch (e) {}
  }).catch(() => {
    const stored = localStorage.getItem('pyqData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        data = deepMerge(defaultData, parsed);
      } catch (e) {
        data = defaultData;
      }
    } else {
      data = defaultData;
    }
  });
})();

function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// --- Custom Modal ---
function showModal(title, message, withInput = false, defaultValue = '') {
  return new Promise(resolve => {
    const overlay = document.getElementById('adminModal');
    const titleEl = document.getElementById('modalTitle');
    const messageEl = document.getElementById('modalMessage');
    const inputEl = document.getElementById('modalInput');
    const cancelBtn = document.getElementById('modalCancel');
    const confirmBtn = document.getElementById('modalConfirm');

    titleEl.textContent = title;
    messageEl.textContent = message;
    
    if (withInput) {
      inputEl.style.display = 'block';
      inputEl.value = defaultValue;
    } else {
      inputEl.style.display = 'none';
      inputEl.value = '';
    }

    const cleanup = () => {
      overlay.classList.remove('show');
      cancelBtn.onclick = null;
      confirmBtn.onclick = null;
    };

    cancelBtn.onclick = () => {
      cleanup();
      resolve(null); // returning null means cancelled
    };

    confirmBtn.onclick = () => {
      cleanup();
      resolve(withInput ? inputEl.value : true);
    };

    overlay.classList.add('show');
    if(withInput) inputEl.focus();
  });
}

async function checkPassword(e) {
  if (e && e.preventDefault) e.preventDefault();
  const pwdEl = document.getElementById('password');
  const pwd = pwdEl ? pwdEl.value : '';
  if (pwd === PASSWORD) {
    document.getElementById('password-section').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    if (pwdEl) pwdEl.value = '';
    loadSection();
  } else {
    const help = document.getElementById('login-help');
    if (help) {
      help.textContent = 'Wrong password. Try again.';
      help.style.color = 'crimson';
    } else {
      await showModal('Error', 'Wrong password', false);
    }
  }
}

function loadSection() {
  const sel = document.getElementById('section-select');
  currentSection = sel ? sel.value : 'jut';
  buildAdminSection();
}

const iconEdit = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>`;
const iconDelete = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;
const iconAdd = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`;
const iconToggle = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

function buildAdminSection() {
  const container = document.getElementById('section-content');
  if(!container) return;
  container.innerHTML = '';
  
  if(!data || !data[currentSection]) return;
  
  const sectionData = data[currentSection];
  for (const branchName in sectionData) {
    const branchDiv = document.createElement('div');
    branchDiv.className = 'branch';
    branchDiv.innerHTML = `
      <div class="branch-head" onclick="toggleNode(this)">
        <span class="toggler">${iconToggle}</span> ${branchName}
      </div>
      <div class="branch-body">
        <div class="body-inner">
        ${Object.keys(sectionData[branchName]).sort((a,b)=>b-a).map(year => `
          <div class="year">
            <div class="year-head" onclick="toggleNode(this)">
              <span class="toggler">${iconToggle}</span> ${year}
              <div class="action-bar" onclick="event.stopPropagation()">
                <button class="btn-icon edit" onclick="editYear('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}')" aria-label="Edit">${iconEdit}</button>
                <button class="btn-icon" onclick="deleteYear('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}')" aria-label="Delete">${iconDelete}</button>
              </div>
            </div>
            <div class="year-body">
              <div class="body-inner">
              ${Object.keys(sectionData[branchName][year]).map(sem => `
                <div class="semester">
                  <div class="sem-head" onclick="toggleNode(this)">
                    <span class="toggler">${iconToggle}</span> ${sem}
                    <div class="action-bar" onclick="event.stopPropagation()">
                      <button class="btn-icon edit" onclick="editSemester('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}', '${sem.replace(/'/g, "\\'")}')" aria-label="Edit">${iconEdit}</button>
                      <button class="btn-icon" onclick="deleteSemester('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}', '${sem.replace(/'/g, "\\'")}')" aria-label="Delete">${iconDelete}</button>
                    </div>
                  </div>
                  <div class="sem-body">
                    <div class="body-inner">
                    ${Object.keys(sectionData[branchName][year][sem]).map(subject => `
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                        <a class="subject" href="${sectionData[branchName][year][sem][subject]}" target="_blank" style="margin:0; flex:1;">${subject}</a>
                        <button class="btn-icon edit" onclick="editSubject('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}', '${sem.replace(/'/g, "\\'")}', '${subject.replace(/'/g, "\\'")}')" aria-label="Edit">${iconEdit}</button>
                        <button class="btn-icon" onclick="deleteSubject('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}', '${sem.replace(/'/g, "\\'")}', '${subject.replace(/'/g, "\\'")}')" aria-label="Delete">${iconDelete}</button>
                      </div>
                    `).join('')}
                    <div class="admin-add-row">
                      <input type="text" class="input" id="subjectInput-${branchName.replace(/'/g, '')}-${year.replace(/'/g, '')}-${sem.replace(/'/g, '')}" placeholder="Subject name">
                      <input type="text" class="input" id="linkInput-${branchName.replace(/'/g, '')}-${year.replace(/'/g, '')}-${sem.replace(/'/g, '')}" placeholder="Google Drive Link">
                      <button class="btn primary" onclick="addSubject('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}', '${sem.replace(/'/g, "\\'")}')">${iconAdd} Add</button>
                    </div>
                    </div>
                  </div>
                </div>
              `).join('')}
              <div class="admin-add-row">
                <input type="text" class="input" id="semInput-${branchName.replace(/'/g, '')}-${year.replace(/'/g, '')}" placeholder="Enter semester (e.g. semester 3)">
                <button class="btn primary" onclick="addSemester('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}')">${iconAdd} Add Sem</button>
              </div>
              </div>
            </div>
          </div>
        `).join('')}
        <div class="admin-add-row">
          <input type="number" class="input" id="yearInput-${branchName.replace(/'/g, '')}" placeholder="Enter year (e.g. 2025)">
          <button class="btn primary" onclick="addYear('${branchName.replace(/'/g, "\\'")}')">${iconAdd} Add Year</button>
        </div>
        </div>
      </div>
    `;
    container.appendChild(branchDiv);
  }
}

function toggleNode(el) {
  const parent = el.parentElement;
  const body = parent.querySelector(':scope > .branch-body, :scope > .year-body, :scope > .sem-body');
  if (body) body.classList.toggle('active');
  el.classList.toggle('open');
}

async function addYear(branch) {
  const input = document.getElementById('yearInput-' + branch.replace(/'/g, ''));
  const year = input.value.trim();
  if (year && !data[currentSection][branch][year]) {
    data[currentSection][branch][year] = {};
    input.value = '';
    saveData();
    buildAdminSection();
  } else if (year) {
    await showModal('Error', 'Year already exists.', false);
  }
}

async function editYear(branch, oldYear) {
  const newYear = await showModal('Edit Year', `Enter new year:`, true, oldYear);
  if (newYear && newYear.trim() !== '' && newYear !== oldYear) {
    data[currentSection][branch][newYear] = data[currentSection][branch][oldYear];
    delete data[currentSection][branch][oldYear];
    saveData();
    buildAdminSection();
  }
}

async function deleteYear(branch, year) {
  const confirmed = await showModal('Delete Year', `Are you sure you want to delete year ${year}?`, false);
  if (confirmed) {
    delete data[currentSection][branch][year];
    saveData();
    buildAdminSection();
  }
}

async function addSemester(branch, year) {
  const input = document.getElementById('semInput-' + branch.replace(/'/g, '') + '-' + year.replace(/'/g, ''));
  const sem = input.value.trim();
  if (sem && !data[currentSection][branch][year][sem]) {
    data[currentSection][branch][year][sem] = {};
    input.value = '';
    saveData();
    buildAdminSection();
  } else if (sem) {
    await showModal('Error', 'Semester already exists.', false);
  }
}

async function editSemester(branch, year, oldSem) {
  const newSem = await showModal('Edit Semester', `Enter new semester:`, true, oldSem);
  if (newSem && newSem.trim() !== '' && newSem !== oldSem) {
    data[currentSection][branch][year][newSem] = data[currentSection][branch][year][oldSem];
    delete data[currentSection][branch][year][oldSem];
    saveData();
    buildAdminSection();
  }
}

async function deleteSemester(branch, year, sem) {
  const confirmed = await showModal('Delete Semester', `Are you sure you want to delete semester ${sem}?`, false);
  if (confirmed) {
    delete data[currentSection][branch][year][sem];
    saveData();
    buildAdminSection();
  }
}

async function addSubject(branch, year, sem) {
  const subjectInput = document.getElementById('subjectInput-' + branch.replace(/'/g, '') + '-' + year.replace(/'/g, '') + '-' + sem.replace(/'/g, ''));
  const linkInput = document.getElementById('linkInput-' + branch.replace(/'/g, '') + '-' + year.replace(/'/g, '') + '-' + sem.replace(/'/g, ''));
  const subject = subjectInput.value.trim();
  const link = linkInput.value.trim();
  if (subject && link && !data[currentSection][branch][year][sem][subject]) {
    data[currentSection][branch][year][sem][subject] = link;
    subjectInput.value = '';
    linkInput.value = '';
    saveData();
    buildAdminSection();
  } else if (subject) {
    await showModal('Error', 'Subject already exists or invalid link.', false);
  }
}

async function editSubject(branch, year, sem, oldSubject) {
  const newSubject = await showModal('Edit Subject', `Enter new subject name:`, true, oldSubject);
  if (!newSubject || newSubject.trim() === '') return;
  
  const link = await showModal('Edit Link', `Enter new link for ${newSubject}:`, true, data[currentSection][branch][year][sem][oldSubject]);
  if (link !== null && link.trim() !== '') {
    if(newSubject !== oldSubject) delete data[currentSection][branch][year][sem][oldSubject];
    data[currentSection][branch][year][sem][newSubject] = link.trim();
    saveData();
    buildAdminSection();
  }
}

async function deleteSubject(branch, year, sem, subject) {
  const confirmed = await showModal('Delete Subject', `Are you sure you want to delete subject ${subject}?`, false);
  if (confirmed) {
    delete data[currentSection][branch][year][sem][subject];
    saveData();
    buildAdminSection();
  }
}

function exportData() {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pyq-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

async function importData() {
  const fileInput = document.getElementById('importFile');
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    await showModal('Warning', 'Please choose a JSON file first.', false);
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      const merge = document.getElementById('mergeImport') && document.getElementById('mergeImport').checked;
      if (merge) {
        data = deepMerge(data, parsed);
      } else {
        data = parsed;
      }
      saveData();
      buildAdminSection();
      await showModal('Success', 'Import successful.', false);
      fileInput.value = '';
      const fname = document.getElementById('file-name');
      if(fname) fname.textContent = 'Choose JSON';
    } catch (err) {
      console.error('Failed to import JSON', err);
      await showModal('Error', 'Invalid JSON file.', false);
    }
  };
  reader.onerror = async function() {
    await showModal('Error', 'Failed to read file.', false);
  };
  reader.readAsText(file);
}

async function saveData() {
  try {
    localStorage.setItem('pyqData', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data to localStorage', e);
    await showModal('Error', 'Failed to save data. Check browser storage settings.', false);
  }
}