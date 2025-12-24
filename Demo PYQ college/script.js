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
          "Basic Electronics": "https://drive.google.com/file"
        }
      }
    }
  }
};

let data = null;

function initData() {
  return new Promise((resolve) => {
    const stored = localStorage.getItem('pyqData');
    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch (e) {
        data = defaultData;
      }
      resolve();
      return;
    }

    // Attempt to fetch a bundled JSON file (pyq-data.json) if present
    fetch('pyq-data.json').then(r => {
      if (!r.ok) throw new Error('no-file');
      return r.json();
    }).then(json => {
      data = json;
      try { localStorage.setItem('pyqData', JSON.stringify(data)); } catch (e) {}
    }).catch(() => {
      data = defaultData;
    }).finally(() => resolve());
  });
}

// Function to save data
function saveData() {
  localStorage.setItem('pyqData', JSON.stringify(data));
}

// Function to build HTML for a section
function buildSection(containerId, section) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (const branchName in section) {
    const branchDiv = document.createElement('div');
    branchDiv.className = 'branch';
    branchDiv.setAttribute('data-name', branchName);
    branchDiv.innerHTML = `
      <div class="branch-head" onclick="toggleNode(this)">${branchName}</div>
      <div class="branch-body">
        ${Object.keys(section[branchName]).sort((a,b)=>b-a).map(year => `
          <div class="year" data-name="${year}">
            <div class="year-head" onclick="toggleNode(this)">${year}</div>
            <div class="year-body">
              ${Object.keys(section[branchName][year]).map(sem => `
                <div class="semester" data-name="${sem}">
                  <div class="sem-head" onclick="toggleNode(this)">${sem}</div>
                  <div class="sem-body">
                    ${Object.keys(section[branchName][year][sem]).map(subject => `
                      <a class="subject" href="${section[branchName][year][sem][subject]}" target="_blank" data-name="${subject}">${subject}</a>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
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
  // prevent event bubbling if used as onclick on nested elements
  if(window.event) window.event.stopPropagation();
}

// Simple search for each side
function setupSearch(inputId, containerId){
  const input = document.getElementById(inputId);
  const container = document.getElementById(containerId);

  input.addEventListener('input', function(){
    const q = this.value.trim().toLowerCase();
    // if query empty -> show all semesters/subjects
    const semesters = container.querySelectorAll('.semester');
    if(!q){
      semesters.forEach(sem => {
        const semBody = sem.querySelector(':scope > .sem-body');
        if(semBody) semBody.classList.remove('active');
        // ensure branch/year bodies are collapsed too
        const yearBody = sem.closest('.year')?.querySelector(':scope > .year-body');
        if(yearBody) yearBody.classList.remove('active');
        const branchBody = sem.closest('.branch')?.querySelector(':scope > .branch-body');
        if(branchBody) branchBody.classList.remove('active');
        // show all subject links
        const subjects = sem.querySelectorAll('.subject');
        subjects.forEach(s => s.style.display = '');
      });
      return;
    }

    // Search by semester name only
    semesters.forEach(sem => {
      const semName = (sem.dataset && sem.dataset.name ? sem.dataset.name : (sem.querySelector('.sem-head')?.textContent || '')).toLowerCase();
      const match = semName.includes(q);
      const semBody = sem.querySelector(':scope > .sem-body');
      if(semBody) semBody.classList.toggle('active', match);
      // show/hide subjects based on match
      const subjects = sem.querySelectorAll('.subject');
      subjects.forEach(s => s.style.display = match ? '' : 'none');
      // update year and branch containers visibility based on contained semesters
      const year = sem.closest('.year');
      if(year){
        const anySemVisible = Array.from(year.querySelectorAll('.sem-body')).some(b => b.classList.contains('active'));
        const yearBody = year.querySelector(':scope > .year-body');
        if(yearBody) yearBody.classList.toggle('active', anySemVisible);
      }
      const branch = sem.closest('.branch');
      if(branch){
        const anyYearVisible = Array.from(branch.querySelectorAll('.year-body')).some(b => b.classList.contains('active'));
        const branchBody = branch.querySelector(':scope > .branch-body');
        if(branchBody) branchBody.classList.toggle('active', anyYearVisible);
      }
    });
  });
}

// initialize
document.addEventListener('DOMContentLoaded', function(){
  initData().then(() => {
    buildSection('jutBranches', data.jut);
    buildSection('chaiBranches', data.chaibasa);
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