// admin.js

// Firebase Auth & User state
let currentUser = null;
let data = null;
let currentSection = '';
let realtimeListenerAttached = false;

// Role, Permissions & Audit Log state
let isSuperAdmin = false;
let adminConfig = null;
let currentSubAdminProfile = null;
let allSubAdmins = {};
let allActivityLogs = [];
let roleListenersAttached = false;
let editingSubAdminKey = null;

// UI Elements & Icons
const iconEdit = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>`;
const iconDelete = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;
const iconAdd = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`;
const iconToggle = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

function cleanKeys(obj) {
  if (!obj || typeof obj !== 'object') return [];
  return Object.keys(obj).filter(k => k !== '_init');
}

let notesBranchSyncInProgress = false;

function ensureNotesBranches() {
  if (!data) data = {};
  if (!data.notes || typeof data.notes !== 'object') {
    data.notes = {};
  }
  let changed = false;
  const branchSet = new Set(['CSE', 'ECE', 'EE', 'ME', 'Civil']);
  ['jut', 'chaibasa'].forEach(sec => {
    if (data[sec] && typeof data[sec] === 'object') {
      cleanKeys(data[sec]).forEach(b => branchSet.add(b));
    }
  });
  if (currentSubAdminProfile && Array.isArray(currentSubAdminProfile.branches)) {
    currentSubAdminProfile.branches.forEach(b => {
      if (b && b !== 'ALL') branchSet.add(b);
    });
  }
  // Remove accidental empty 'CE' placeholder if it has no semesters/notes
  if (data.notes.CE && typeof data.notes.CE === 'object' && cleanKeys(data.notes.CE).length === 0) {
    delete data.notes.CE;
    changed = true;
  }
  branchSet.forEach(b => {
    if (!data.notes[b] || typeof data.notes[b] !== 'object') {
      data.notes[b] = { _init: true };
      changed = true;
    }
  });
  return changed;
}

async function syncNotesBranchesIfNeeded() {
  if (notesBranchSyncInProgress || !currentUser) return;
  if (!isSuperAdmin && !canAddOrEdit()) return;
  const changed = ensureNotesBranches();
  if (changed && window.firebase && firebase.database) {
    notesBranchSyncInProgress = true;
    try {
      try { localStorage.setItem('pyqData', JSON.stringify(data)); } catch (e) {}
      await firebase.database().ref('pyqData/notes').set(data.notes);
    } catch (e) {
      console.warn('Notes branch sync notice:', e);
    } finally {
      notesBranchSyncInProgress = false;
    }
  }
}

function emailToKey(email) {
  return (email || '').trim().toLowerCase().replace(/\./g, '_dot_').replace(/[@#$[\]/]/g, '_');
}

// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
  currentUser = user;
  if (user) {
    document.getElementById('password-section').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    setupRealtimeListener();
    initRoleAndPermissions(user);
    loadSection();
  } else {
    document.getElementById('password-section').style.display = 'block';
    document.getElementById('admin-content').style.display = 'none';
    isSuperAdmin = false;
    currentSubAdminProfile = null;
    roleListenersAttached = false;
    updateSyncStatus('offline', 'Not Logged In');
  }
});

// ============================================
// Role, Real-Time Permissions & Audit Logging
// ============================================

async function initRoleAndPermissions(user) {
  if (!window.firebase || !firebase.database || !user || !user.email) return;
  const userEmail = user.email.trim().toLowerCase();
  const userKey = emailToKey(userEmail);

  try {
    // Check if user is listed as a sub-admin first
    const subSnap = await firebase.database().ref(`subAdmins/${userKey}`).once('value');
    const cfgSnap = await firebase.database().ref('adminConfig').once('value');
    adminConfig = cfgSnap.val();

    if ((!adminConfig || !adminConfig.superAdminEmail) && !subSnap.exists()) {
      // First owner login automatically becomes Main Super Admin
      adminConfig = {
        superAdminEmail: userEmail,
        superAdminName: user.displayName || 'Main Admin',
        createdAt: Date.now()
      };
      await firebase.database().ref('adminConfig').set(adminConfig);
    }

    if (adminConfig && adminConfig.superAdminEmail && adminConfig.superAdminEmail.toLowerCase() === userEmail) {
      isSuperAdmin = true;
      currentSubAdminProfile = null;
      applyRoleUI();
      attachSuperAdminListeners();
    } else {
      isSuperAdmin = false;
      applyRoleUI();
      // Attach real-time listener for THIS sub-admin's permissions (instant updates!)
      firebase.database().ref(`subAdmins/${userKey}`).on('value', (snap) => {
        currentSubAdminProfile = snap.val();
        applyRoleUI();
        buildAdminSection();
      });
    }
  } catch (err) {
    console.warn('Role initialization notice:', err);
    // Fallback if rules block reading adminConfig
    isSuperAdmin = true;
    applyRoleUI();
  }
}

function attachSuperAdminListeners() {
  if (roleListenersAttached || !firebase.database) return;
  roleListenersAttached = true;

  firebase.database().ref('subAdmins').on('value', (snap) => {
    allSubAdmins = snap.val() || {};
    renderSubAdminsList();
  });

  firebase.database().ref('activityLogs').limitToLast(250).on('value', (snap) => {
    const raw = snap.val() || {};
    allActivityLogs = Object.keys(raw).map(k => ({ id: k, ...raw[k] }))
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    renderActivityLogs();
  });
}

function applyRoleUI() {
  const roleBadge = document.getElementById('roleBadge');
  const superBtns = document.querySelectorAll('.super-only-btn');
  const accessBanner = document.getElementById('subAdminAccessBanner');
  const accessText = document.getElementById('subAdminAccessText');
  const importExportRow = document.getElementById('importExportRow');

  if (isSuperAdmin) {
    if (roleBadge) {
      roleBadge.textContent = 'Main Super Admin';
      roleBadge.className = 'role-badge super';
    }
    superBtns.forEach(el => {
      el.style.display = (el.id === 'importExportRow') ? 'flex' : 'inline-flex';
    });
    if (importExportRow) importExportRow.style.display = 'flex';
    if (accessBanner) accessBanner.style.display = 'none';
    syncSectionSelectOptions(null);
    populatePermissionCheckboxes('create');
    syncNotesBranchesIfNeeded();
  } else {
    superBtns.forEach(el => { el.style.display = 'none'; });
    if (importExportRow) importExportRow.style.display = 'none';
    switchAdminTab('content');

    if (!currentSubAdminProfile) {
      if (roleBadge) {
        roleBadge.textContent = 'No Access Assigned';
        roleBadge.className = 'role-badge';
      }
      if (accessBanner && accessText) {
        accessBanner.style.display = 'flex';
        accessText.innerHTML = `<strong>Access Revoked / Not Found:</strong> Aapka email (${currentUser ? currentUser.email : ''}) kisi active Sub-Admin list me nahi hai. Main Admin se sampark karein.`;
      }
      return;
    }

    const active = currentSubAdminProfile.active !== false;
    const accessLabel = currentSubAdminProfile.accessType === 'full'
      ? 'Full Access (Add, Update & Delete)'
      : currentSubAdminProfile.accessType === 'read_only'
        ? 'View Only (Read Only)'
        : 'Add & Update Only (No Delete)';

    if (roleBadge) {
      roleBadge.textContent = active ? `${currentSubAdminProfile.name || 'Sub-Admin'}` : 'Account Paused';
      roleBadge.className = 'role-badge';
    }

    if (accessBanner && accessText) {
      accessBanner.style.display = 'flex';
      if (!active) {
        accessText.innerHTML = `<strong>Account Paused:</strong> Main Admin ne aapka access abhi pause kar diya hai.`;
      } else {
        const secs = (currentSubAdminProfile.sections || []).map(s => s.toUpperCase()).join(', ') || 'None';
        const brs = (currentSubAdminProfile.branches || ['ALL']).join(', ');
        const sems = (currentSubAdminProfile.semesters || ['ALL']).join(', ');
        accessText.innerHTML = `<strong>${currentSubAdminProfile.name}</strong> (${currentSubAdminProfile.email}) &bull; <strong>Access:</strong> ${accessLabel}<br><span style="font-size:12px;color:var(--muted);"><strong>Sections:</strong> ${secs} &bull; <strong>Branches:</strong> ${brs} &bull; <strong>Semesters:</strong> ${sems}</span>`;
      }
    }

    syncSectionSelectOptions(currentSubAdminProfile.sections || []);
    buildAdminSection();
  }
}

function syncSectionSelectOptions(allowedSections) {
  const sel = document.getElementById('section-select');
  if (!sel) return;
  let firstAllowed = null;
  Array.from(sel.options).forEach(opt => {
    if (!allowedSections) {
      opt.disabled = false;
      opt.style.display = '';
    } else {
      const ok = allowedSections.includes(opt.value);
      opt.disabled = !ok;
      opt.style.display = ok ? '' : 'none';
      if (ok && !firstAllowed) firstAllowed = opt.value;
    }
  });
  if (allowedSections && !allowedSections.includes(sel.value) && firstAllowed) {
    sel.value = firstAllowed;
    currentSection = firstAllowed;
  }
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  const panes = {
    content: document.getElementById('tab-content'),
    subadmins: document.getElementById('tab-subadmins'),
    logs: document.getElementById('tab-logs')
  };
  Object.keys(panes).forEach(k => {
    if (panes[k]) panes[k].style.display = (k === tabName) ? 'block' : 'none';
  });
  if (tabName === 'subadmins') {
    populatePermissionCheckboxes('create');
    renderSubAdminsList();
  } else if (tabName === 'logs') {
    renderActivityLogs();
  }
}

// Permission Check Helpers
function canAccessSection(section) {
  if (isSuperAdmin) return true;
  if (!currentSubAdminProfile || currentSubAdminProfile.active === false) return false;
  const secs = currentSubAdminProfile.sections || [];
  return secs.includes(section);
}

function canAccessBranch(branch) {
  if (isSuperAdmin) return true;
  if (!currentSubAdminProfile || currentSubAdminProfile.active === false) return false;
  const brs = currentSubAdminProfile.branches || [];
  return brs.includes('ALL') || brs.some(b => (b || '').trim().toLowerCase() === (branch || '').trim().toLowerCase());
}

function canAccessSemester(sem) {
  if (isSuperAdmin) return true;
  if (!currentSubAdminProfile || currentSubAdminProfile.active === false) return false;
  const sems = currentSubAdminProfile.semesters || [];
  return sems.includes('ALL') || sems.some(s => s.trim().toLowerCase() === (sem || '').trim().toLowerCase());
}

function canAddOrEdit() {
  if (isSuperAdmin) return true;
  if (!currentSubAdminProfile || currentSubAdminProfile.active === false) return false;
  return currentSubAdminProfile.accessType === 'add_edit' || currentSubAdminProfile.accessType === 'full';
}

function canDelete() {
  if (isSuperAdmin) return true;
  if (!currentSubAdminProfile || currentSubAdminProfile.active === false) return false;
  return currentSubAdminProfile.accessType === 'full';
}

async function checkPermissionOrAlert(actionType, section, branch, sem) {
  if (isSuperAdmin) return true;
  if (!currentSubAdminProfile || currentSubAdminProfile.active === false) {
    await showModal('Access Denied', 'Aapka admin account active nahi hai ya Main Admin dwara pause kiya gaya hai.', false);
    return false;
  }
  if (section && !canAccessSection(section)) {
    await showModal('Access Denied', `Aapko "${section}" section ka access nahi mila hai.`, false);
    return false;
  }
  if (branch && !canAccessBranch(branch)) {
    await showModal('Access Denied', `Aapko "${branch}" branch ka access nahi mila hai.`, false);
    return false;
  }
  if (sem && !canAccessSemester(sem)) {
    await showModal('Access Denied', `Aapko "${sem}" semester ka access nahi mila hai.`, false);
    return false;
  }
  if (actionType === 'delete' && !canDelete()) {
    await showModal('No Delete Permission', 'Aapko sirf Add & Update karne ki permission hai. Delete karne ka access nahi hai.', false);
    return false;
  }
  if ((actionType === 'add' || actionType === 'edit') && !canAddOrEdit()) {
    await showModal('Read Only Access', 'Aapke paas sirf View karne ka access hai, koi change nahi kar sakte.', false);
    return false;
  }
  return true;
}

