// admin.js

const PASSWORD = 'admin123';

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

let data = defaultData;

const stored = localStorage.getItem('pyqData');

if (stored) {
  const parsed = JSON.parse(stored);
  data = deepMerge(defaultData, parsed);
}

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

function checkPassword() {
  // support being called from form submit or button click
  if (window.event && window.event.preventDefault) window.event.preventDefault();
  const pwdEl = document.getElementById('password');
  const pwd = pwdEl ? pwdEl.value : '';
  if (pwd === PASSWORD) {
    document.getElementById('password-section').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    // clear password input for safety
    if (pwdEl) pwdEl.value = '';
  } else {
    // show inline helper rather than alert
    const help = document.getElementById('login-help');
    if (help) {
      help.textContent = 'Wrong password. Try again.';
      help.style.color = 'crimson';
    } else {
      alert('Wrong password');
    }
  }
}

function loadSection() {
  currentSection = document.getElementById('section-select').value;
  buildAdminSection();
}

function buildAdminSection() {
  const container = document.getElementById('section-content');
  container.innerHTML = '';
  const sectionData = data[currentSection];
  for (const branchName in sectionData) {
    const branchDiv = document.createElement('div');
    branchDiv.className = 'branch';
    branchDiv.innerHTML = `
      <div class="branch-head">
        <span class="toggler" onclick="toggleNode(this)">${branchName}</span>
      </div>
      <div class="branch-body">
        ${Object.keys(sectionData[branchName]).sort((a,b)=>b-a).map(year => `
          <div class="year">
            <div class="year-head">
              <span class="toggler" onclick="toggleNode(this)">${year}</span>
              <button onclick="editYear('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}')">Edit</button>
              <button onclick="deleteYear('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}')">Delete</button>
            </div>
            <div class="year-body">
              ${Object.keys(sectionData[branchName][year]).map(sem => `
                <div class="semester">
                  <div class="sem-head">
                    <span class="toggler" onclick="toggleNode(this)">${sem}</span>
                    <button onclick="editSemester('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}', '${sem.replace(/'/g, "\\'")}')">Edit</button>
                    <button onclick="deleteSemester('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}', '${sem.replace(/'/g, "\\'")}')">Delete</button>
                  </div>
                  <div class="sem-body">
                    ${Object.keys(sectionData[branchName][year][sem]).map(subject => `
                      <div>
                        <a class="subject" href="${sectionData[branchName][year][sem][subject]}" target="_blank">${subject}</a>
                        <button onclick="editSubject('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}', '${sem.replace(/'/g, "\\'")}', '${subject.replace(/'/g, "\\'")}')">Edit</button>
                        <button onclick="deleteSubject('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}', '${sem.replace(/'/g, "\\'")}', '${subject.replace(/'/g, "\\'")}')">Delete</button>
                      </div>
                    `).join('')}
                  </div>
                  <input type="text" id="subjectInput-${branchName.replace(/'/g, '')}-${year.replace(/'/g, '')}-${sem.replace(/'/g, '')}" placeholder="Subject"> <input type="text" id="linkInput-${branchName.replace(/'/g, '')}-${year.replace(/'/g, '')}-${sem.replace(/'/g, '')}" placeholder="Link"> <button onclick="addSubject('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}', '${sem.replace(/'/g, "\\'")}')">Add Subject</button>
                </div>
              `).join('')}
            </div>
            <input type="text" id="semInput-${branchName.replace(/'/g, '')}-${year.replace(/'/g, '')}" placeholder="Enter semester"> <button onclick="addSemester('${branchName.replace(/'/g, "\\'")}', '${year.replace(/'/g, "\\'")}')">Add Semester</button>
          </div>
        `).join('')}
      </div>
      <input type="text" id="yearInput-${branchName.replace(/'/g, '')}" placeholder="Enter year"> <button onclick="addYear('${branchName.replace(/'/g, "\\'")}')">Add Year</button>
    `;
    container.appendChild(branchDiv);
  }
}

