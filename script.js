// script.js



// Data structure
const defaultData = {
  jut: {
    CSE: {
      2024: {
        "semester 1": {
          "All subject": "https://drive.google.com/file/d/17pB8OX1IvU2j2o469omUiTVmhZ7eVEs8/view?usp=drivesdk",
          "Physics": "https://drive.google.com/file/d/17pB8OX1IvU2j2o469omUiTVmhZ7eVEs8/view?usp=drivesdk"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      },
      2023: {
        "semester 1": {
          "Mathematics": "https://drive.google.com/file/d/1Ao9gvwFXeB5fsp1huf-APdnQhAD5dytd/view?usp=drivesdk",
          "Physics": "https://drive.google.com/file/d/1Ao9gvwFXeB5fsp1huf-APdnQhAD5dytd/view?usp=drivesdk"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      },
      2022: {
        "semester 1": {
          "Mathematics": "https://drive.google.com/link1",
          "Physics": "https://drive.google.com/link2"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      },
      2021: {
        "semester 1": {
          "Mathematics": "https://drive.google.com/link1",
          "Physics": "https://drive.google.com/link2"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      }
    },
    ECE: {
      2024: {
        "semester 1": {
          "Mathematics": "https://drive.google.com/file/d/17pB8OX1IvU2j2o469omUiTVmhZ7eVEs8/view?usp=drivesdk",
          "Physics": "https://drive.google.com/file/d/17pB8OX1IvU2j2o469omUiTVmhZ7eVEs8/view?usp=drivesdk"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      },
      2023: {
        "semester 1": {
          "Mathematics": "https://drive.google.com/file/d/1Ao9gvwFXeB5fsp1huf-APdnQhAD5dytd/view?usp=drivesdk",
          "Physics": "https://drive.google.com/file/d/1Ao9gvwFXeB5fsp1huf-APdnQhAD5dytd/view?usp=drivesdk"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      }
    },
    EE: {
      2024: {
        "semester 1": {
          "Mathematics": "https://drive.google.com/file/d/17pB8OX1IvU2j2o469omUiTVmhZ7eVEs8/view?usp=drivesdk",
          "Physics": "https://drive.google.com/file/d/17pB8OX1IvU2j2o469omUiTVmhZ7eVEs8/view?usp=drivesdk"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      },
      2023: {
        "semester 1": {
          "Mathematics": "https://drive.google.com/file/d/1Ao9gvwFXeB5fsp1huf-APdnQhAD5dytd/view?usp=drivesdk",
          "Physics": "https://drive.google.com/file/d/1Ao9gvwFXeB5fsp1huf-APdnQhAD5dytd/view?usp=drivesdk"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      }
    },
    ME: {
      2024: {
        "semester 1": {
          "Mathematics": "https://drive.google.com/file/d/17pB8OX1IvU2j2o469omUiTVmhZ7eVEs8/view?usp=drivesdk",
          "Physics": "https://drive.google.com/file/d/17pB8OX1IvU2j2o469omUiTVmhZ7eVEs8/view?usp=drivesdk"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      },
      2023: {
        "semester 1": {
          "Mathematics": "https://drive.google.com/file/d/1Ao9gvwFXeB5fsp1huf-APdnQhAD5dytd/view?usp=drivesdk",
          "Physics": "https://drive.google.com/file/d/1Ao9gvwFXeB5fsp1huf-APdnQhAD5dytd/view?usp=drivesdk"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      }
    },
    Civil: {
      2024: {
        "semester 1": {
          "Mathematics": "https://drive.google.com/file/d/17pB8OX1IvU2j2o469omUiTVmhZ7eVEs8/view?usp=drivesdk",
          "Physics": "https://drive.google.com/file/d/17pB8OX1IvU2j2o469omUiTVmhZ7eVEs8/view?usp=drivesdk"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      },
      2023: {
        "semester 1": {
          "Mathematics": "https://drive.google.com/file/d/1Ao9gvwFXeB5fsp1huf-APdnQhAD5dytd/view?usp=drivesdk",
          "Physics": "https://drive.google.com/file/d/1Ao9gvwFXeB5fsp1huf-APdnQhAD5dytd/view?usp=drivesdk"
        },
        "semester 2": {
          "Programming": "https://drive.google.com/link3"
        }
      }
    }
  },
  chaibasa: {
    CSE: {
      2024: {
        "semester 1": {
          "Basic Electronics": "https://drive.google.com/file/d/1ALPsKqNAdbiPuGEgDzwWst-L_wCtzA97/view?usp=drivesdk"
        },
        "semester 2": {
          "Basic Electronics": "https://drive.google.com"
        }
      },
      2023: {
        "semester 1": {
          "Basic Electronics": "https://drive.google.com/file/d/1ALPsKqNAdbiPuGEgDzwWst-L_wCtzA97/view?usp=drivesdk"
        },
        "semester 2": {
          "Basic Electronics": "https://drive.google.com/file"
        }
      }
    },
    ECE: {
      2024: {
        "semester 1": {
          "Basic Electronics": "https://drive.google.com/file/d/1ALPsKqNAdbiPuGEgDzwWst-L_wCtzA97/view?usp=drivesdk"
        },
        "semester 2": {
          "Basic Electronics": "https://drive.google.com/file"
        }
      }
    },
    EE: {
      2024: {
        "semester 1": {
          "Basic Electronics": "https://drive.google.com/file/d/1ALPsKqNAdbiPuGEgDzwWst-L_wCtzA97/view?usp=drivesdk"
        },
        "semester 2": {
          "Basic Electronics": "https://drive.google.com/file"
        }
      }
    },
    ME: {
      2024: {
        "semester 1": {
          "Basic Electronics": "https://drive.google.com/file/d/1ALPsKqNAdbiPuGEgDzwWst-L_wCtzA97/view?usp=drivesdk"
        },
        "semester 2": {
          "Basic Electronics": "https://drive.google.com/file"
        }
      }
    },
    Civil: {
      2024: {
        "semester 1": {
          "Basic Electronics": "https://drive.google.com/file/d/1ALPsKqNAdbiPuGEgDzwWst-L_wCtzA97/view?usp=drivesdk"
        },
        "semester 2": {
          "Basic Electronics": "https://drive.google.com/file"
        }
      },
      2023: {
        "semester 1": {
          "Basic Electronics": "https://drive.google.com/file/d/1ALPsKqNAdbiPuGEgDzwWst-L_wCtzA97/view?usp=drivesdk"
        },
        "semester 2": {
          "coming soon": "https://drive.google.com/file"
        }
      }
    }
  }
};

let data = null;

// Theme helpers: persist user's theme preference and apply on load
function applyTheme(theme){
  if(theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
}

function toggleTheme(enabled){
  const theme = enabled ? 'dark' : 'light';
  applyTheme(theme);
  try { localStorage.setItem('pyqTheme', theme); } catch (e) {}
  const lbl = document.querySelector('.theme-toggle .label');
  if (lbl) lbl.textContent = enabled ? 'Dark mode: On' : 'Dark mode: Off';
}

function applyThemeOnLoad(){
  try{
    let theme = localStorage.getItem('pyqTheme');
    if(!theme){
      // respect system preference when no explicit choice
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    applyTheme(theme);
    const cb = document.getElementById('themeToggle');
    if(cb) cb.checked = (theme === 'dark');
    const lbl = document.querySelector('.theme-toggle .label');
    if (lbl) lbl.textContent = (theme === 'dark') ? 'Dark mode: On' : 'Dark mode: Off';
  }catch(e){console.error(e)}
}


function initData() {
  return new Promise((resolve) => {
    // Fetch the project JSON with a cache-busting query param so the browser
    // doesn't serve a stale cached copy. If fetch fails, fall back to
    // localStorage (previous admin edits) or the empty default.
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
        try { data = JSON.parse(stored); } catch (e) { data = defaultData; }
      } else {
        data = defaultData;
      }
    }).finally(() => resolve());
  });
}

// Function to render all sections
function renderAllSections() {
  if (data && data.jut) buildSection('jutBranches', data.jut);
  if (data && data.chaibasa) buildSection('chaiBranches', data.chaibasa);
  buildNotesSection('notesBranches', (data && data.notes) ? data.notes : {});
}

// Smooth scroll to Notes section from menu drawer
function scrollToNotes() {
  const el = document.getElementById('notes-panel');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Function to attach Realtime Database listener for live updates
function setupRealtimeListener() {
  if (window.firebase && firebase.database) {
    try {
      const dbRef = firebase.database().ref('pyqData');
      dbRef.on('value', (snapshot) => {
        const val = snapshot.val();
        if (val && typeof val === 'object' && Object.keys(val).length > 0) {
          data = val;
          try { localStorage.setItem('pyqData', JSON.stringify(data)); } catch (e) {}
          renderAllSections();
        }
      }, (err) => {
        console.warn('Realtime Database notice (read):', err);
      });
    } catch (e) {
      console.warn('Realtime DB init error:', e);
    }
  }
}

// Force reload latest JSON and rebuild the UI
function refreshData() {
  try { localStorage.removeItem('pyqData'); } catch (e) {}
  initData().then(() => {
    renderAllSections();
  });
}

// Function to save data
function saveData() {
  localStorage.setItem('pyqData', JSON.stringify(data));
}

// Function to escape strings for attributes
function escapeStr(str) {
  return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ============================================
// Secure In-Website PDF Viewer & Protection
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

// Open In-Website Viewer for any subject (PDF or Google Drive)
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

        // Step A: Instantly load first 4 preview pages if available (< 0.5 sec)
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

        // Step B: Download full chunks in parallel in the background
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

      // Render pages (if preview already shown for 1..4, keep them visible and render 5..N immediately)
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

// Embed Drive / Web link inside the in-website modal
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
  // Convert Google Drive view link to embedded preview
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

  // Render first 4 pages immediately (or upgrade preview pages in background)
  const initialCount = existingPreviewCount > 0 ? existingPreviewCount : Math.min(4, total);
  if (existingPreviewCount === 0) {
    for (let i = 1; i <= initialCount; i++) {
      if (sessionId !== pdfRenderSession) return;
      await renderSinglePdfPage(currentPdfDoc, i, cards[i - 1], sessionId);
    }
  }

  // Load remaining pages progressively in the background without blocking UI
  (async function loadRest() {
    const startIdx = existingPreviewCount > 0 ? existingPreviewCount + 1 : initialCount + 1;
    for (let i = startIdx; i <= total; i++) {
      if (sessionId !== pdfRenderSession) return;
      await renderSinglePdfPage(currentPdfDoc, i, cards[i - 1], sessionId);
      await new Promise(r => setTimeout(r, 15));
    }
    // Upgrade preview images 1..existingPreviewCount to crisp PDF.js canvases silently
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

// Function to handle clicking a subject (always opens inside in-website viewer)
function handleSubjectClick(event, branch, year, sem, subject) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  let link = '#';
  if (data && data.jut && data.jut[branch] && data.jut[branch][year] && data.jut[branch][year][sem] && data.jut[branch][year][sem][subject]) {
    link = data.jut[branch][year][sem][subject];
  } else if (data && data.chaibasa && data.chaibasa[branch] && data.chaibasa[branch][year] && data.chaibasa[branch][year][sem] && data.chaibasa[branch][year][sem][subject]) {
    link = data.chaibasa[branch][year][sem][subject];
  }

  if (!link || link === '#') return;

  // Open inside the in-website Secure Viewer!
  openPdfViewer(subject, link);
}

// Handle clicking a Note item (opens inside in-website Secure Viewer)
function handleNoteClick(event, branch, sem, subject) {
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

// Format PDF size for display next to uploaded PDFs
function formatPdfSize(bytes) {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function getPdfSizeText(link) {
  if (typeof link !== 'string') return '';
  if (link.startsWith('data:application/pdf')) {
    const base64Part = link.split(',')[1] || '';
    const bytes = Math.round((base64Part.length * 3) / 4);
    return formatPdfSize(bytes);
  }
  if (link.startsWith('rtdb-pdf://')) {
    const match = link.match(/[?&]size=(\d+)/);
    if (match && match[1]) {
      return formatPdfSize(parseInt(match[1], 10));
    }
  }
  return '';
}

// Handle clicking a Note Module inside a Subject Folder
function handleNoteModuleClick(event, branch, sem, subject, modName) {
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

// Build Notes section: Branch -> Semester -> Subject (Modules Folder or Single PDF/Link)
function buildNotesSection(containerId, notesSection) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const branchKeys = notesSection ? Object.keys(notesSection) : [];
  if (branchKeys.length === 0) {
    container.innerHTML = '<p class="muted" style="text-align:center; padding: 20px 0;">Notes will be uploaded soon by Admin.</p>';
    return;
  }

  for (const branchName of branchKeys) {
    const branchObj = notesSection[branchName] || {};
    const semKeys = Object.keys(branchObj);
    const branchDiv = document.createElement('div');
    branchDiv.className = 'branch';
    branchDiv.setAttribute('data-name', branchName);
    branchDiv.innerHTML = `
      <div class="branch-head" onclick="toggleNode(this)">
        <span class="toggler"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
        ${branchName}
      </div>
      <div class="branch-body">
        <div class="body-inner">
        ${semKeys.length === 0 ? '<p class="muted" style="font-size:13px; padding:6px 0;">No semesters added yet.</p>' : sortSemesters(semKeys).map(sem => {
          const subjectsObj = branchObj[sem] || {};
          const subjectKeys = Object.keys(subjectsObj);
          return `
            <div class="semester" data-name="${sem}">
              <div class="sem-head" onclick="toggleNode(this)">
                <span class="toggler"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
                ${sem}
              </div>
              <div class="sem-body">
                <div class="body-inner">
                ${subjectKeys.length === 0 ? '<p class="muted" style="font-size:13px; padding:4px 0;">No notes added yet.</p>' : subjectKeys.map(subject => {
                  const entry = subjectsObj[subject];
                  if (entry && typeof entry === 'object') {
                    const modKeys = sortSemesters(Object.keys(entry));
                    return `
                      <div class="subject-folder" data-name="${subject}">
                        <div class="subject-folder-head" onclick="toggleNode(this)">
                          <span class="toggler"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
                          <span>📁 ${subject}</span>
                          <span class="module-count-badge">${modKeys.length} Module${modKeys.length === 1 ? '' : 's'}</span>
                        </div>
                        <div class="subject-folder-body">
                          <div class="body-inner">
                          ${modKeys.length === 0 ? '<p class="muted" style="font-size:12px; padding:4px 0;">Modules coming soon.</p>' : modKeys.map(modName => {
                            const modLink = entry[modName] || '#';
                            const isDataUrl = typeof modLink === 'string' && (modLink.startsWith('data:application/pdf') || modLink.startsWith('rtdb-pdf://'));
                            const isPdf = isDataUrl || (typeof modLink === 'string' && (modLink.includes('.pdf') || modLink.includes('firebasestorage.googleapis.com') || modLink.toLowerCase().includes('alt=media')));
                            const sizeText = isPdf ? getPdfSizeText(modLink) : '';
                            return `
                              <a class="subject" href="javascript:void(0)" data-name="${modName}" onclick="handleNoteModuleClick(event, '${escapeStr(branchName)}', '${escapeStr(sem)}', '${escapeStr(subject)}', '${escapeStr(modName)}')">
                                ${modName}
                                ${isPdf ? `<span class="badge-pdf">PDF</span>${sizeText ? `<span class="badge-size">${sizeText}</span>` : ''}` : '<span class="badge-drive">Link</span>'}
                              </a>
                            `;
                          }).join('')}
                          </div>
                        </div>
                      </div>
                    `;
                  }
                  const link = entry || '#';
                  const isDataUrl = typeof link === 'string' && (link.startsWith('data:application/pdf') || link.startsWith('rtdb-pdf://'));
                  const isPdf = isDataUrl || (typeof link === 'string' && (link.includes('.pdf') || link.includes('firebasestorage.googleapis.com') || link.toLowerCase().includes('alt=media')));
                  const sizeText = isPdf ? getPdfSizeText(link) : '';
                  return `
                    <a class="subject" href="javascript:void(0)" data-name="${subject}" onclick="handleNoteClick(event, '${escapeStr(branchName)}', '${escapeStr(sem)}', '${escapeStr(subject)}')">
                      ${subject}
                      ${isPdf ? `<span class="badge-pdf">PDF</span>${sizeText ? `<span class="badge-size">${sizeText}</span>` : ''}` : '<span class="badge-drive">Link</span>'}
                    </a>
                  `;
                }).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
        </div>
      </div>
    `;
    container.appendChild(branchDiv);
  }
}

// Function to build HTML for a section
function buildSection(containerId, section) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  for (const branchName in section) {
    const branchDiv = document.createElement('div');
    branchDiv.className = 'branch';
    branchDiv.setAttribute('data-name', branchName);
    branchDiv.innerHTML = `
      <div class="branch-head" onclick="toggleNode(this)">
        <span class="toggler"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
        ${branchName}
      </div>
      <div class="branch-body">
        <div class="body-inner">
        ${Object.keys(section[branchName]).sort((a,b)=>b-a).map(year => `
          <div class="year" data-name="${year}">
            <div class="year-head" onclick="toggleNode(this)">
              <span class="toggler"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
              ${year}
            </div>
            <div class="year-body">
              <div class="body-inner">
              ${sortSemesters(Object.keys(section[branchName][year])).map(sem => `
                <div class="semester" data-name="${sem}">
                  <div class="sem-head" onclick="toggleNode(this)">
                    <span class="toggler"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
                    ${sem}
                  </div>
                  <div class="sem-body">
                    <div class="body-inner">
                    ${Object.keys(section[branchName][year][sem]).map(subject => {
                      const link = section[branchName][year][sem][subject] || '#';
                      const isDataUrl = typeof link === 'string' && (link.startsWith('data:application/pdf') || link.startsWith('rtdb-pdf://'));
                      const isPdf = isDataUrl || (typeof link === 'string' && (link.includes('.pdf') || link.includes('firebasestorage.googleapis.com') || link.toLowerCase().includes('alt=media')));
                      const sizeText = isPdf ? getPdfSizeText(link) : '';
                      return `
                        <a class="subject" href="javascript:void(0)" data-name="${subject}" onclick="handleSubjectClick(event, '${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}', '${escapeStr(subject)}')">
                          ${subject}
                          ${isPdf ? `<span class="badge-pdf">PDF</span>${sizeText ? `<span class="badge-size">${sizeText}</span>` : ''}` : '<span class="badge-drive">Link</span>'}
                        </a>
                      `;
                    }).join('')}
                    </div>
                  </div>
                </div>
              `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
        </div>
      </div>
    `;
    container.appendChild(branchDiv);
  }
}

// Toggle display for branch/year/semester nodes
function toggleNode(el){
  // el is the clicked head element (branch-head, year-head, sem-head, subject-folder-head)
  const parent = el.parentElement;
  // find the immediate body (branch-body, year-body, sem-body, subject-folder-body)
  const body = parent.querySelector(':scope > .branch-body, :scope > .year-body, :scope > .sem-body, :scope > .subject-folder-body');
  if(body) body.classList.toggle('active');
  el.classList.toggle('open');
  // prevent event bubbling if used as onclick on nested elements
  if(window.event) window.event.stopPropagation();
}



// initialize
document.addEventListener('DOMContentLoaded', function(){
  applyThemeOnLoad();

  // Attach Anti-Download & Security Protection Event Listeners
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

  initData().then(() => {
    renderAllSections();
  }).finally(() => {
    setupRealtimeListener();
    if (typeof initFCM === 'function') initFCM();
    // trigger header social icons drop-in animation once on page load
    try{
      setTimeout(() => {
        const socials = document.querySelector('.site-header .socials');
        if(socials) socials.classList.add('animate');
      }, 180);
    }catch(e){console.warn(e)}
  });
});

// Toggle header menu on small screens
function toggleHeaderMenu(){
  const header = document.querySelector('.site-header');
  const btn = document.querySelector('.menu-btn');
  if(!header) return;
  const opened = header.classList.toggle('menu-open');
  if(btn) btn.setAttribute('aria-expanded', opened ? 'true' : 'false');
}

// Close mobile menu when resizing to large screens
window.addEventListener('resize', function(){
  const header = document.querySelector('.site-header');
  if(header && window.innerWidth > 600 && header.classList.contains('menu-open')){
    header.classList.remove('menu-open');
    const btn = document.querySelector('.menu-btn');
    if(btn) btn.setAttribute('aria-expanded', 'false');
  }
});

// Drawer (right-side) functions
function openDrawer(){
  const drawer = document.getElementById('sideDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const btn = document.querySelector('.menu-btn');
  if(drawer) drawer.classList.add('open');
  if(overlay) overlay.classList.add('show');
  if(btn) btn.setAttribute('aria-expanded','true');
  if(drawer) drawer.setAttribute('aria-hidden','false');
  if(overlay) overlay.setAttribute('aria-hidden','false');
}

function closeDrawer(){
  const drawer = document.getElementById('sideDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const btn = document.querySelector('.menu-btn');
  if(drawer) drawer.classList.remove('open');
  if(overlay) overlay.classList.remove('show');
  if(btn) btn.setAttribute('aria-expanded','false');
  if(drawer) drawer.setAttribute('aria-hidden','true');
  if(overlay) overlay.setAttribute('aria-hidden','true');
}

function toggleDrawer(){
  const drawer = document.getElementById('sideDrawer');
  if(!drawer) return;
  if(drawer.classList.contains('open')) closeDrawer(); else openDrawer();
}

// Close drawer with Escape key
window.addEventListener('keydown', function(e){
  if(e.key === 'Escape') closeDrawer();
});

// ----------------------
// Firebase Cloud Messaging setup (web)
// NOTE: Browsers require user permission for notifications. It is not possible
// to receive push notifications when the user has not granted permission.
// Replace placeholders (Firebase config in index.html and VAPID key) with your values.
// ----------------------
function initFCM(){
  if (!('serviceWorker' in navigator) || !('Notification' in window) || !window.firebase) return;
  navigator.serviceWorker.register('firebase-messaging-sw.js')
    .then(reg => {
      console.log('SW registered for FCM:', reg);
      try {
        const messaging = firebase.messaging();
        // If permission already granted, attempt to get token; otherwise request it.
        if (Notification.permission === 'granted') {
          getFCMToken(messaging);
        } else {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') getFCMToken(messaging);
            else console.warn('Notification permission was not granted');
          });
        }

        // Handle messages when page is in foreground
        messaging.onMessage(payload => {
          console.log('FCM foreground message:', payload);
          const title = payload.notification?.title || 'Notification';
          const options = { body: payload.notification?.body, icon: payload.notification?.icon };
          // show notification via service worker registration for consistent UX
          navigator.serviceWorker.getRegistration().then(swReg => { if (swReg) swReg.showNotification(title, options); });
        });
      } catch(e){ console.error('FCM init error', e); }
    }).catch(err => console.error('Service Worker registration failed:', err));
}

function getFCMToken(messaging){
  // Replace with VAPID key from Firebase console -> Cloud Messaging -> Web Push certificates
  const vapidKey = 'BOi88OGzqk9sbxLIfSrtCp47TLs7umMsRlYWGvWo6w3BvmebQsbvBwYkmDWblV9yxhd25q5AdZ9q2OoXgGrgzYY';
  messaging.getToken({ vapidKey }).then((currentToken) => {
    if (currentToken) {
      console.log('FCM registration token:', currentToken);
      // TODO: send this token to your server or admin panel so you can target this client
    } else {
      console.warn('No registration token available. Request permission to generate one.');
    }
  }).catch((err) => {
    console.error('An error occurred while retrieving token.', err);
  });
}