// Audit Logger: Saves actor Name, Gmail, Action, Target & Timestamp
async function logActivity(action, section, targetDetails) {
  if (!window.firebase || !firebase.database || !currentUser) return;
  try {
    const actorEmail = currentUser.email || 'unknown';
    const actorName = isSuperAdmin
      ? ((adminConfig && adminConfig.superAdminName) || 'Main Super Admin')
      : ((currentSubAdminProfile && currentSubAdminProfile.name) || actorEmail.split('@')[0]);

    await firebase.database().ref('activityLogs').push({
      actorName: actorName,
      actorEmail: actorEmail,
      actorRole: isSuperAdmin ? 'Super Admin' : 'Sub-Admin',
      action: action,
      section: section || currentSection || 'system',
      target: targetDetails || '',
      timestamp: Date.now()
    });
  } catch (e) {
    console.warn('Activity log error:', e);
  }
}

// Gather all known branches across PYQs and Notes for permission checkboxes
function getAllKnownBranches() {
  const set = new Set(['CSE', 'ECE', 'EE', 'ME', 'Civil']);
  if (data) {
    ['jut', 'chaibasa', 'notes'].forEach(sec => {
      if (data[sec] && typeof data[sec] === 'object') {
        cleanKeys(data[sec]).forEach(b => {
          if (sec === 'notes' && b === 'CE' && cleanKeys(data.notes[b]).length === 0) return;
          set.add(b);
        });
      }
    });
  }
  return Array.from(set);
}

function getAllKnownSemesters() {
  const defaults = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  const map = new Map();
  defaults.forEach(s => map.set(s.toLowerCase(), s));
  if (data) {
    ['jut', 'chaibasa'].forEach(sec => {
      const secObj = data[sec] || {};
      for (const b of cleanKeys(secObj)) {
        for (const y of cleanKeys(secObj[b])) {
          for (const s of cleanKeys(secObj[b][y])) {
            if (!map.has(s.toLowerCase())) map.set(s.toLowerCase(), s);
          }
        }
      }
    });
    if (data.notes) {
      for (const b of cleanKeys(data.notes)) {
        for (const s of cleanKeys(data.notes[b])) {
          if (!map.has(s.toLowerCase())) map.set(s.toLowerCase(), s);
        }
      }
    }
  }
  return sortSemesters(Array.from(map.values()));
}

function populatePermissionCheckboxes(prefix, selectedBranches = ['ALL'], selectedSemesters = ['ALL']) {
  const brContainer = document.getElementById(`${prefix}PermBranches`);
  const semContainer = document.getElementById(`${prefix}PermSemesters`);

  if (brContainer) {
    const branches = getAllKnownBranches();
    const isAllBr = selectedBranches.includes('ALL');
    brContainer.innerHTML = `
      <label class="perm-chip"><input type="checkbox" value="ALL" ${isAllBr ? 'checked' : ''} onchange="toggleAllChip(this, '${prefix}PermBranches')"> All Branches</label>
      ${branches.map(b => `<label class="perm-chip"><input type="checkbox" value="${b}" ${!isAllBr && selectedBranches.some(x => (x || '').trim().toLowerCase() === b.toLowerCase()) ? 'checked' : ''} onchange="uncheckAllChip('${prefix}PermBranches')"> ${b}</label>`).join('')}
    `;
  }

  if (semContainer) {
    const sems = getAllKnownSemesters();
    const isAllSem = selectedSemesters.includes('ALL');
    semContainer.innerHTML = `
      <label class="perm-chip"><input type="checkbox" value="ALL" ${isAllSem ? 'checked' : ''} onchange="toggleAllChip(this, '${prefix}PermSemesters')"> All Semesters</label>
      ${sems.map(s => `<label class="perm-chip"><input type="checkbox" value="${s}" ${!isAllSem && selectedSemesters.some(x => x.toLowerCase() === s.toLowerCase()) ? 'checked' : ''} onchange="uncheckAllChip('${prefix}PermSemesters')"> ${s}</label>`).join('')}
    `;
  }
}

function toggleAllChip(allCheckbox, containerId) {
  const box = document.getElementById(containerId);
  if (!box || !allCheckbox.checked) return;
  box.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    if (cb.value !== 'ALL') cb.checked = false;
  });
}

function uncheckAllChip(containerId) {
  const box = document.getElementById(containerId);
  if (!box) return;
  const allCb = box.querySelector('input[value="ALL"]');
  if (allCb) allCb.checked = false;
}

function readCheckedValues(containerId, defaultVal = []) {
  const box = document.getElementById(containerId);
  if (!box) return defaultVal;
  const checked = Array.from(box.querySelectorAll('input[type="checkbox"]:checked')).map(c => c.value);
  return checked.length > 0 ? checked : defaultVal;
}

// Create Sub-Admin Firebase Auth account (via Secondary App so Super Admin stays logged in) + Save Permissions
async function handleCreateSubAdmin(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (!isSuperAdmin) return;

  const name = document.getElementById('newSubAdminName').value.trim();
  const email = document.getElementById('newSubAdminEmail').value.trim().toLowerCase();
  const password = document.getElementById('newSubAdminPassword').value;
  const accessType = document.getElementById('newSubAdminAccessType').value;
  const sections = readCheckedValues('createPermSections', ['notes']);
  const branches = readCheckedValues('createPermBranches', ['ALL']);
  const semesters = readCheckedValues('createPermSemesters', ['ALL']);
  const btn = document.getElementById('createSubAdminBtn');

  if (!name || !email || !password) {
    await showModal('Missing Info', 'Name, Email aur Password sabhi zaroori hain.', false);
    return;
  }
  if (adminConfig && adminConfig.superAdminEmail === email) {
    await showModal('Error', 'Ye email pehle se Main Super Admin hai.', false);
    return;
  }

  btn.disabled = true;
  const origHtml = btn.innerHTML;
  btn.textContent = 'Creating Sub-Admin...';

  let secondaryApp = null;
  try {
    // Secondary Firebase App prevents signing out the Main Super Admin!
    const existing = firebase.apps.find(a => a.name === 'SubAdminCreator');
    secondaryApp = existing || firebase.initializeApp(firebase.app().options, 'SubAdminCreator');

    try {
      await secondaryApp.auth().createUserWithEmailAndPassword(email, password);
      await secondaryApp.auth().signOut();
    } catch (authErr) {
      if (authErr.code === 'auth/email-already-in-use') {
        // Account already exists in Firebase Auth — still save/update permissions in RTDB
        console.warn('Email already exists in Auth, updating RTDB permissions.');
      } else {
        throw authErr;
      }
    }

    const key = emailToKey(email);
    await firebase.database().ref(`subAdmins/${key}`).set({
      name,
      email,
      active: true,
      accessType,
      sections,
      branches,
      semesters,
      createdAt: Date.now()
    });

    await logActivity('PERMISSION', 'system', `Created Sub-Admin: ${name} (${email}) [${accessType}]`);
    document.getElementById('createSubAdminForm').reset();
    populatePermissionCheckboxes('create');
    await showModal('Success', `Sub-Admin "${name}" (${email}) create ho gaya hai aur uski permissions live save ho gayi hain!`, false);
  } catch (err) {
    console.error('Create Sub-Admin error:', err);
    await showModal('Error', 'Failed to create Sub-Admin: ' + err.message, false);
  } finally {
    btn.disabled = false;
    btn.innerHTML = origHtml;
  }
}

function renderSubAdminsList() {
  const container = document.getElementById('subAdminsList');
  if (!container) return;
  const keys = Object.keys(allSubAdmins || {});
  if (keys.length === 0) {
    container.innerHTML = '<p class="muted">Abhi koi Sub-Admin nahi banaya gaya hai. Upar form se banayein.</p>';
    return;
  }

  container.innerHTML = keys.map(key => {
    const sa = allSubAdmins[key];
    const active = sa.active !== false;
    const typeClass = !active ? 'paused' : (sa.accessType === 'full' ? 'full' : 'nodelete');
    const typeLabel = !active
      ? 'Paused'
      : sa.accessType === 'full'
        ? 'Full Access (Add, Edit & Delete)'
        : sa.accessType === 'read_only'
          ? 'View Only'
          : 'Add & Update Only (No Delete)';
    const secs = (sa.sections || []).map(s => s.toUpperCase()).join(', ') || 'None';
    const brs = (sa.branches || ['ALL']).join(', ');
    const sems = (sa.semesters || ['ALL']).join(', ');

    return `
      <div class="subadmin-row">
        <div class="subadmin-info">
          <div style="font-weight:700; font-size:15px;">${sa.name || 'Sub-Admin'} <span class="muted" style="font-weight:500; font-size:13px;">(${sa.email})</span></div>
          <div class="subadmin-tags">
            <span class="perm-tag ${typeClass}">${typeLabel}</span>
            <span class="perm-tag">Sections: ${secs}</span>
            <span class="perm-tag">Branches: ${brs}</span>
            <span class="perm-tag">Semesters: ${sems}</span>
          </div>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn primary" style="padding:8px 12px; font-size:12px;" onclick="openEditAccessModal('${key}')">Edit Access</button>
          <button class="btn" style="padding:8px 12px; font-size:12px; color:#ef4444;" onclick="removeSubAdmin('${key}')">Remove</button>
        </div>
      </div>
    `;
  }).join('');
}

function openEditAccessModal(key) {
  const sa = allSubAdmins[key];
  if (!sa) return;
  editingSubAdminKey = key;

  document.getElementById('editAccessUserLabel').textContent = `Gmail: ${sa.email}`;
  document.getElementById('editAccessName').value = sa.name || '';
  document.getElementById('editAccessActive').value = sa.active === false ? 'false' : 'true';
  document.getElementById('editAccessType').value = sa.accessType || 'add_edit';

  const secBox = document.getElementById('editPermSections');
  if (secBox) {
    const secs = sa.sections || [];
    secBox.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = secs.includes(cb.value);
    });
  }

  populatePermissionCheckboxes('edit', sa.branches || ['ALL'], sa.semesters || ['ALL']);
  document.getElementById('editAccessModal').classList.add('show');
}

function closeEditAccessModal() {
  const modal = document.getElementById('editAccessModal');
  if (modal) modal.classList.remove('show');
  editingSubAdminKey = null;
}

async function saveSubAdminAccessChanges() {
  if (!editingSubAdminKey || !isSuperAdmin) return;
  const sa = allSubAdmins[editingSubAdminKey];
  if (!sa) return;

  const name = document.getElementById('editAccessName').value.trim() || sa.name;
  const active = document.getElementById('editAccessActive').value === 'true';
  const accessType = document.getElementById('editAccessType').value;
  const sections = readCheckedValues('editPermSections', []);
  const branches = readCheckedValues('editPermBranches', ['ALL']);
  const semesters = readCheckedValues('editPermSemesters', ['ALL']);

  await firebase.database().ref(`subAdmins/${editingSubAdminKey}`).update({
    name,
    active,
    accessType,
    sections,
    branches,
    semesters,
    updatedAt: Date.now()
  });

  await logActivity('PERMISSION', 'system', `Updated access for ${name} (${sa.email}): ${active ? accessType : 'PAUSED'}, Branches: ${branches.join(',')}, Semesters: ${semesters.join(',')}`);
  closeEditAccessModal();
}

async function removeSubAdmin(key) {
  if (!isSuperAdmin) return;
  const sa = allSubAdmins[key];
  const confirmed = await showModal('Remove Sub-Admin', `Remove "${sa ? sa.name : ''}" (${sa ? sa.email : ''}) from admin access?`, false);
  if (confirmed) {
    await firebase.database().ref(`subAdmins/${key}`).remove();
    await logActivity('PERMISSION', 'system', `Removed Sub-Admin: ${sa ? sa.name : key} (${sa ? sa.email : ''})`);
  }
}

