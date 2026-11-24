// admin.js

// Firebase Auth & User state
let currentUser = null;
let data = null;
let currentSection = '';
let realtimeListenerAttached = false;

// UI Elements & Icons
const iconEdit = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>`;
const iconDelete = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;
const iconAdd = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`;
const iconToggle = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
  currentUser = user;
  if (user) {
    document.getElementById('password-section').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    setupRealtimeListener();
    loadSection();
  } else {
    document.getElementById('password-section').style.display = 'block';
    document.getElementById('admin-content').style.display = 'none';
    updateSyncStatus('offline', 'Not Logged In');
  }
});

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
    localStorage.setItem('pyqData', JSON.stringify(data));
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

// Build Admin Dashboard Tree
function buildAdminSection() {
  const container = document.getElementById('section-content');
  if (!container) return;
  container.innerHTML = '';

  if (!data || !data[currentSection]) {
    container.innerHTML = '<p class="muted" style="text-align:center; padding:32px;">No data found for this section. You can import JSON or add new branches.</p>';
    return;
  }

  const sectionData = data[currentSection];
  for (const branchName in sectionData) {
    const branchDiv = document.createElement('div');
    branchDiv.className = 'branch';
    branchDiv.innerHTML = `
      <div class="branch-head" onclick="toggleNode(this)">
        <span class="toggler">${iconToggle}</span> ${branchName}
        <div class="action-bar" onclick="event.stopPropagation()">
          <button class="btn-icon" onclick="deleteBranch('${escapeStr(branchName)}')" aria-label="Delete Branch" title="Delete Branch">${iconDelete}</button>
        </div>
      </div>
      <div class="branch-body">
        <div class="body-inner">
        ${Object.keys(sectionData[branchName]).sort((a, b) => b - a).map(year => `
          <div class="year">
            <div class="year-head" onclick="toggleNode(this)">
              <span class="toggler">${iconToggle}</span> ${year}
              <div class="action-bar" onclick="event.stopPropagation()">
                <button class="btn-icon edit" onclick="editYear('${escapeStr(branchName)}', '${escapeStr(year)}')" aria-label="Edit">${iconEdit}</button>
                <button class="btn-icon" onclick="deleteYear('${escapeStr(branchName)}', '${escapeStr(year)}')" aria-label="Delete">${iconDelete}</button>
              </div>
            </div>
            <div class="year-body">
              <div class="body-inner">
              ${Object.keys(sectionData[branchName][year]).map(sem => {
                const uniqueId = safeId(`${branchName}-${year}-${sem}`);
                return `
                <div class="semester">
                  <div class="sem-head" onclick="toggleNode(this)">
                    <span class="toggler">${iconToggle}</span> ${sem}
                    <div class="action-bar" onclick="event.stopPropagation()">
                      <button class="btn-icon edit" onclick="editSemester('${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}')" aria-label="Edit">${iconEdit}</button>
                      <button class="btn-icon" onclick="deleteSemester('${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}')" aria-label="Delete">${iconDelete}</button>
                    </div>
                  </div>
                  <div class="sem-body">
                    <div class="body-inner">
                    ${Object.keys(sectionData[branchName][year][sem]).map(subject => {
                      const link = sectionData[branchName][year][sem][subject] || '#';
                      const isDataUrl = typeof link === 'string' && link.startsWith('data:application/pdf');
                      const isPdf = isDataUrl || (typeof link === 'string' && (link.includes('.pdf') || link.includes('firebasestorage.googleapis.com') || link.toLowerCase().includes('alt=media')));
                      const hrefAttr = isDataUrl ? 'javascript:void(0)' : link;
                      const targetAttr = isDataUrl ? '_self' : '_blank';
                      return `
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                        <a class="subject" href="javascript:void(0)" onclick="handleAdminSubjectClick(event, '${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}', '${escapeStr(subject)}')" style="margin:0; flex:1;" title="Click to view securely">
                          ${subject}
                          ${isPdf ? '<span class="badge-pdf">PDF</span>' : '<span class="badge-drive">Link</span>'}
                        </a>
                        <button class="btn-icon edit" onclick="openEditSubjectModal('${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}', '${escapeStr(subject)}')" aria-label="Edit" title="Edit">${iconEdit}</button>
                        <button class="btn-icon" onclick="deleteSubject('${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}', '${escapeStr(subject)}')" aria-label="Delete" title="Delete">${iconDelete}</button>
                      </div>
                    `;
                    }).join('')}

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

                    </div>
                  </div>
                </div>
              `;
              }).join('')}
              <div class="admin-add-row">
                <input type="text" class="input" id="semInput-${safeId(`${branchName}-${year}`)}" placeholder="Enter semester (e.g. semester 3)">
                <button class="btn primary" onclick="addSemester('${escapeStr(branchName)}', '${escapeStr(year)}')">${iconAdd} Add Sem</button>
              </div>
              </div>
            </div>
          </div>
        `).join('')}
        <div class="admin-add-row">
          <input type="number" class="input" id="yearInput-${safeId(branchName)}" placeholder="Enter year (e.g. 2025)">
          <button class="btn primary" onclick="addYear('${escapeStr(branchName)}')">${iconAdd} Add Year</button>
        </div>
        </div>
      </div>
    `;
    container.appendChild(branchDiv);
  }

  // Row to add a new Branch
  const newBranchRow = document.createElement('div');
  newBranchRow.className = 'admin-add-row';
  newBranchRow.style.marginTop = '24px';
  newBranchRow.style.paddingTop = '16px';
  newBranchRow.innerHTML = `
    <input type="text" class="input" id="newBranchInput" placeholder="Add new Branch (e.g. CSE, ECE, ME, CE)">
    <button class="btn primary" onclick="addNewBranch()">${iconAdd} Add Branch</button>
  `;
  container.appendChild(newBranchRow);
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
  const body = parent.querySelector(':scope > .branch-body, :scope > .year-body, :scope > .sem-body');
  if (body) body.classList.toggle('active');
  el.classList.toggle('open');
}