function toggleNode(el) {
  const head = el.parentElement; // .branch-head / .year-head / .sem-head
  const parent = head.parentElement; // .branch / .year / .semester
  const body = parent.querySelector(':scope > .branch-body, :scope > .year-body, :scope > .sem-body');
  if (body) {
    const opened = body.classList.toggle('active');
    head.classList.toggle('open', opened);
  }
}

function addYear(branch) {
  const input = document.getElementById('yearInput-' + branch.replace(/'/g, ''));
  const year = input.value.trim();
  if (year && !data[currentSection][branch][year]) {
    data[currentSection][branch][year] = {};
    input.value = '';
    saveData();
    buildAdminSection();
  } else if (year) {
    alert('Year already exists');
  }
}

function editYear(branch, oldYear) {
  const newYear = prompt('Enter new year:', oldYear);
  if (newYear && newYear !== oldYear) {
    data[currentSection][branch][newYear] = data[currentSection][branch][oldYear];
    delete data[currentSection][branch][oldYear];
    saveData();
    buildAdminSection();
  }
}

function deleteYear(branch, year) {
  if (confirm(`Delete year ${year}?`)) {
    delete data[currentSection][branch][year];
    saveData();
    buildAdminSection();
  }
}

function addSemester(branch, year) {
  const input = document.getElementById('semInput-' + branch.replace(/'/g, '') + '-' + year.replace(/'/g, ''));
  const sem = input.value.trim();
  if (sem && !data[currentSection][branch][year][sem]) {
    data[currentSection][branch][year][sem] = {};
    input.value = '';
    saveData();
    buildAdminSection();
  } else if (sem) {
    alert('Semester already exists');
  }
}

function editSemester(branch, year, oldSem) {
  const newSem = prompt('Enter new semester:', oldSem);
  if (newSem && newSem !== oldSem) {
    data[currentSection][branch][year][newSem] = data[currentSection][branch][year][oldSem];
    delete data[currentSection][branch][year][oldSem];
    saveData();
    buildAdminSection();
  }
}

function deleteSemester(branch, year, sem) {
  if (confirm(`Delete semester ${sem}?`)) {
    delete data[currentSection][branch][year][sem];
    saveData();
    buildAdminSection();
  }
}

function addSubject(branch, year, sem) {
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
    alert('Subject already exists or invalid input');
  }
}

function editSubject(branch, year, sem, oldSubject) {
  const newSubject = prompt('Enter new subject name:', oldSubject);
  const link = prompt('Enter new link:', data[currentSection][branch][year][sem][oldSubject]);
  if (newSubject && link) {
    delete data[currentSection][branch][year][sem][oldSubject];
    data[currentSection][branch][year][sem][newSubject] = link;
    saveData();
    buildAdminSection();
  }
}

function deleteSubject(branch, year, sem, subject) {
  if (confirm(`Delete subject ${subject}?`)) {
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

// Import JSON file from the file input. If 'Merge' is checked, merge into existing data,
// otherwise replace the whole dataset.
function importData() {
  const fileInput = document.getElementById('importFile');
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert('Choose a JSON file first');
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      const merge = document.getElementById('mergeImport') && document.getElementById('mergeImport').checked;
      if (merge) {
        // merge parsed into current data (parsed overrides existing keys)
        data = deepMerge(data, parsed);
      } else {
        // replace entire dataset
        data = parsed;
      }
      saveData();
      buildAdminSection();
      alert('Import successful');
      // clear file input
      fileInput.value = '';
    } catch (err) {
      console.error('Failed to import JSON', err);
      alert('Invalid JSON file');
    }
  };
  reader.onerror = function() {
    alert('Failed to read file');
  };
  reader.readAsText(file);
}

// Save data to localStorage (used by admin functions)
function saveData() {
  try {
    localStorage.setItem('pyqData', JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data to localStorage', e);
    alert('Failed to save data. Check browser storage settings.');
  }
}