function renderActivityLogs() {
  const container = document.getElementById('activityLogsList');
  if (!container) return;

  const q = (document.getElementById('logSearchInput')?.value || '').trim().toLowerCase();
  const filtered = allActivityLogs.filter(item => {
    if (!q) return true;
    return (
      (item.actorName || '').toLowerCase().includes(q) ||
      (item.actorEmail || '').toLowerCase().includes(q) ||
      (item.action || '').toLowerCase().includes(q) ||
      (item.target || '').toLowerCase().includes(q) ||
      (item.section || '').toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    container.innerHTML = '<p class="muted" style="text-align:center; padding:24px;">No activity logs found.</p>';
    return;
  }

  container.innerHTML = filtered.map(log => {
    const timeStr = log.timestamp ? new Date(log.timestamp).toLocaleString() : '';
    return `
      <div class="log-item">
        <div class="log-top">
          <div>
            <span class="log-actor">${log.actorName || 'Admin'}</span>
            <span class="log-email">(${log.actorEmail || ''}) • ${log.actorRole || ''}</span>
          </div>
          <span class="log-action-badge ${log.action || 'UPDATE'}">${log.action || 'UPDATE'}</span>
        </div>
        <div class="log-target"><strong>[${(log.section || '').toUpperCase()}]</strong> ${log.target || ''}</div>
        <div class="log-time">${timeStr}</div>
      </div>
    `;
  }).join('');
}

async function clearActivityLogs() {
  if (!isSuperAdmin) return;
  const confirmed = await showModal('Clear Activity Logs', 'Delete all recorded activity logs?', false);
  if (confirmed) {
    await firebase.database().ref('activityLogs').remove();
  }
}

// Update Realtime Database Status Badge
function updateSyncStatus(status, text) {
  const badge = document.getElementById('syncBadge');
  const label = document.getElementById('syncText');
  if (!badge || !label) return;

  badge.className = 'sync-badge ' + status;
  label.textContent = text;
}

// Initial Data Load (Fallback / Offline first)
(function initAdminData() {
  const stored = localStorage.getItem('pyqData');
  if (stored) {
    try {
      data = JSON.parse(stored);
    } catch (e) {
      data = {};
    }
  }

  // Also fetch project JSON as fallback baseline
  fetch('pyq-data.json?_=' + Date.now()).then(r => {
    if (!r.ok) throw new Error('no-file');
    return r.json();
  }).then(json => {
    if (!data || Object.keys(data).length === 0) {
      data = json;
      try { localStorage.setItem('pyqData', JSON.stringify(data)); } catch (e) {}
      if (currentUser) buildAdminSection();
    }
  }).catch(() => {
    if (!data) data = { jut: {}, chaibasa: {} };
  });
})();

// Realtime Database Listener
function setupRealtimeListener() {
  if (realtimeListenerAttached || !window.firebase || !firebase.database) return;
  try {
    updateSyncStatus('syncing', 'Connecting to Realtime DB...');
    const dbRef = firebase.database().ref('pyqData');
    dbRef.on('value', (snapshot) => {
      const val = snapshot.val();
      const warningBox = document.getElementById('rtdbRulesWarning');
      if (warningBox) warningBox.style.display = 'none';

      if (val && typeof val === 'object' && Object.keys(val).length > 0) {
        data = val;
        try { localStorage.setItem('pyqData', JSON.stringify(data)); } catch (e) {}
        buildAdminSection();
        if (isSuperAdmin) {
          populatePermissionCheckboxes('create');
          syncNotesBranchesIfNeeded();
        }
        updateSyncStatus('connected', 'Live in Realtime DB');
      } else if (val === null) {
        updateSyncStatus('syncing', 'Realtime DB Empty (Click Push)');
      }
    }, (error) => {
      console.warn('Realtime Database listener error:', error);
      updateSyncStatus('error', 'Sync Issue: ' + (error.code || error.message));
      if (error && (error.code === 'PERMISSION_DENIED' || (error.message && error.message.includes('Permission denied')))) {
        const warningBox = document.getElementById('rtdbRulesWarning');
        if (warningBox) warningBox.style.display = 'flex';
      }
    });
    realtimeListenerAttached = true;
  } catch (err) {
    console.error('Failed to attach Realtime listener:', err);
    updateSyncStatus('error', 'Error connecting to DB');
  }
}

// Save Data (syncs to Firebase Realtime Database & localStorage)
async function saveData() {
  try {
    try {
      localStorage.setItem('pyqData', JSON.stringify(data));
    } catch (storageErr) {
      console.warn('localStorage quota notice (skipping local cache):', storageErr);
    }
    updateStorageStats();
    if (window.firebase && firebase.database) {
      updateSyncStatus('syncing', 'Saving to Realtime DB...');
      await firebase.database().ref('pyqData').set(data);
      updateSyncStatus('connected', 'Live in Realtime DB');
      const warningBox = document.getElementById('rtdbRulesWarning');
      if (warningBox) warningBox.style.display = 'none';
    }
  } catch (e) {
    console.error('Failed to save data to Firebase Realtime DB:', e);
    updateSyncStatus('error', 'Sync Failed: ' + (e.message || 'Check RTDB Rules'));
    if (e && (e.code === 'PERMISSION_DENIED' || (e.message && e.message.includes('Permission denied')))) {
      const warningBox = document.getElementById('rtdbRulesWarning');
      if (warningBox) warningBox.style.display = 'flex';
    }
    await showModal('Sync Notice', 'Saved locally, but Firebase Realtime DB sync failed: ' + e.message + '\n\nPlease check Firebase Console -> Realtime Database -> Rules (Rule instructions are shown on dashboard banner).', false);
  }
}

// Push local data directly to Realtime Database
async function seedFirebaseFromLocal() {
  if (!isSuperAdmin) {
    await showModal('Access Denied', 'Only Main Super Admin can push entire database.', false);
    return;
  }
  if (!data || Object.keys(data).length === 0) {
    await showModal('Error', 'No data available to push.', false);
    return;
  }
  const confirmed = await showModal('Push to Realtime DB', 'Are you sure you want to push current local data to Firebase Realtime Database? This will sync live to all users.', false);
  if (confirmed) {
    try {
      updateSyncStatus('syncing', 'Pushing data to DB...');
      await firebase.database().ref('pyqData').set(data);
      updateSyncStatus('connected', 'Live in Realtime DB');
      const warningBox = document.getElementById('rtdbRulesWarning');
      if (warningBox) warningBox.style.display = 'none';
      await logActivity('IMPORT', 'system', 'Pushed full local data to Realtime Database');
      await showModal('Success', 'Successfully pushed data to Firebase Realtime Database! All students will see changes live.', false);
    } catch (e) {
      console.error(e);
      updateSyncStatus('error', 'Push Failed');
      if (e && (e.code === 'PERMISSION_DENIED' || (e.message && e.message.includes('Permission denied')))) {
        const warningBox = document.getElementById('rtdbRulesWarning');
        if (warningBox) warningBox.style.display = 'flex';
      }
      await showModal('Error', 'Failed to push to Firebase: ' + e.message + '\n\nCheck the red banner on top for rules fix.', false);
    }
  }
}

// Convert file to Base64 Data URL (Universal Fallback for PDFs)
function fileToDataUrl(file, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    if (onProgress) {
      reader.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          onProgress(pct);
        }
      };
    }
    reader.readAsDataURL(file);
  });
}

// Handle opening subject link or previewing PDF blob
function handleAdminSubjectClick(event, branch, year, sem, subject) {
  if (!data || !data[currentSection] || !data[currentSection][branch] || !data[currentSection][branch][year] || !data[currentSection][branch][year][sem]) return;
  const link = data[currentSection][branch][year][sem][subject];
  if (!link) return;

  if (link.startsWith('data:application/pdf')) {
    if (event) event.preventDefault();
    try {
      const parts = link.split(',');
      const byteString = atob(parts[1]);
      const mimeString = parts[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      return;
    } catch (e) {
      console.warn('Error opening PDF blob:', e);
    }
  }
}

// Helper: Deep merge objects
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

// Custom Modal for standard alerts/prompts
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
      resolve(null);
    };

    confirmBtn.onclick = () => {
      cleanup();
      resolve(withInput ? inputEl.value : true);
    };

    overlay.classList.add('show');
    if (withInput) inputEl.focus();
  });
}

// Auth Handlers
async function handleAuth(e) {
  if (e && e.preventDefault) e.preventDefault();
  const emailEl = document.getElementById('email');
  const pwdEl = document.getElementById('password');
  const email = emailEl ? emailEl.value.trim() : '';
  const pwd = pwdEl ? pwdEl.value : '';
  const help = document.getElementById('login-help');

  try {
    await firebase.auth().signInWithEmailAndPassword(email, pwd);
    if (emailEl) emailEl.value = '';
    if (pwdEl) pwdEl.value = '';
    if (help) {
      help.textContent = 'Use your admin credentials to manage PYQ data.';
      help.style.color = 'inherit';
    }
  } catch (error) {
    if (help) {
      help.textContent = error.message;
      help.style.color = 'crimson';
    } else {
      await showModal('Error', error.message, false);
    }
  }
}

async function handleLogout() {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    await showModal('Error', 'Failed to log out.', false);
  }
}

function loadSection() {
  const sel = document.getElementById('section-select');
  currentSection = sel ? sel.value : 'jut';
  buildAdminSection();
}