// Handle file selection preview label
function handleFileSelect(uniqueId, fileInput) {
  const label = document.getElementById(`fileLabel-${uniqueId}`);
  if (!label) return;
  if (fileInput.files && fileInput.files[0]) {
    label.textContent = `PDF: ${fileInput.files[0].name}`;
    label.style.color = 'var(--primary)';
  } else {
    label.textContent = 'Or Upload PDF File';
    label.style.color = '';
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

  // 1. Direct PDF (Base64 data URL, direct .pdf URL, or Firebase Storage URL)
  const isDirectPdf = link.startsWith('data:application/pdf') || link.includes('.pdf') || link.includes('firebasestorage.googleapis.com');

  if (isDirectPdf && window.pdfjsLib) {
    if (navControls) navControls.style.display = 'flex';
    if (zoomControls) zoomControls.style.display = 'flex';

    try {
      let docInit = null;
      if (link.startsWith('data:application/pdf')) {
        const base64 = link.split(',')[1];
        const binaryStr = atob(base64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        docInit = { data: bytes };
      } else {
        docInit = { url: link };
      }

      currentPdfDoc = await pdfjsLib.getDocument(docInit).promise;
      totalPdfPages = currentPdfDoc.numPages;
      const totalEl = document.getElementById('pdfTotalPages');
      const curEl = document.getElementById('pdfCurrentPage');
      if (totalEl) totalEl.textContent = totalPdfPages;
      if (curEl) curEl.textContent = 1;

      if (spinner) spinner.style.display = 'none';
      if (canvasContainer) canvasContainer.style.display = 'flex';

      await renderAllPdfPages();
    } catch (err) {
      console.warn('PDF.js render failed, switching to in-website frame:', err);
      renderEmbeddedDriveOrWeb(link);
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

// Render all pages with crisp resolution and transparent shield overlay
async function renderAllPdfPages() {
  const container = document.getElementById('pdfCanvasContainer');
  if (!container || !currentPdfDoc) return;
  container.innerHTML = '';

  for (let pageNum = 1; pageNum <= currentPdfDoc.numPages; pageNum++) {
    const page = await currentPdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: currentPdfScale * 1.5 });

    const pageCard = document.createElement('div');
    pageCard.className = 'pdf-page-card';
    pageCard.id = `pdf-page-${pageNum}`;

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
    container.appendChild(pageCard);

    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
  }
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

// ADD SUBJECT with Link OR PDF Upload (Storage + Universal Fallback)
async function addSubjectWithMedia(branch, year, sem, uniqueId) {
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

  // If PDF file selected: Instant direct conversion (no hanging on storage bucket)
  if (file) {
    if (file.size > 8 * 1024 * 1024) {
      await showModal('PDF Size Limit', 'File size 8MB se badi hai. Kripya is file ko Google Drive me upload karein aur uska Link yahan paste karein.', false);
      return;
    }

    addBtn.disabled = true;
    addBtn.textContent = 'Saving PDF...';
    if (progressWrap) progressWrap.style.display = 'block';

    try {
      finalUrl = await fileToDataUrl(file, (pct) => {
        if (progressBar) progressBar.style.width = pct + '%';
      });
      if (progressBar) progressBar.style.width = '100%';
    } catch (readErr) {
      addBtn.disabled = false;
      addBtn.innerHTML = `${iconAdd} Add Subject`;
      if (progressWrap) progressWrap.style.display = 'none';
      await showModal('File Error', 'Failed to read PDF file: ' + readErr.message, false);
      return;
    }
  }

  // Save subject to data structure & sync to Realtime Database
  data[currentSection][branch][year][sem][subject] = finalUrl;
  await saveData();
  buildAdminSection();
}

// Modal Edit Subject State
let editSubjectState = null;

function openEditSubjectModal(branch, year, sem, subject) {
  editSubjectState = { branch, year, sem, oldSubject: subject };
  const currentLink = data[currentSection][branch][year][sem][subject] || '';

  const nameInput = document.getElementById('editSubjectName');
  const linkInput = document.getElementById('editSubjectLink');
  const fileInput = document.getElementById('editSubjectFile');
  const fileLabel = document.getElementById('editSubjectFileLabel');
  const progressWrap = document.getElementById('editUploadProgressWrap');
  const progressBar = document.getElementById('editUploadProgressBar');

  if (nameInput) nameInput.value = subject;
  if (linkInput) linkInput.value = currentLink.startsWith('data:application/pdf') ? '[Existing PDF File]' : currentLink;
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
    label.textContent = `PDF: ${fileInput.files[0].name}`;
    label.style.color = 'var(--primary)';
  } else {
    label.textContent = 'Choose PDF (Optional)';
    label.style.color = '';
  }
}

async function handleSubjectModalSave() {
  if (!editSubjectState) return;
  const { branch, year, sem, oldSubject } = editSubjectState;

  const nameInput = document.getElementById('editSubjectName');
  const linkInput = document.getElementById('editSubjectLink');
  const fileInput = document.getElementById('editSubjectFile');
  const saveBtn = document.getElementById('subjectModalSave');
  const progressWrap = document.getElementById('editUploadProgressWrap');
  const progressBar = document.getElementById('editUploadProgressBar');

  const newSubject = nameInput ? nameInput.value.trim() : '';
  let finalLink = linkInput ? linkInput.value.trim() : '';
  if (finalLink === '[Existing PDF File]') {
    finalLink = data[currentSection][branch][year][sem][oldSubject];
  }
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;

  if (!newSubject) {
    alert('Subject name cannot be empty.');
    return;
  }

  // Upload new PDF if provided
  if (file) {
    if (file.size > 8 * 1024 * 1024) {
      alert('File size 8MB se badi hai. Kripya Google Drive me upload karein aur link paste karein.');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving PDF...';
    if (progressWrap) progressWrap.style.display = 'block';

    try {
      finalLink = await fileToDataUrl(file, (pct) => {
        if (progressBar) progressBar.style.width = pct + '%';
      });
      if (progressBar) progressBar.style.width = '100%';
    } catch (readErr) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Changes';
      if (progressWrap) progressWrap.style.display = 'none';
      alert('Failed to read PDF file: ' + readErr.message);
      return;
    }
  }

  if (!finalLink) {
    alert('Please provide a Link or choose a PDF file.');
    return;
  }

  // Update object
  if (newSubject !== oldSubject) {
    delete data[currentSection][branch][year][sem][oldSubject];
  }
  data[currentSection][branch][year][sem][newSubject] = finalLink;

  saveBtn.disabled = false;
  saveBtn.textContent = 'Save Changes';
  closeSubjectModal();
  await saveData();
  buildAdminSection();
}

// Delete Subject
async function deleteSubject(branch, year, sem, subject) {
  const confirmed = await showModal('Delete Subject', `Are you sure you want to delete subject "${subject}"?`, false);
  if (confirmed) {
    delete data[currentSection][branch][year][sem][subject];
    await saveData();
    buildAdminSection();
  }
}

// Branch Management
async function addNewBranch() {
  const input = document.getElementById('newBranchInput');
  const branch = input ? input.value.trim().toUpperCase() : '';
  if (!branch) return;
  if (!data[currentSection]) data[currentSection] = {};
  if (data[currentSection][branch]) {
    await showModal('Error', `Branch "${branch}" already exists.`, false);
    return;
  }
  data[currentSection][branch] = {};
  if (input) input.value = '';
  await saveData();
  buildAdminSection();
}

async function deleteBranch(branch) {
  const confirmed = await showModal('Delete Branch', `Are you sure you want to delete branch "${branch}" and all its subjects?`, false);
  if (confirmed) {
    delete data[currentSection][branch];
    await saveData();
    buildAdminSection();
  }
}

// Year Management
async function addYear(branch) {
  const input = document.getElementById('yearInput-' + safeId(branch));
  const year = input ? input.value.trim() : '';
  if (year && !data[currentSection][branch][year]) {
    data[currentSection][branch][year] = {};
    input.value = '';
    await saveData();
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
    await saveData();
    buildAdminSection();
  }
}

async function deleteYear(branch, year) {
  const confirmed = await showModal('Delete Year', `Are you sure you want to delete year ${year}?`, false);
  if (confirmed) {
    delete data[currentSection][branch][year];
    await saveData();
    buildAdminSection();
  }
}

// Semester Management
async function addSemester(branch, year) {
  const input = document.getElementById('semInput-' + safeId(`${branch}-${year}`));
  const sem = input ? input.value.trim() : '';
  if (sem && !data[currentSection][branch][year][sem]) {
    data[currentSection][branch][year][sem] = {};
    input.value = '';
    await saveData();
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
    await saveData();
    buildAdminSection();
  }
}

async function deleteSemester(branch, year, sem) {
  const confirmed = await showModal('Delete Semester', `Are you sure you want to delete semester ${sem}?`, false);
  if (confirmed) {
    delete data[currentSection][branch][year][sem];
    await saveData();
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
