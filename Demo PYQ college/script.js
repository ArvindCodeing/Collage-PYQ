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

      // Render all pages in high-resolution canvas with shield overlays
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
              ${Object.keys(section[branchName][year]).map(sem => `
                <div class="semester" data-name="${sem}">
                  <div class="sem-head" onclick="toggleNode(this)">
                    <span class="toggler"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
                    ${sem}
                  </div>
                  <div class="sem-body">
                    <div class="body-inner">
                    ${Object.keys(section[branchName][year][sem]).map(subject => {
                      const link = section[branchName][year][sem][subject] || '#';
                      const isDataUrl = typeof link === 'string' && link.startsWith('data:application/pdf');
                      const isPdf = isDataUrl || (typeof link === 'string' && (link.includes('.pdf') || link.includes('firebasestorage.googleapis.com') || link.toLowerCase().includes('alt=media')));
                      return `
                        <a class="subject" href="javascript:void(0)" data-name="${subject}" onclick="handleSubjectClick(event, '${escapeStr(branchName)}', '${escapeStr(year)}', '${escapeStr(sem)}', '${escapeStr(subject)}')">
                          ${subject}
                          ${isPdf ? '<span class="badge-pdf">PDF</span>' : '<span class="badge-drive">Link</span>'}
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
  // el is the clicked head element (branch-head, year-head, sem-head)
  const parent = el.parentElement;
  // find the immediate body (branch-body, year-body, sem-body)
  const body = parent.querySelector(':scope > .branch-body, :scope > .year-body, :scope > .sem-body');
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