// Build Admin Dashboard Tree (with real-time role & permission filtering)
function buildAdminSection() {
  updateStorageStats();
  const container = document.getElementById('section-content');
  if (!container) return;
  container.innerHTML = '';

  if (currentUser && !isSuperAdmin && !canAccessSection(currentSection)) {
    container.innerHTML = `<p class="muted" style="text-align:center; padding:32px;">Aapko is section (<strong>${currentSection.toUpperCase()}</strong>) ka access nahi diya gaya hai.</p>`;
    return;
  }

  const allowEdit = canAddOrEdit();
  const allowDelete = canDelete();

  if (currentSection === 'notes') {
    ensureNotesBranches();
    buildNotesAdminSection(container);
    return;
  }

  if (!data || !data[currentSection]) {
    container.innerHTML = '<p class="muted" style="text-align:center; padding:32px;">No data found for this section. You can import JSON or add new branches.</p>';
    return;
  }

  const sectionData = data[currentSection];
  let visibleBranchCount = 0;
  for (const branchName of cleanKeys(sectionData)) {
    if (!canAccessBranch(branchName)) continue;
    visibleBranchCount++;

    const branchDiv = document.createElement('div');
    branchDiv.className = 'branch';
    branchDiv.innerHTML = `
      <div class="branch-head" onclick="toggleNode(this)">
        <span class="toggler">${iconToggle}</span> ${branchName}
        <div class="action-bar" onclick="event.stopPropagation()">
          ${allowDelete ? `<button class="btn-icon" onclick="deleteBranch('${escapeStr(branchName)}')" aria-label="Delete Branch" title="Delete Branch">${iconDelete}</button>` : ''}
        </div>
      </div>
      <div class="branch-body">
        <div class="body-inner">
        ${cleanKeys(sectionData[branchName]).sort((a, b) => b - a).map(year => `
          <div class="year">
            <div class="year-head" onclick="toggleNode(this)">
              <span class="toggler">${iconToggle}</span> ${year}
              <div class="action-bar" onclick="event.stopPropagation()">
                ${allowEdit ? `<button class="btn-icon edit" onclick="editYear('${escapeStr(branchName)}', '${escapeStr(year)}')" aria-label="Edit">${iconEdit}</button>` : ''}
                ${allowDelete ? `<button class="btn-icon" onclick="deleteYear('${escapeStr(branchName)}', '${escapeStr(year)}')" aria-label="Delete">${iconDelete}</button>` : ''}
              </div>
            </div>
            <div class="year-body">
              <div class="body-inner">
              ${sortSemesters(cleanKeys(sectionData[branchName][year])).filter(sem => canAccessSemester(sem)).map(sem => {
                const uniqueId = safeId(`${branchName}-${year}-${sem}`);
                return `
                <div class="semester">
                  <div class="sem-head" onclick="toggleNode(this)">
                    <span class="toggler">${iconToggle}</span> ${sem}
                    <div class="action-bar" onclick="event.stopPropagation()">
                      ${allowEdit ? `<button class="btn-icon edit" onclick="editSemester('${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}')" aria-label="Edit">${iconEdit}</button>` : ''}
                      ${allowDelete ? `<button class="btn-icon" onclick="deleteSemester('${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}')" aria-label="Delete">${iconDelete}</button>` : ''}
                    </div>
                  </div>
                  <div class="sem-body">
                    <div class="body-inner">
                    ${cleanKeys(sectionData[branchName][year][sem]).map(subject => {
                      const link = sectionData[branchName][year][sem][subject] || '#';
                      const isDataUrl = typeof link === 'string' && (link.startsWith('data:application/pdf') || link.startsWith('rtdb-pdf://'));
                      const isPdf = isDataUrl || (typeof link === 'string' && (link.includes('.pdf') || link.includes('firebasestorage.googleapis.com') || link.toLowerCase().includes('alt=media')));
                      const sizeText = isPdf ? getPdfSizeText(link) : '';
                      return `
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                        <a class="subject" href="javascript:void(0)" onclick="handleAdminSubjectClick(event, '${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}', '${escapeStr(subject)}')" style="margin:0; flex:1;" title="Click to view securely">
                          ${subject}
                          ${isPdf ? `<span class="badge-pdf">PDF</span>${sizeText ? `<span class="badge-size">${sizeText}</span>` : ''}` : '<span class="badge-drive">Link</span>'}
                        </a>
                        ${allowEdit ? `<button class="btn-icon edit" onclick="openEditSubjectModal('${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}', '${escapeStr(subject)}')" aria-label="Edit" title="Edit">${iconEdit}</button>` : ''}
                        ${allowDelete ? `<button class="btn-icon" onclick="deleteSubject('${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}', '${escapeStr(subject)}')" aria-label="Delete" title="Delete">${iconDelete}</button>` : ''}
                      </div>
                    `;
                    }).join('')}

                    ${allowEdit ? `
                    <!-- Add Subject Box with Link or PDF -->
                    <div class="admin-subject-box">
                      <div class="box-title">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Subject (Link or PDF)
                      </div>
                      <div class="grid-inputs">
                        <input type="text" class="input" id="subName-${uniqueId}" placeholder="Subject Name (e.g. Mathematics)">
                        <input type="text" class="input" id="subLink-${uniqueId}" placeholder="Drive or Web Link">
                      </div>
                      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                        <label class="file-upload-label" style="flex:1;">
                          <input type="file" id="subFile-${uniqueId}" accept="application/pdf" style="display:none;" onchange="handleFileSelect('${uniqueId}', this)">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          <span id="fileLabel-${uniqueId}">Or Upload PDF File</span>
                        </label>
                        <button class="btn primary" id="addBtn-${uniqueId}" onclick="addSubjectWithMedia('${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}', '${uniqueId}')">
                          ${iconAdd} Add Subject
                        </button>
                      </div>
                      <div id="progressWrap-${uniqueId}" class="upload-progress-wrap">
                        <div id="progressBar-${uniqueId}" class="upload-progress-bar"></div>
                      </div>
                    </div>
                    ` : ''}

                    </div>
                  </div>
                </div>
              `;
              }).join('')}
              ${allowEdit ? `
              <div class="admin-add-row">
                <input type="text" class="input" id="semInput-${safeId(`${branchName}-${year}`)}" placeholder="Enter semester (e.g. semester 3)">
                <button class="btn primary" onclick="addSemester('${escapeStr(branchName)}', '${escapeStr(year)}')">${iconAdd} Add Sem</button>
              </div>
              ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
        ${allowEdit ? `
        <div class="admin-add-row">
          <input type="number" class="input" id="yearInput-${safeId(branchName)}" placeholder="Enter year (e.g. 2025)">
          <button class="btn primary" onclick="addYear('${escapeStr(branchName)}')">${iconAdd} Add Year</button>
        </div>
        ` : ''}
        </div>
      </div>
    `;
    container.appendChild(branchDiv);
  }

  if (visibleBranchCount === 0) {
    container.innerHTML = '<p class="muted" style="text-align:center; padding:32px;">Aapko is section me kisi bhi branch ka access nahi diya gaya hai.</p>';
  }

  // Only Super Admin can create top-level Branches
  if (isSuperAdmin) {
    const newBranchRow = document.createElement('div');
    newBranchRow.className = 'admin-add-row';
    newBranchRow.style.marginTop = '24px';
    newBranchRow.style.paddingTop = '16px';
    newBranchRow.innerHTML = `
      <input type="text" class="input" id="newBranchInput" placeholder="Add new Branch (e.g. CSE, ECE, ME, Civil)">
      <button class="btn primary" onclick="addNewBranch()">${iconAdd} Add Branch</button>
    `;
    container.appendChild(newBranchRow);
  }
}

// Helpers
function escapeStr(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function safeId(str) {
  return (str || '').replace(/[^a-zA-Z0-9_-]/g, '_');
}

function toggleNode(el) {
  const parent = el.parentElement;
  const body = parent.querySelector(':scope > .branch-body, :scope > .year-body, :scope > .sem-body, :scope > .subject-folder-body');
  if (body) body.classList.toggle('active');
  el.classList.toggle('open');
}

const MAX_PDF_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB limit

function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function getPdfSizeText(link) {
  if (typeof link !== 'string') return '';
  if (link.startsWith('data:application/pdf')) {
    const base64Part = link.split(',')[1] || '';
    const bytes = Math.round((base64Part.length * 3) / 4);
    return formatFileSize(bytes);
  }
  if (link.startsWith('rtdb-pdf://')) {
    const match = link.match(/[?&]size=(\d+)/);
    if (match && match[1]) {
      return formatFileSize(parseInt(match[1], 10));
    }
  }
  return '';
}

// Calculate and display total storage used & item count on Admin Dashboard
function updateStorageStats() {
  const sizeEl = document.getElementById('statTotalSize');
  const itemsEl = document.getElementById('statTotalItems');
  if (!sizeEl || !itemsEl || !data) return;

  let totalBytes = 0;
  let totalItems = 0;

  const processUrl = (url) => {
    totalItems++;
    if (typeof url !== 'string') return;
    if (url.startsWith('data:application/pdf')) {
      const base64Part = url.split(',')[1] || '';
      totalBytes += Math.round((base64Part.length * 3) / 4);
    } else if (url.startsWith('rtdb-pdf://')) {
      const match = url.match(/[?&]size=(\d+)/);
      if (match && match[1]) {
        totalBytes += parseInt(match[1], 10);
      }
    }
  };

  // Scan JUT & Chaibasa
  ['jut', 'chaibasa'].forEach(sec => {
    const secObj = data[sec] || {};
    for (const branch of cleanKeys(secObj)) {
      for (const year of cleanKeys(secObj[branch])) {
        for (const sem of cleanKeys(secObj[branch][year])) {
          for (const sub of cleanKeys(secObj[branch][year][sem])) {
            processUrl(secObj[branch][year][sem][sub]);
          }
        }
      }
    }
  });

  // Scan Notes (supports both Single PDF/Link & Subject -> Modules)
  const notesObj = data.notes || {};
  for (const branch of cleanKeys(notesObj)) {
    for (const sem of cleanKeys(notesObj[branch])) {
      for (const sub of cleanKeys(notesObj[branch][sem])) {
        const val = notesObj[branch][sem][sub];
        if (val && typeof val === 'object') {
          for (const mod of cleanKeys(val)) {
            processUrl(val[mod]);
          }
        } else {
          processUrl(val);
        }
      }
    }
  }

  sizeEl.textContent = formatFileSize(totalBytes);
  itemsEl.textContent = totalItems;
}

// Handle file selection preview label with size
function handleFileSelect(uniqueId, fileInput) {
  const label = document.getElementById(`fileLabel-${uniqueId}`);
  if (!label) return;
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    const sizeText = formatFileSize(file.size);
    if (file.size > MAX_PDF_SIZE_BYTES) {
      label.textContent = `Too Large (${sizeText} > 100 MB)`;
      label.style.color = '#ef4444';
    } else {
      label.textContent = `PDF: ${file.name} (${sizeText})`;
      label.style.color = 'var(--primary)';
    }
  } else {
    label.textContent = 'Or Upload PDF File (Max 100 MB)';
    label.style.color = '';
  }
}

// Generate lightweight preview images of first 4 pages at upload time for instant opening
async function generatePreviewPages(file) {
  if (!window.pdfjsLib) return null;
  try {
    const arrayBuf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuf) }).promise;
    const totalPages = pdf.numPages;
    const previewCount = Math.min(4, totalPages);
    const pages = [];
    for (let i = 1; i <= previewCount; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      pages.push(canvas.toDataURL('image/jpeg', 0.78));
    }
    return { totalPages, pages };
  } catch (e) {
    console.warn('Preview generation skipped:', e);
    return null;
  }
}

// Smart PDF Uploader supporting up to 100 MB via chunked Realtime Database
async function uploadPdfSmart(file, onProgress, onStatus) {
  if (file.size > MAX_PDF_SIZE_BYTES) {
    throw new Error(`File size (${formatFileSize(file.size)}) 100 MB limit se badi hai.`);
  }

  if (onStatus) onStatus('Reading PDF...');
  const dataUrl = await fileToDataUrl(file, (pct) => {
    if (onProgress) onProgress(Math.round(pct * 0.2));
  });

  // For small PDFs (< 800 KB), store directly as Data URL
  if (file.size <= 800 * 1024 || !window.firebase || !firebase.database) {
    if (onProgress) onProgress(100);
    return dataUrl;
  }

  // For larger PDFs (up to 100 MB), upload in 4 MB chunks to Realtime DB 'pdfChunks'
  const fileId = 'pdf_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const chunkSize = 4 * 1024 * 1024; // 4 MB base64 chunks
  const totalChunks = Math.ceil(dataUrl.length / chunkSize);

  const chunksRef = firebase.database().ref(`pdfChunks/${fileId}`);
  if (onStatus) onStatus('Creating fast preview...');
  const preview = await generatePreviewPages(file);

  await chunksRef.child('meta').set({
    name: file.name,
    size: file.size,
    totalChunks: totalChunks,
    totalPages: preview ? preview.totalPages : 0,
    createdAt: Date.now()
  });

  if (preview && preview.pages && preview.pages.length > 0) {
    await chunksRef.child('preview').set(preview);
  }

  for (let i = 0; i < totalChunks; i++) {
    const chunk = dataUrl.slice(i * chunkSize, (i + 1) * chunkSize);
    if (onStatus) onStatus(`Uploading (${i + 1}/${totalChunks})...`);
    await chunksRef.child(`chunks/${i}`).set(chunk);
    if (onProgress) {
      const uploadPct = 20 + Math.round(((i + 1) / totalChunks) * 80);
      onProgress(uploadPct);
    }
  }

  return `rtdb-pdf://${fileId}?size=${file.size}`;
}

// Cleanup chunked PDF from Realtime DB when deleted
async function cleanupRtdbPdfIfNeeded(url) {
  if (typeof url === 'string' && url.startsWith('rtdb-pdf://') && window.firebase && firebase.database) {
    try {
      const fileId = url.replace('rtdb-pdf://', '').split('?')[0];
      if (fileId) {
        await firebase.database().ref(`pdfChunks/${fileId}`).remove();
      }
    } catch (e) {
      console.warn('Chunk cleanup notice:', e);
    }
  }
}

// Convert File to Base64 Data URL with progress
function fileToDataUrl(file, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    reader.onload = (e) => {
      if (onProgress) onProgress(100);
      resolve(e.target.result);
    };
    reader.onerror = (e) => reject(new Error('File reading failed.'));
    reader.readAsDataURL(file);
  });
}

// ============================================
// Secure In-Website PDF Viewer & Protection for Admin
// ============================================

let currentPdfDoc = null;
let currentPdfPage = 1;
let currentPdfScale = 1.0;
let totalPdfPages = 0;

// Configure PDF.js Worker
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

function showProtectionToast(message) {
  const toast = document.getElementById('pdfProtectToast');
  if (!toast) return;
  if (message) {
    const span = toast.querySelector('span');
    if (span) span.textContent = message;
  }
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function isPdfViewerOpen() {
  const modal = document.getElementById('pdfViewerModal');
  return modal && modal.classList.contains('show');
}

function closePdfViewer() {
  pdfRenderSession++;
  const modal = document.getElementById('pdfViewerModal');
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }
  const embedFrame = document.getElementById('pdfEmbedFrame');
  if (embedFrame) {
    embedFrame.src = 'about:blank';
    embedFrame.style.display = 'none';
  }
  const container = document.getElementById('pdfCanvasContainer');
  if (container) container.innerHTML = '';
  currentPdfDoc = null;
}

// Open In-Website Viewer for any subject
async function openPdfViewer(title, link) {
  const modal = document.getElementById('pdfViewerModal');
  const titleEl = document.getElementById('pdfViewerTitle');
  const spinner = document.getElementById('pdfLoadingSpinner');
  const canvasContainer = document.getElementById('pdfCanvasContainer');
  const embedFrame = document.getElementById('pdfEmbedFrame');
  const navControls = document.getElementById('pdfNavControls');
  const zoomControls = document.getElementById('pdfZoomControls');

  if (!modal) return;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');

  if (titleEl) titleEl.textContent = title || 'Document Viewer';
  if (spinner) spinner.style.display = 'flex';
  if (canvasContainer) {
    canvasContainer.style.display = 'none';
    canvasContainer.innerHTML = '';
  }
  if (embedFrame) {
    embedFrame.style.display = 'none';
    embedFrame.src = 'about:blank';
  }

  currentPdfPage = 1;
  currentPdfScale = 1.0;
  updateZoomLabel();

  // 1. Direct PDF (Base64 data URL, rtdb-pdf chunked URL, direct .pdf URL, or Firebase Storage URL)
  const isDirectPdf = link.startsWith('data:application/pdf') || link.startsWith('rtdb-pdf://') || link.includes('.pdf') || link.includes('firebasestorage.googleapis.com');

  if (isDirectPdf && window.pdfjsLib) {
    if (navControls) navControls.style.display = 'flex';
    if (zoomControls) zoomControls.style.display = 'flex';

    try {
      let resolvedLink = link;
      const spinnerText = spinner ? spinner.querySelector('p') : null;
      if (spinnerText) spinnerText.textContent = 'Loading document securely...';
      const sessionId = ++pdfRenderSession;
      let previewShownCount = 0;

      if (link.startsWith('rtdb-pdf://')) {
        const fileId = link.replace('rtdb-pdf://', '').split('?')[0];

        try {
          const previewSnap = await firebase.database().ref(`pdfChunks/${fileId}/preview`).once('value');
          const preview = previewSnap.val();
          if (preview && preview.pages && preview.pages.length > 0 && sessionId === pdfRenderSession) {
            previewShownCount = preview.pages.length;
            totalPdfPages = preview.totalPages || previewShownCount;
            const totalEl = document.getElementById('pdfTotalPages');
            const curEl = document.getElementById('pdfCurrentPage');
            if (totalEl) totalEl.textContent = totalPdfPages;
            if (curEl) curEl.textContent = 1;

            if (spinner) spinner.style.display = 'none';
            if (canvasContainer) {
              canvasContainer.style.display = 'flex';
              canvasContainer.innerHTML = '';
              preview.pages.forEach((imgUrl, idx) => {
                const pageCard = document.createElement('div');
                pageCard.className = 'pdf-page-card';
                pageCard.id = `pdf-page-${idx + 1}`;
                pageCard.dataset.pageNum = String(idx + 1);
                pageCard.dataset.rendered = 'preview';
                pageCard.innerHTML = `<img src="${imgUrl}" style="display:block;width:100%;max-width:720px;height:auto;pointer-events:none;" alt="Page ${idx + 1}"><div class="pdf-shield-overlay" title="Protected Document"></div>`;
                canvasContainer.appendChild(pageCard);
              });
              for (let p = previewShownCount + 1; p <= totalPdfPages; p++) {
                const pageCard = document.createElement('div');
                pageCard.className = 'pdf-page-card is-placeholder';
                pageCard.id = `pdf-page-${p}`;
                pageCard.dataset.pageNum = String(p);
                pageCard.innerHTML = `<div class="pdf-page-loading">Downloading remaining pages (${p} / ${totalPdfPages})...</div>`;
                canvasContainer.appendChild(pageCard);
              }
            }
          }
        } catch (prevErr) {
          console.warn('Preview fetch skipped:', prevErr);
        }

        const metaSnap = await firebase.database().ref(`pdfChunks/${fileId}/meta`).once('value');
        if (sessionId !== pdfRenderSession) return;
        const meta = metaSnap.val();
        if (meta && meta.totalChunks) {
          let loadedChunks = 0;
          const chunkPromises = [];
          for (let i = 0; i < meta.totalChunks; i++) {
            chunkPromises.push(
              firebase.database().ref(`pdfChunks/${fileId}/chunks/${i}`).once('value').then(s => {
                loadedChunks++;
                if (spinnerText && previewShownCount === 0) {
                  spinnerText.textContent = `Loading PDF (${loadedChunks}/${meta.totalChunks})...`;
                }
                return s.val() || '';
              })
            );
          }
          const parts = await Promise.all(chunkPromises);
          resolvedLink = parts.join('');
        } else {
          const snap = await firebase.database().ref(`pdfChunks/${fileId}/chunks`).once('value');
          const chunksVal = snap.val();
          if (!chunksVal) throw new Error('PDF data not found in database.');
          const ordered = Array.isArray(chunksVal)
            ? chunksVal
            : Object.keys(chunksVal).sort((a, b) => Number(a) - Number(b)).map(k => chunksVal[k]);
          resolvedLink = ordered.join('');
        }
      }

      if (sessionId !== pdfRenderSession) return;
      if (spinnerText && previewShownCount === 0) spinnerText.textContent = 'Opening pages...';

      let docInit = null;
      if (resolvedLink.startsWith('data:application/pdf')) {
        const res = await fetch(resolvedLink);
        const buf = await res.arrayBuffer();
        docInit = { data: new Uint8Array(buf) };
      } else {
        docInit = { url: resolvedLink };
      }

      currentPdfDoc = await pdfjsLib.getDocument(docInit).promise;
      if (sessionId !== pdfRenderSession) return;
      totalPdfPages = currentPdfDoc.numPages;
      const totalEl = document.getElementById('pdfTotalPages');
      const curEl = document.getElementById('pdfCurrentPage');
      if (totalEl) totalEl.textContent = totalPdfPages;
      if (previewShownCount === 0 && curEl) curEl.textContent = 1;

      if (spinner) spinner.style.display = 'none';
      if (canvasContainer) canvasContainer.style.display = 'flex';

      await renderAllPdfPages(previewShownCount);
    } catch (err) {
      console.warn('PDF.js render failed:', err);
      if (link.startsWith('data:application/pdf') || link.startsWith('rtdb-pdf://')) {
        if (spinner) spinner.style.display = 'none';
        if (canvasContainer) {
          canvasContainer.style.display = 'flex';
          canvasContainer.innerHTML = `<div class="pdf-page-card is-placeholder"><div class="pdf-page-loading" style="color:#ef4444;">Failed to load PDF: ${err.message}</div></div>`;
        }
      } else {
        renderEmbeddedDriveOrWeb(link);
      }
    }
  } else {
    // 2. Google Drive Link or Web Link -> In-Website Embedded Protected Frame
    renderEmbeddedDriveOrWeb(link);
  }
}

// Embed Drive / Web link inside in-website modal
function renderEmbeddedDriveOrWeb(link) {
  const spinner = document.getElementById('pdfLoadingSpinner');
  const canvasContainer = document.getElementById('pdfCanvasContainer');
  const embedFrame = document.getElementById('pdfEmbedFrame');
  const navControls = document.getElementById('pdfNavControls');
  const zoomControls = document.getElementById('pdfZoomControls');

  if (navControls) navControls.style.display = 'none';
  if (zoomControls) zoomControls.style.display = 'none';
  if (canvasContainer) canvasContainer.style.display = 'none';

  let embedUrl = link;
  const driveMatch = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    embedUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview?rm=minimal`;
  }

  if (embedFrame) {
    embedFrame.style.display = 'block';
    embedFrame.src = embedUrl;
    embedFrame.onload = () => {
      if (spinner) spinner.style.display = 'none';
    };
  }
}

// Progressive rendering session counter (cancels stale background renders on zoom/close)
let pdfRenderSession = 0;

// Sort semesters in natural serial order (Semester 1, Semester 2, ..., Semester 10)
function sortSemesters(keys) {
  return [...keys].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
}

// Render a single PDF page into its placeholder card
async function renderSinglePdfPage(pdfDoc, pageNum, pageCard, sessionId) {
  if (!pdfDoc || !pageCard || sessionId !== pdfRenderSession) return;
  if (pageCard.dataset.rendered === 'true' || pageCard.dataset.rendering === 'true') return;
  pageCard.dataset.rendering = 'true';

  try {
    const page = await pdfDoc.getPage(pageNum);
    if (sessionId !== pdfRenderSession) return;

    const viewport = page.getViewport({ scale: currentPdfScale * 1.5 });
    pageCard.innerHTML = '';
    pageCard.classList.remove('is-placeholder');
    pageCard.style.minHeight = '';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = `${viewport.width / 1.5}px`;
    canvas.style.height = `${viewport.height / 1.5}px`;

    // Transparent Shield Overlay on top of canvas to prevent right-click save
    const shield = document.createElement('div');
    shield.className = 'pdf-shield-overlay';
    shield.setAttribute('title', 'Protected Document');

    pageCard.appendChild(canvas);
    pageCard.appendChild(shield);

    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
    pageCard.dataset.rendered = 'true';
  } catch (err) {
    console.warn(`Failed rendering page ${pageNum}:`, err);
  } finally {
    delete pageCard.dataset.rendering;
  }
}

// Progressive Render: opens first 4 pages immediately, loads remaining pages in background
async function renderAllPdfPages(existingPreviewCount = 0) {
  const container = document.getElementById('pdfCanvasContainer');
  if (!container || !currentPdfDoc) return;

  const sessionId = ++pdfRenderSession;
  const total = currentPdfDoc.numPages;
  const viewerBody = document.getElementById('pdfViewerBody');

  const observer = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && sessionId === pdfRenderSession) {
        const pNum = parseInt(entry.target.dataset.pageNum, 10);
        if (pNum) renderSinglePdfPage(currentPdfDoc, pNum, entry.target, sessionId);
      }
    });
  }, { root: viewerBody, rootMargin: '400px 0px' }) : null;

  let cards = [];
  if (existingPreviewCount > 0 && container.children.length === total) {
    cards = Array.from(container.children);
    cards.forEach(c => { if (observer) observer.observe(c); });
  } else {
    container.innerHTML = '';
    for (let pageNum = 1; pageNum <= total; pageNum++) {
      const pageCard = document.createElement('div');
      pageCard.className = 'pdf-page-card is-placeholder';
      pageCard.id = `pdf-page-${pageNum}`;
      pageCard.dataset.pageNum = String(pageNum);
      pageCard.innerHTML = `<div class="pdf-page-loading">Loading Page ${pageNum} of ${total}...</div>`;
      container.appendChild(pageCard);
      cards.push(pageCard);
      if (observer) observer.observe(pageCard);
    }
  }

  const initialCount = existingPreviewCount > 0 ? existingPreviewCount : Math.min(4, total);
  if (existingPreviewCount === 0) {
    for (let i = 1; i <= initialCount; i++) {
      if (sessionId !== pdfRenderSession) return;
      await renderSinglePdfPage(currentPdfDoc, i, cards[i - 1], sessionId);
    }
  }

  (async function loadRest() {
    const startIdx = existingPreviewCount > 0 ? existingPreviewCount + 1 : initialCount + 1;
    for (let i = startIdx; i <= total; i++) {
      if (sessionId !== pdfRenderSession) return;
      await renderSinglePdfPage(currentPdfDoc, i, cards[i - 1], sessionId);
      await new Promise(r => setTimeout(r, 15));
    }
    for (let i = 1; i <= existingPreviewCount; i++) {
      if (sessionId !== pdfRenderSession) return;
      await renderSinglePdfPage(currentPdfDoc, i, cards[i - 1], sessionId);
      await new Promise(r => setTimeout(r, 15));
    }
  })();
}

// Zoom controls
function zoomPdf(delta) {
  const newScale = Math.min(Math.max(currentPdfScale + delta, 0.6), 2.4);
  if (newScale === currentPdfScale) return;
  currentPdfScale = newScale;
  updateZoomLabel();
  renderAllPdfPages();
}

function updateZoomLabel() {
  const el = document.getElementById('pdfZoomLevel');
  if (el) el.textContent = `${Math.round(currentPdfScale * 100)}%`;
}

// Page jump controls
function changePdfPage(delta) {
  const targetPage = currentPdfPage + delta;
  if (targetPage >= 1 && targetPage <= totalPdfPages) {
    currentPdfPage = targetPage;
    const curEl = document.getElementById('pdfCurrentPage');
    if (curEl) curEl.textContent = currentPdfPage;
    const targetCard = document.getElementById(`pdf-page-${currentPdfPage}`);
    if (targetCard) {
      if (targetCard.dataset.rendered !== 'true' && currentPdfDoc) {
        renderSinglePdfPage(currentPdfDoc, currentPdfPage, targetCard, pdfRenderSession);
      }
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Handle Admin clicking subject to open inside in-website secure viewer
function handleAdminSubjectClick(event, branch, year, sem, subject) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  let link = '#';
  if (data && data[currentSection] && data[currentSection][branch] && data[currentSection][branch][year] && data[currentSection][branch][year][sem]) {
    link = data[currentSection][branch][year][sem][subject] || '#';
  }
  if (!link || link === '#') return;

  openPdfViewer(subject, link);
}

// Global viewer protection listeners for admin
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('pdfViewerModal');
  if (modal) {
    modal.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showProtectionToast('Right-click is disabled to protect document.');
    });
    modal.addEventListener('dragstart', (e) => e.preventDefault());
  }

  window.addEventListener('keydown', (e) => {
    if (!isPdfViewerOpen()) return;
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      showProtectionToast('Downloading is disabled on this document.');
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      showProtectionToast('Printing is disabled on this document.');
    } else if (e.key === 'Escape') {
      closePdfViewer();
    }
  });

  const viewerBody = document.getElementById('pdfViewerBody');
  if (viewerBody) {
    viewerBody.addEventListener('scroll', () => {
      if (!currentPdfDoc) return;
      const cards = viewerBody.querySelectorAll('.pdf-page-card');
      const scrollTop = viewerBody.scrollTop + 100;
      cards.forEach((card, index) => {
        if (card.offsetTop <= scrollTop) {
          currentPdfPage = index + 1;
          const curEl = document.getElementById('pdfCurrentPage');
          if (curEl) curEl.textContent = currentPdfPage;
        }
      });
    });
  }
});

// ADD SUBJECT with Link OR PDF Upload
async function addSubjectWithMedia(branch, year, sem, uniqueId) {
  if (!(await checkPermissionOrAlert('add', currentSection, branch, sem))) return;
  const nameInput = document.getElementById(`subName-${uniqueId}`);
  const linkInput = document.getElementById(`subLink-${uniqueId}`);
  const fileInput = document.getElementById(`subFile-${uniqueId}`);
  const addBtn = document.getElementById(`addBtn-${uniqueId}`);
  const progressWrap = document.getElementById(`progressWrap-${uniqueId}`);
  const progressBar = document.getElementById(`progressBar-${uniqueId}`);

  const subject = nameInput ? nameInput.value.trim() : '';
  const link = linkInput ? linkInput.value.trim() : '';
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;

  if (!subject) {
    await showModal('Missing Info', 'Please enter a Subject Name.', false);
    return;
  }

  if (!link && !file) {
    await showModal('Missing Media', 'Please provide either a Drive/Web Link OR choose a PDF file to upload.', false);
    return;
  }

  if (data[currentSection][branch][year][sem][subject]) {
    await showModal('Already Exists', `Subject "${subject}" already exists in this semester.`, false);
    return;
  }

  let finalUrl = link;

  // If PDF file selected: Upload up to 100 MB
  if (file) {
    if (file.size > MAX_PDF_SIZE_BYTES) {
      await showModal('PDF Size Limit', `File size (${formatFileSize(file.size)}) 100 MB se badi hai. Maximum 100 MB tak ki PDF upload kar sakte hain.`, false);
      return;
    }

    addBtn.disabled = true;
    addBtn.textContent = 'Uploading...';
    if (progressWrap) progressWrap.style.display = 'block';

    try {
      finalUrl = await uploadPdfSmart(
        file,
        (pct) => { if (progressBar) progressBar.style.width = pct + '%'; },
        (statusText) => { addBtn.textContent = statusText; }
      );
      if (progressBar) progressBar.style.width = '100%';
    } catch (readErr) {
      addBtn.disabled = false;
      addBtn.innerHTML = `${iconAdd} Add Subject`;
      if (progressWrap) progressWrap.style.display = 'none';
      await showModal('Upload Error', 'Failed to upload PDF file: ' + readErr.message, false);
      return;
    }
  }

  // Save subject to data structure & sync to Realtime Database
  data[currentSection][branch][year][sem][subject] = finalUrl;
  await saveData();
  await logActivity('ADD', currentSection, `${branch} > ${year} > ${sem} > ${subject} (${file ? 'PDF' : 'Link'})`);
  buildAdminSection();
}

// Modal Edit Subject State
let editSubjectState = null;

function openEditSubjectModal(branch, year, sem, subject, moduleName = null) {
  editSubjectState = { branch, year, sem, oldSubject: subject, moduleName };
  let targetObj;
  let itemKey = subject;
  if (year === null && currentSection === 'notes') {
    if (moduleName !== null) {
      targetObj = data.notes[branch][sem][subject];
      itemKey = moduleName;
    } else {
      targetObj = data.notes[branch][sem];
    }
  } else {
    targetObj = data[currentSection][branch][year][sem];
  }
  const currentLink = (targetObj && targetObj[itemKey]) ? targetObj[itemKey] : '';

  const nameInput = document.getElementById('editSubjectName');
  const linkInput = document.getElementById('editSubjectLink');
  const fileInput = document.getElementById('editSubjectFile');
  const fileLabel = document.getElementById('editSubjectFileLabel');
  const progressWrap = document.getElementById('editUploadProgressWrap');
  const progressBar = document.getElementById('editUploadProgressBar');

  if (nameInput) nameInput.value = itemKey;
  if (linkInput) linkInput.value = (currentLink.startsWith('data:application/pdf') || currentLink.startsWith('rtdb-pdf://')) ? '[Existing PDF File]' : currentLink;
  if (fileInput) fileInput.value = '';
  if (fileLabel) {
    fileLabel.textContent = 'Choose PDF (Optional)';
    fileLabel.style.color = '';
  }
  if (progressWrap) progressWrap.style.display = 'none';
  if (progressBar) progressBar.style.width = '0%';

  const modal = document.getElementById('subjectModal');
  if (modal) modal.classList.add('show');

  const saveBtn = document.getElementById('subjectModalSave');
  if (saveBtn) {
    saveBtn.onclick = handleSubjectModalSave;
  }
}

function closeSubjectModal() {
  const modal = document.getElementById('subjectModal');
  if (modal) modal.classList.remove('show');
  editSubjectState = null;
}

function handleModalFileChange(fileInput) {
  const label = document.getElementById('editSubjectFileLabel');
  if (!label) return;
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    const sizeText = formatFileSize(file.size);
    if (file.size > MAX_PDF_SIZE_BYTES) {
      label.textContent = `Too Large (${sizeText} > 100 MB)`;
      label.style.color = '#ef4444';
    } else {
      label.textContent = `PDF: ${file.name} (${sizeText})`;
      label.style.color = 'var(--primary)';
    }
  } else {
    label.textContent = 'Choose PDF (Optional)';
    label.style.color = '';
  }
}

async function handleSubjectModalSave() {
  if (!editSubjectState) return;
  const { branch, year, sem, oldSubject, moduleName } = editSubjectState;
  if (!(await checkPermissionOrAlert('edit', currentSection, branch, sem))) return;

  const nameInput = document.getElementById('editSubjectName');
  const linkInput = document.getElementById('editSubjectLink');
  const fileInput = document.getElementById('editSubjectFile');
  const saveBtn = document.getElementById('subjectModalSave');
  const progressWrap = document.getElementById('editUploadProgressWrap');
  const progressBar = document.getElementById('editUploadProgressBar');

  let targetObj;
  let oldKey = oldSubject;
  if (year === null && currentSection === 'notes') {
    if (moduleName !== null && moduleName !== undefined) {
      targetObj = data.notes[branch][sem][oldSubject];
      oldKey = moduleName;
    } else {
      targetObj = data.notes[branch][sem];
    }
  } else {
    targetObj = data[currentSection][branch][year][sem];
  }

  const newSubject = nameInput ? nameInput.value.trim() : '';
  let finalLink = linkInput ? linkInput.value.trim() : '';
  if (finalLink === '[Existing PDF File]') {
    finalLink = targetObj[oldKey];
  }
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;

  if (!newSubject) {
    alert('Subject name cannot be empty.');
    return;
  }

  // Upload new PDF if provided (up to 100 MB)
  if (file) {
    if (file.size > MAX_PDF_SIZE_BYTES) {
      alert(`File size (${formatFileSize(file.size)}) 100 MB se badi hai. Maximum 100 MB allowed hai.`);
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Uploading...';
    if (progressWrap) progressWrap.style.display = 'block';

    try {
      const oldUrl = targetObj[oldKey];
      finalLink = await uploadPdfSmart(
        file,
        (pct) => { if (progressBar) progressBar.style.width = pct + '%'; },
        (statusText) => { saveBtn.textContent = statusText; }
      );
      if (progressBar) progressBar.style.width = '100%';
      await cleanupRtdbPdfIfNeeded(oldUrl);
    } catch (readErr) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Changes';
      if (progressWrap) progressWrap.style.display = 'none';
      alert('Failed to upload PDF file: ' + readErr.message);
      return;
    }
  }

  if (!finalLink) {
    alert('Please provide a Link or choose a PDF file.');
    return;
  }

  // Update object
  if (newSubject !== oldKey) {
    delete targetObj[oldKey];
  }
  targetObj[newSubject] = finalLink;

  saveBtn.disabled = false;
  saveBtn.textContent = 'Save Changes';
  closeSubjectModal();
  await saveData();
  const pathDesc = (year === null && currentSection === 'notes')
    ? (moduleName ? `${branch} > ${sem} > ${oldSubject} > ${newSubject}` : `${branch} > ${sem} > ${newSubject}`)
    : `${branch} > ${year} > ${sem} > ${newSubject}`;
  await logActivity('UPDATE', currentSection, `Updated: ${pathDesc}`);
  buildAdminSection();
}

// Delete Subject
async function deleteSubject(branch, year, sem, subject) {
  if (!(await checkPermissionOrAlert('delete', currentSection, branch, sem))) return;
  const confirmed = await showModal('Delete Subject', `Are you sure you want to delete subject "${subject}"?`, false);
  if (confirmed) {
    const oldUrl = data[currentSection][branch][year][sem][subject];
    await cleanupRtdbPdfIfNeeded(oldUrl);
    delete data[currentSection][branch][year][sem][subject];
    await saveData();
    await logActivity('DELETE', currentSection, `${branch} > ${year} > ${sem} > ${subject}`);
    buildAdminSection();
  }
}

// Branch Management
async function addNewBranch() {
  if (!isSuperAdmin) {
    await showModal('Access Denied', 'Sirf Main Super Admin hi nayi Branch add kar sakta hai.', false);
    return;
  }
  const input = document.getElementById('newBranchInput');
  const branch = input ? input.value.trim() : '';
  if (!branch) return;
  if (!data[currentSection]) data[currentSection] = {};
  const existing = Object.keys(data[currentSection]).find(b => b.toLowerCase() === branch.toLowerCase());
  if (existing) {
    await showModal('Error', `Branch "${existing}" already exists.`, false);
    return;
  }
  data[currentSection][branch] = { _init: true };
  if (input) input.value = '';
  await saveData();
  await logActivity('ADD', currentSection, `Added Branch: ${branch}`);
  populatePermissionCheckboxes('create');
  buildAdminSection();
}

async function deleteBranch(branch) {
  if (!(await checkPermissionOrAlert('delete', currentSection, branch, null))) return;
  const confirmed = await showModal('Delete Branch', `Are you sure you want to delete branch "${branch}" and all its subjects?`, false);
  if (confirmed) {
    delete data[currentSection][branch];
    await saveData();
    await logActivity('DELETE', currentSection, `Deleted Branch: ${branch}`);
    buildAdminSection();
  }
}

// Year Management
async function addYear(branch) {
  if (!(await checkPermissionOrAlert('add', currentSection, branch, null))) return;
  const input = document.getElementById('yearInput-' + safeId(branch));
  const year = input ? input.value.trim() : '';
  if (year && !data[currentSection][branch][year]) {
    data[currentSection][branch][year] = { _init: true };
    input.value = '';
    await saveData();
    await logActivity('ADD', currentSection, `${branch} > Added Year: ${year}`);
    buildAdminSection();
  } else if (year) {
    await showModal('Error', 'Year already exists.', false);
  }
}

async function editYear(branch, oldYear) {
  if (!(await checkPermissionOrAlert('edit', currentSection, branch, null))) return;
  const newYear = await showModal('Edit Year', `Enter new year:`, true, oldYear);
  if (newYear && newYear.trim() !== '' && newYear !== oldYear) {
    data[currentSection][branch][newYear] = data[currentSection][branch][oldYear];
    delete data[currentSection][branch][oldYear];
    await saveData();
    await logActivity('UPDATE', currentSection, `${branch} > Renamed Year ${oldYear} to ${newYear}`);
    buildAdminSection();
  }
}

async function deleteYear(branch, year) {
  if (!(await checkPermissionOrAlert('delete', currentSection, branch, null))) return;
  const confirmed = await showModal('Delete Year', `Are you sure you want to delete year ${year}?`, false);
  if (confirmed) {
    delete data[currentSection][branch][year];
    await saveData();
    await logActivity('DELETE', currentSection, `${branch} > Deleted Year: ${year}`);
    buildAdminSection();
  }
}

// Semester Management
async function addSemester(branch, year) {
  if (!(await checkPermissionOrAlert('add', currentSection, branch, null))) return;
  const input = document.getElementById('semInput-' + safeId(`${branch}-${year}`));
  const sem = input ? input.value.trim() : '';
  if (sem && !data[currentSection][branch][year][sem]) {
    data[currentSection][branch][year][sem] = { _init: true };
    input.value = '';
    await saveData();
    await logActivity('ADD', currentSection, `${branch} > ${year} > Added Semester: ${sem}`);
    buildAdminSection();
  } else if (sem) {
    await showModal('Error', 'Semester already exists.', false);
  }
}

async function editSemester(branch, year, oldSem) {
  if (!(await checkPermissionOrAlert('edit', currentSection, branch, oldSem))) return;
  const newSem = await showModal('Edit Semester', `Enter new semester:`, true, oldSem);
  if (newSem && newSem.trim() !== '' && newSem !== oldSem) {
    data[currentSection][branch][year][newSem] = data[currentSection][branch][year][oldSem];
    delete data[currentSection][branch][year][oldSem];
    await saveData();
    await logActivity('UPDATE', currentSection, `${branch} > ${year} > Renamed Semester ${oldSem} to ${newSem}`);
    buildAdminSection();
  }
}

async function deleteSemester(branch, year, sem) {
  if (!(await checkPermissionOrAlert('delete', currentSection, branch, sem))) return;
  const confirmed = await showModal('Delete Semester', `Are you sure you want to delete semester ${sem}?`, false);
  if (confirmed) {
    delete data[currentSection][branch][year][sem];
    await saveData();
    await logActivity('DELETE', currentSection, `${branch} > ${year} > Deleted Semester: ${sem}`);
    buildAdminSection();
  }
}

// Export / Import
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
  if (!isSuperAdmin) {
    await showModal('Access Denied', 'Only Main Super Admin can import JSON.', false);
    return;
  }
  const fileInput = document.getElementById('importFile');
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    await showModal('Warning', 'Please choose a JSON file first.', false);
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      const merge = document.getElementById('mergeImport') && document.getElementById('mergeImport').checked;
      if (merge) {
        data = deepMerge(data, parsed);
      } else {
        data = parsed;
      }
      await saveData();
      await logActivity('IMPORT', 'system', `Imported JSON (${merge ? 'Merged' : 'Replaced'})`);
      buildAdminSection();
      await showModal('Success', 'Import successful and synced to Realtime Database.', false);
      fileInput.value = '';
      const fname = document.getElementById('file-name');
      if (fname) fname.textContent = 'Choose JSON';
    } catch (err) {
      console.error('Failed to import JSON', err);
      await showModal('Error', 'Invalid JSON file.', false);
    }
  };
  reader.onerror = async function () {
    await showModal('Error', 'Failed to read file.', false);
  };
  reader.readAsText(file);
}

// ============================================
// Notes Management (Branch -> Semester -> Note)
// ============================================

function buildNotesAdminSection(container) {
  ensureNotesBranches();
  const notesData = data.notes || {};
  const allowEdit = canAddOrEdit();
  const allowDelete = canDelete();
  let visibleBranchCount = 0;

  for (const branchName of cleanKeys(notesData)) {
    if (!canAccessBranch(branchName)) continue;
    visibleBranchCount++;

    const branchObj = notesData[branchName] || {};
    const branchDiv = document.createElement('div');
    branchDiv.className = 'branch';
    branchDiv.innerHTML = `
      <div class="branch-head" onclick="toggleNode(this)">
        <span class="toggler">${iconToggle}</span> ${branchName}
        <div class="action-bar" onclick="event.stopPropagation()">
          ${allowDelete ? `<button class="btn-icon" onclick="deleteBranch('${escapeStr(branchName)}')" aria-label="Delete Branch" title="Delete Branch">${iconDelete}</button>` : ''}
        </div>
      </div>
      <div class="branch-body">
        <div class="body-inner">
        ${sortSemesters(cleanKeys(branchObj)).filter(sem => canAccessSemester(sem)).map(sem => {
          const uniqueId = safeId(`notes-${branchName}-${sem}`);
          const semObj = branchObj[sem] || {};
          return `
          <div class="semester">
            <div class="sem-head" onclick="toggleNode(this)">
              <span class="toggler">${iconToggle}</span> ${sem}
              <div class="action-bar" onclick="event.stopPropagation()">
                ${allowEdit ? `<button class="btn-icon edit" onclick="editNoteSemester('${escapeStr(branchName)}', '${escapeStr(sem)}')" aria-label="Edit">${iconEdit}</button>` : ''}
                ${allowDelete ? `<button class="btn-icon" onclick="deleteNoteSemester('${escapeStr(branchName)}', '${escapeStr(sem)}')" aria-label="Delete">${iconDelete}</button>` : ''}
              </div>
            </div>
            <div class="sem-body">
              <div class="body-inner">
              ${cleanKeys(semObj).map(subject => {
                const entry = semObj[subject];
                if (entry && typeof entry === 'object') {
                  // Subject Folder containing Modules
                  const modUniqueId = safeId(`notes-${branchName}-${sem}-${subject}`);
                  const modKeys = sortSemesters(cleanKeys(entry));
                  return `
                  <div class="subject-folder">
                    <div class="subject-folder-head" onclick="toggleNode(this)">
                      <span class="toggler">${iconToggle}</span>
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--primary);flex-shrink:0;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                      <span style="font-weight:600;">${subject}</span>
                      <span class="module-count-badge">${modKeys.length} Module${modKeys.length === 1 ? '' : 's'}</span>
                      <div class="action-bar" onclick="event.stopPropagation()">
                        ${allowEdit ? `<button class="btn-icon edit" onclick="editNoteSubjectFolder('${escapeStr(branchName)}', '${escapeStr(sem)}', '${escapeStr(subject)}')" aria-label="Rename Subject" title="Rename Subject">${iconEdit}</button>` : ''}
                        ${allowDelete ? `<button class="btn-icon" onclick="deleteNoteSubjectFolder('${escapeStr(branchName)}', '${escapeStr(sem)}', '${escapeStr(subject)}')" aria-label="Delete Subject Folder" title="Delete Subject Folder">${iconDelete}</button>` : ''}
                      </div>
                    </div>
                    <div class="subject-folder-body">
                      <div class="body-inner">
                        ${modKeys.length === 0 ? '<p class="muted" style="font-size:12px; margin:6px 0;">No modules yet. Add Module 1, Module 2 below.</p>' : modKeys.map(modName => {
                          const link = entry[modName] || '#';
                          const isDataUrl = typeof link === 'string' && (link.startsWith('data:application/pdf') || link.startsWith('rtdb-pdf://'));
                          const isPdf = isDataUrl || (typeof link === 'string' && (link.includes('.pdf') || link.includes('firebasestorage.googleapis.com') || link.toLowerCase().includes('alt=media')));
                          const sizeText = isPdf ? getPdfSizeText(link) : '';
                          return `
                          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                            <a class="subject" href="javascript:void(0)" onclick="handleAdminModuleClick(event, '${escapeStr(branchName)}', '${escapeStr(sem)}', '${escapeStr(subject)}', '${escapeStr(modName)}')" style="margin:0; flex:1;" title="Click to view securely">
                              ${modName}
                              ${isPdf ? `<span class="badge-pdf">PDF</span>${sizeText ? `<span class="badge-size">${sizeText}</span>` : ''}` : '<span class="badge-drive">Link</span>'}
                            </a>
                            ${allowEdit ? `<button class="btn-icon edit" onclick="openEditSubjectModal('${escapeStr(branchName)}', null, '${escapeStr(sem)}', '${escapeStr(subject)}', '${escapeStr(modName)}')" aria-label="Edit Module" title="Edit Module">${iconEdit}</button>` : ''}
                            ${allowDelete ? `<button class="btn-icon" onclick="deleteNoteModule('${escapeStr(branchName)}', '${escapeStr(sem)}', '${escapeStr(subject)}', '${escapeStr(modName)}')" aria-label="Delete Module" title="Delete Module">${iconDelete}</button>` : ''}
                          </div>
                          `;
                        }).join('')}

                        ${allowEdit ? `
                        <!-- Add Module Box inside Subject Folder -->
                        <div class="admin-subject-box">
                          <div class="box-title">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add Module to ${subject} (Link or PDF)
                          </div>
                          <div class="grid-inputs">
                            <input type="text" class="input" id="subName-${modUniqueId}" placeholder="Module Name (e.g. Module 1)">
                            <input type="text" class="input" id="subLink-${modUniqueId}" placeholder="Drive or Web Link">
                          </div>
                          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                            <label class="file-upload-label" style="flex:1;">
                              <input type="file" id="subFile-${modUniqueId}" accept="application/pdf" style="display:none;" onchange="handleFileSelect('${modUniqueId}', this)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                              <span id="fileLabel-${modUniqueId}">Or Upload PDF File (Max 100 MB)</span>
                            </label>
                            <button class="btn primary" id="addBtn-${modUniqueId}" onclick="addNoteModuleWithMedia('${escapeStr(branchName)}', '${escapeStr(sem)}', '${escapeStr(subject)}', '${modUniqueId}')">
                              ${iconAdd} Add Module
                            </button>
                          </div>
                          <div id="progressWrap-${modUniqueId}" class="upload-progress-wrap">
                            <div id="progressBar-${modUniqueId}" class="upload-progress-bar"></div>
                          </div>
                        </div>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                  `;
                }

                // Single PDF / Link Subject directly
                const link = entry || '#';
                const isDataUrl = typeof link === 'string' && (link.startsWith('data:application/pdf') || link.startsWith('rtdb-pdf://'));
                const isPdf = isDataUrl || (typeof link === 'string' && (link.includes('.pdf') || link.includes('firebasestorage.googleapis.com') || link.toLowerCase().includes('alt=media')));
                const sizeText = isPdf ? getPdfSizeText(link) : '';
                return `
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                  <a class="subject" href="javascript:void(0)" onclick="handleAdminNoteClick(event, '${escapeStr(branchName)}', '${escapeStr(sem)}', '${escapeStr(subject)}')" style="margin:0; flex:1;" title="Click to view securely">
                    ${subject}
                    ${isPdf ? `<span class="badge-pdf">PDF</span>${sizeText ? `<span class="badge-size">${sizeText}</span>` : ''}` : '<span class="badge-drive">Link</span>'}
                  </a>
                  ${allowEdit ? `<button class="btn-icon edit" onclick="openEditSubjectModal('${escapeStr(branchName)}', null, '${escapeStr(sem)}', '${escapeStr(subject)}')" aria-label="Edit" title="Edit">${iconEdit}</button>` : ''}
                  ${allowDelete ? `<button class="btn-icon" onclick="deleteNote('${escapeStr(branchName)}', '${escapeStr(sem)}', '${escapeStr(subject)}')" aria-label="Delete" title="Delete">${iconDelete}</button>` : ''}
                </div>
              `;
              }).join('')}

              ${allowEdit ? `
              <!-- Option 1: Create Subject Folder (For Multiple Modules) -->
              <div class="admin-add-row" style="margin-bottom: 10px;">
                <input type="text" class="input" id="noteSubFolderInput-${uniqueId}" placeholder="1st Step: Subject Name for Modules (e.g. Mathematics)">
                <button class="btn primary" onclick="addNoteSubjectFolder('${escapeStr(branchName)}', '${escapeStr(sem)}', '${uniqueId}')">${iconAdd} Add Subject Folder</button>
              </div>

              <!-- Option 2: Add Single PDF/Link Subject Directly -->
              <div class="admin-subject-box">
                <div class="box-title">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Or Add Single PDF / Link Subject Directly
                </div>
                <div class="grid-inputs">
                  <input type="text" class="input" id="subName-${uniqueId}" placeholder="Subject Name">
                  <input type="text" class="input" id="subLink-${uniqueId}" placeholder="Drive or Web Link">
                </div>
                <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                  <label class="file-upload-label" style="flex:1;">
                    <input type="file" id="subFile-${uniqueId}" accept="application/pdf" style="display:none;" onchange="handleFileSelect('${uniqueId}', this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span id="fileLabel-${uniqueId}">Or Upload PDF File (Max 100 MB)</span>
                  </label>
                  <button class="btn primary" id="addBtn-${uniqueId}" onclick="addNoteWithMedia('${escapeStr(branchName)}', '${escapeStr(sem)}', '${uniqueId}')">
                    ${iconAdd} Add Single Subject
                  </button>
                </div>
                <div id="progressWrap-${uniqueId}" class="upload-progress-wrap">
                  <div id="progressBar-${uniqueId}" class="upload-progress-bar"></div>
                </div>
              </div>
              ` : ''}

              </div>
            </div>
          </div>
          `;
        }).join('')}
        ${allowEdit ? `
        <div class="admin-add-row">
          <input type="text" class="input" id="noteSemInput-${safeId(branchName)}" placeholder="Enter semester (e.g. Semester 1)">
          <button class="btn primary" onclick="addNoteSemester('${escapeStr(branchName)}')">${iconAdd} Add Sem</button>
        </div>
        ` : ''}
        </div>
      </div>
    `;
    container.appendChild(branchDiv);
  }

  if (visibleBranchCount === 0) {
    container.innerHTML = '<p class="muted" style="text-align:center; padding:32px;">Aapko Notes me kisi bhi branch ka access nahi diya gaya hai.</p>';
  }

  // Only Super Admin can add new Branches
  if (isSuperAdmin) {
    const newBranchRow = document.createElement('div');
    newBranchRow.className = 'admin-add-row';
    newBranchRow.style.marginTop = '24px';
    newBranchRow.style.paddingTop = '16px';
    newBranchRow.innerHTML = `
      <input type="text" class="input" id="newBranchInput" placeholder="Add new Branch (e.g. CSE, ECE, ME, Civil)">
      <button class="btn primary" onclick="addNewBranch()">${iconAdd} Add Branch</button>
    `;
    container.appendChild(newBranchRow);
  }
}

function handleAdminNoteClick(event, branch, sem, subject) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const link = (data && data.notes && data.notes[branch] && data.notes[branch][sem])
    ? data.notes[branch][sem][subject]
    : null;
  if (!link || link === '#') return;
  openPdfViewer(subject + ' (Notes)', link);
}

async function addNoteWithMedia(branch, sem, uniqueId) {
  if (!(await checkPermissionOrAlert('add', 'notes', branch, sem))) return;
  const nameInput = document.getElementById(`subName-${uniqueId}`);
  const linkInput = document.getElementById(`subLink-${uniqueId}`);
  const fileInput = document.getElementById(`subFile-${uniqueId}`);
  const addBtn = document.getElementById(`addBtn-${uniqueId}`);
  const progressWrap = document.getElementById(`progressWrap-${uniqueId}`);
  const progressBar = document.getElementById(`progressBar-${uniqueId}`);

  const subject = nameInput ? nameInput.value.trim() : '';
  const link = linkInput ? linkInput.value.trim() : '';
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;

  if (!subject) {
    await showModal('Missing Info', 'Please enter a Note / Subject Name.', false);
    return;
  }
  if (!link && !file) {
    await showModal('Missing Media', 'Please provide either a Drive/Web Link OR choose a PDF file to upload.', false);
    return;
  }
  if (data.notes[branch][sem][subject]) {
    await showModal('Already Exists', `Note "${subject}" already exists in this semester.`, false);
    return;
  }

  let finalUrl = link;
  if (file) {
    if (file.size > MAX_PDF_SIZE_BYTES) {
      await showModal('PDF Size Limit', `File size (${formatFileSize(file.size)}) 100 MB se badi hai. Maximum 100 MB tak ki PDF upload kar sakte hain.`, false);
      return;
    }
    addBtn.disabled = true;
    addBtn.textContent = 'Uploading...';
    if (progressWrap) progressWrap.style.display = 'block';
    try {
      finalUrl = await uploadPdfSmart(
        file,
        (pct) => { if (progressBar) progressBar.style.width = pct + '%'; },
        (statusText) => { addBtn.textContent = statusText; }
      );
      if (progressBar) progressBar.style.width = '100%';
    } catch (readErr) {
      addBtn.disabled = false;
      addBtn.innerHTML = `${iconAdd} Add Note`;
      if (progressWrap) progressWrap.style.display = 'none';
      await showModal('Upload Error', 'Failed to upload PDF file: ' + readErr.message, false);
      return;
    }
  }

  data.notes[branch][sem][subject] = finalUrl;
  await saveData();
  await logActivity('ADD', 'notes', `${branch} > ${sem} > ${subject} (${file ? 'PDF' : 'Link'})`);
  buildAdminSection();
}

async function deleteNote(branch, sem, subject) {
  if (!(await checkPermissionOrAlert('delete', 'notes', branch, sem))) return;
  const confirmed = await showModal('Delete Note', `Are you sure you want to delete note "${subject}"?`, false);
  if (confirmed) {
    const oldUrl = data.notes[branch][sem][subject];
    await cleanupRtdbPdfIfNeeded(oldUrl);
    delete data.notes[branch][sem][subject];
    await saveData();
    await logActivity('DELETE', 'notes', `${branch} > ${sem} > ${subject}`);
    buildAdminSection();
  }
}

async function addNoteSemester(branch) {
  if (!(await checkPermissionOrAlert('add', 'notes', branch, null))) return;
  const input = document.getElementById('noteSemInput-' + safeId(branch));
  const sem = input ? input.value.trim() : '';
  if (sem && !data.notes[branch][sem]) {
    data.notes[branch][sem] = { _init: true };
    input.value = '';
    await saveData();
    await logActivity('ADD', 'notes', `${branch} > Added Semester: ${sem}`);
    buildAdminSection();
  } else if (sem) {
    await showModal('Error', 'Semester already exists.', false);
  }
}

async function editNoteSemester(branch, oldSem) {
  if (!(await checkPermissionOrAlert('edit', 'notes', branch, oldSem))) return;
  const newSem = await showModal('Edit Semester', `Enter new semester:`, true, oldSem);
  if (newSem && newSem.trim() !== '' && newSem !== oldSem) {
    data.notes[branch][newSem.trim()] = data.notes[branch][oldSem];
    delete data.notes[branch][oldSem];
    await saveData();
    await logActivity('UPDATE', 'notes', `${branch} > Renamed Semester ${oldSem} to ${newSem.trim()}`);
    buildAdminSection();
  }
}

async function deleteNoteSemester(branch, sem) {
  if (!(await checkPermissionOrAlert('delete', 'notes', branch, sem))) return;
  const confirmed = await showModal('Delete Semester', `Are you sure you want to delete semester ${sem} and all its notes?`, false);
  if (confirmed) {
    const semObj = data.notes[branch][sem] || {};
    for (const sub in semObj) {
      if (semObj[sub] && typeof semObj[sub] === 'object') {
        for (const mod in semObj[sub]) {
          await cleanupRtdbPdfIfNeeded(semObj[sub][mod]);
        }
      } else {
        await cleanupRtdbPdfIfNeeded(semObj[sub]);
      }
    }
    delete data.notes[branch][sem];
    await saveData();
    await logActivity('DELETE', 'notes', `${branch} > Deleted Semester: ${sem}`);
    buildAdminSection();
  }
}

// Subject Folder & Module CRUD for Notes
async function addNoteSubjectFolder(branch, sem, uniqueId) {
  if (!(await checkPermissionOrAlert('add', 'notes', branch, sem))) return;
  const input = document.getElementById(`noteSubFolderInput-${uniqueId}`);
  const subjectName = input ? input.value.trim() : '';
  if (!subjectName) {
    await showModal('Missing Info', 'Please enter a Subject Name.', false);
    return;
  }
  if (!data.notes[branch][sem]) data.notes[branch][sem] = { _init: true };
  if (data.notes[branch][sem][subjectName]) {
    await showModal('Already Exists', `Subject "${subjectName}" already exists in this semester.`, false);
    return;
  }
  data.notes[branch][sem][subjectName] = { _init: true };
  if (input) input.value = '';
  await saveData();
  await logActivity('ADD', 'notes', `${branch} > ${sem} > Created Subject Folder: ${subjectName}`);
  buildAdminSection();
}

async function editNoteSubjectFolder(branch, sem, oldSubject) {
  if (!(await checkPermissionOrAlert('edit', 'notes', branch, sem))) return;
  const newSubject = await showModal('Rename Subject', 'Enter new Subject Name:', true, oldSubject);
  if (newSubject && newSubject.trim() !== '' && newSubject.trim() !== oldSubject) {
    const trimmed = newSubject.trim();
    if (data.notes[branch][sem][trimmed]) {
      await showModal('Already Exists', `Subject "${trimmed}" already exists.`, false);
      return;
    }
    data.notes[branch][sem][trimmed] = data.notes[branch][sem][oldSubject];
    delete data.notes[branch][sem][oldSubject];
    await saveData();
    await logActivity('UPDATE', 'notes', `${branch} > ${sem} > Renamed Subject Folder ${oldSubject} to ${trimmed}`);
    buildAdminSection();
  }
}

async function deleteNoteSubjectFolder(branch, sem, subject) {
  if (!(await checkPermissionOrAlert('delete', 'notes', branch, sem))) return;
  const confirmed = await showModal('Delete Subject Folder', `Are you sure you want to delete "${subject}" and all its modules?`, false);
  if (confirmed) {
    const folderObj = data.notes[branch][sem][subject] || {};
    for (const mod in folderObj) {
      await cleanupRtdbPdfIfNeeded(folderObj[mod]);
    }
    delete data.notes[branch][sem][subject];
    await saveData();
    await logActivity('DELETE', 'notes', `${branch} > ${sem} > Deleted Subject Folder: ${subject}`);
    buildAdminSection();
  }
}

function handleAdminModuleClick(event, branch, sem, subject, modName) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const link = (data && data.notes && data.notes[branch] && data.notes[branch][sem] && data.notes[branch][sem][subject])
    ? data.notes[branch][sem][subject][modName]
    : null;
  if (!link || link === '#') return;
  openPdfViewer(`${subject} - ${modName}`, link);
}

async function addNoteModuleWithMedia(branch, sem, subject, uniqueId) {
  if (!(await checkPermissionOrAlert('add', 'notes', branch, sem))) return;
  const nameInput = document.getElementById(`subName-${uniqueId}`);
  const linkInput = document.getElementById(`subLink-${uniqueId}`);
  const fileInput = document.getElementById(`subFile-${uniqueId}`);
  const addBtn = document.getElementById(`addBtn-${uniqueId}`);
  const progressWrap = document.getElementById(`progressWrap-${uniqueId}`);
  const progressBar = document.getElementById(`progressBar-${uniqueId}`);

  const modName = nameInput ? nameInput.value.trim() : '';
  const link = linkInput ? linkInput.value.trim() : '';
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;

  if (!modName) {
    await showModal('Missing Info', 'Please enter a Module Name (e.g. Module 1).', false);
    return;
  }
  if (!link && !file) {
    await showModal('Missing Media', 'Please provide either a Drive/Web Link OR choose a PDF file to upload.', false);
    return;
  }
  if (data.notes[branch][sem][subject][modName]) {
    await showModal('Already Exists', `Module "${modName}" already exists in "${subject}".`, false);
    return;
  }

  let finalUrl = link;
  if (file) {
    if (file.size > MAX_PDF_SIZE_BYTES) {
      await showModal('PDF Size Limit', `File size (${formatFileSize(file.size)}) 100 MB se badi hai. Maximum 100 MB tak ki PDF upload kar sakte hain.`, false);
      return;
    }
    addBtn.disabled = true;
    addBtn.textContent = 'Uploading...';
    if (progressWrap) progressWrap.style.display = 'block';
    try {
      finalUrl = await uploadPdfSmart(
        file,
        (pct) => { if (progressBar) progressBar.style.width = pct + '%'; },
        (statusText) => { addBtn.textContent = statusText; }
      );
      if (progressBar) progressBar.style.width = '100%';
    } catch (readErr) {
      addBtn.disabled = false;
      addBtn.innerHTML = `${iconAdd} Add Module`;
      if (progressWrap) progressWrap.style.display = 'none';
      await showModal('Upload Error', 'Failed to upload PDF file: ' + readErr.message, false);
      return;
    }
  }

  data.notes[branch][sem][subject][modName] = finalUrl;
  await saveData();
  await logActivity('ADD', 'notes', `${branch} > ${sem} > ${subject} > ${modName} (${file ? 'PDF' : 'Link'})`);
  buildAdminSection();
}

async function deleteNoteModule(branch, sem, subject, modName) {
  if (!(await checkPermissionOrAlert('delete', 'notes', branch, sem))) return;
  const confirmed = await showModal('Delete Module', `Are you sure you want to delete "${modName}" from "${subject}"?`, false);
  if (confirmed) {
    const oldUrl = data.notes[branch][sem][subject][modName];
    await cleanupRtdbPdfIfNeeded(oldUrl);
    delete data.notes[branch][sem][subject][modName];
    await saveData();
    await logActivity('DELETE', 'notes', `${branch} > ${sem} > ${subject} > ${modName}`);
    buildAdminSection();
  }
}

