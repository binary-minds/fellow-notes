/**
 * FELLOW NOTES 2.0 - Core Application Logic
 * Themes, Interactive Search, Student Tools Suite, Modals & Toast Engine
 * Dynamic multi-device responsive support
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initLiveSearch();
  initFilterChips();
  initModals();
  initToast();
  initKeyboardShortcuts();
  initToolTabs();
  
  if (document.getElementById('sgpa-calculator-form')) {
    initSGPACalculator();
  }
  if (document.getElementById('attendance-calculator-form')) {
    initAttendanceCalculator();
  }
  if (document.getElementById('pomodoro-timer-app')) {
    initPomodoroTimer();
  }
  if (document.getElementById('join-binary-minds-form') || document.getElementById('join-binary-minds-form-inline')) {
    initJoinForm();
  }
});

/* ==========================================================================
   THEME TOGGLING (DARK / LIGHT)
   ========================================================================== */

function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('fn_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const activeTheme = storedTheme || (systemPrefersDark ? 'dark' : 'dark');
  applyTheme(activeTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('fn_theme', theme);

  const themeIcons = document.querySelectorAll('.theme-icon');
  themeIcons.forEach(icon => {
    if (theme === 'dark') {
      icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    } else {
      icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    }
  });
}

/* ==========================================================================
   MOBILE MENU DRAWER (TOUCH-FRIENDLY & AUTO CLOSE)
   ========================================================================== */

function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  function toggleMenu(open) {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', shouldOpen);
    toggleBtn.setAttribute('aria-expanded', shouldOpen);
    if (shouldOpen) {
      toggleBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    } else {
      toggleBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   LIVE SEARCH & SUBJECT HIGHLIGHTING
   ========================================================================== */

function initLiveSearch() {
  const searchInput = document.getElementById('global-search-input');
  if (!searchInput) return;

  const semGroups = document.querySelectorAll('.sem-section-group');
  const subjectCards = document.querySelectorAll('.subject-card');
  const semCards = document.querySelectorAll('.sem-card');
  const noResultsMsg = document.getElementById('no-search-results');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    let matchesCount = 0;

    // Handle specific subject cards & semester groups
    if (semGroups.length > 0 && subjectCards.length > 0) {
      if (!query) {
        semGroups.forEach(group => group.style.display = '');
        subjectCards.forEach(card => {
          card.style.display = '';
          card.classList.remove('highlight');
        });
        if (noResultsMsg) noResultsMsg.style.display = 'none';
        return;
      }

      semGroups.forEach(group => {
        const groupTitle = group.querySelector('.sem-heading-box')?.textContent.toLowerCase() || '';
        const groupCards = group.querySelectorAll('.subject-card');
        let groupHasMatch = false;

        groupCards.forEach(card => {
          const cardTitle = card.querySelector('.subject-card-title')?.textContent.toLowerCase() || '';
          const cardDesc = card.querySelector('.subject-card-desc')?.textContent.toLowerCase() || '';
          const cardBadge = card.querySelector('.subject-tag-badge')?.textContent.toLowerCase() || '';

          if (cardTitle.includes(query) || cardDesc.includes(query) || cardBadge.includes(query) || groupTitle.includes(query)) {
            card.style.display = '';
            card.classList.add('highlight');
            groupHasMatch = true;
            matchesCount++;
          } else {
            card.style.display = 'none';
            card.classList.remove('highlight');
          }
        });

        if (groupHasMatch) {
          group.style.display = '';
        } else {
          group.style.display = 'none';
        }
      });

      if (noResultsMsg) {
        noResultsMsg.style.display = (matchesCount === 0 && query !== '') ? 'block' : 'none';
      }
      return;
    }

    // Fallback for legacy .sem-card (e.g. pyq.html)
    semCards.forEach(card => {
      const title = card.querySelector('.sem-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.sem-desc')?.textContent.toLowerCase() || '';
      const subjects = Array.from(card.querySelectorAll('.subject-pill'));
      let cardHasMatch = false;

      if (!query) {
        card.style.display = '';
        subjects.forEach(pill => pill.classList.remove('highlight'));
        return;
      }

      if (title.includes(query) || desc.includes(query)) {
        cardHasMatch = true;
      }

      subjects.forEach(pill => {
        const text = pill.textContent.toLowerCase();
        if (text.includes(query)) {
          cardHasMatch = true;
          pill.classList.add('highlight');
        } else {
          pill.classList.remove('highlight');
        }
      });

      if (cardHasMatch) {
        card.style.display = '';
        matchesCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = (matchesCount === 0 && query !== '') ? 'block' : 'none';
    }
  });
}

/* ==========================================================================
   FILTER CHIPS (YEARS & SEMESTERS)
   ========================================================================== */

function initFilterChips() {
  const filterChips = document.querySelectorAll('.filter-chip');
  const semGroups = document.querySelectorAll('.sem-section-group');
  const semCards = document.querySelectorAll('.sem-card');

  if (!filterChips.length) return;

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterVal = chip.getAttribute('data-filter');

      // Clear search when switching filter chip for smooth experience
      const searchInput = document.getElementById('global-search-input');
      if (searchInput && searchInput.value) {
        searchInput.value = '';
        document.querySelectorAll('.subject-card').forEach(c => {
          c.style.display = '';
          c.classList.remove('highlight');
        });
        const noResultsMsg = document.getElementById('no-search-results');
        if (noResultsMsg) noResultsMsg.style.display = 'none';
      }

      // Filter semester groups with subject cards
      if (semGroups.length > 0) {
        semGroups.forEach(group => {
          const semNum = group.getAttribute('data-semester');
          const yearNum = group.getAttribute('data-year');

          // Reset all subjects inside to visible
          group.querySelectorAll('.subject-card').forEach(c => c.style.display = '');

          if (filterVal === 'all') {
            group.style.display = '';
          } else if (filterVal === 'sem-5-6' && (semNum === '5' || semNum === '6')) {
            group.style.display = '';
          } else if (filterVal.startsWith('year-') && yearNum === filterVal.replace('year-', '')) {
            group.style.display = '';
          } else if (filterVal.startsWith('sem-') && semNum === filterVal.replace('sem-', '')) {
            group.style.display = '';
          } else {
            group.style.display = 'none';
          }
        });
      }

      // Filter legacy .sem-card (e.g. pyq.html)
      if (semCards.length > 0) {
        semCards.forEach(card => {
          const semNum = card.getAttribute('data-semester');
          const yearNum = card.getAttribute('data-year');

          if (filterVal === 'all') {
            card.style.display = '';
          } else if (filterVal === 'sem-5-6' && (semNum === '5' || semNum === '6')) {
            card.style.display = '';
          } else if (filterVal.startsWith('year-') && yearNum === filterVal.replace('year-', '')) {
            card.style.display = '';
          } else if (filterVal.startsWith('sem-') && semNum === filterVal.replace('sem-', '')) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });
}

/* ==========================================================================
   KEYBOARD SHORTCUTS
   ========================================================================== */

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('global-search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      } else {
        openContributeModal();
      }
    }
  });
}

/* ==========================================================================
   MODALS (CONTRIBUTE & FEEDBACK)
   ========================================================================== */

function initModals() {
  const openBtns = document.querySelectorAll('[data-open-modal]');
  const closeBtns = document.querySelectorAll('[data-close-modal]');
  const allModals = document.querySelectorAll('.modal-backdrop');

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    if (!document.querySelector('.modal-backdrop.open')) {
      document.body.classList.remove('modal-open');
    }
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(`${modalType}-modal`);
      if (targetModal) openModal(targetModal);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach(m => {
        if (m.classList.contains('open')) closeModal(m);
      });
    }
  });
}

function openContributeModal() {
  const backdrop = document.getElementById('contribute-modal');
  if (backdrop) {
    backdrop.classList.add('open');
    document.body.classList.add('modal-open');
  }
}

/* ==========================================================================
   CLIPBOARD HELPER (SAFE CROSS-BROWSER)
   ========================================================================== */

function copyEmailToClipboard(email = 'Binarymind1207@gmail.com') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email)
      .then(() => {
        showToast(`Email copied: ${email}`, 'success');
      })
      .catch(() => {
        fallbackCopy(email);
      });
  } else {
    fallbackCopy(email);
  }

  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(`Email copied: ${text}`, 'success');
    } catch (e) {
      showToast(`Official Email: ${text}`, 'info');
    }
  }
}
window.copyEmailToClipboard = copyEmailToClipboard;

/* ==========================================================================
   WANNA JOIN BINARY MINDS - FORM SUBMISSION HANDLER
   Sends user application data (Name, Phone, Email, Year, City, Why) to Binarymind1207@gmail.com
   ========================================================================== */

function initJoinForm() {
  const forms = [
    {
      form: document.getElementById('join-binary-minds-form'),
      card: document.getElementById('join-success-card'),
      nameDisplay: document.getElementById('applicant-name-display')
    },
    {
      form: document.getElementById('join-binary-minds-form-inline'),
      card: document.getElementById('inline-join-success-card'),
      nameDisplay: document.getElementById('inline-applicant-name-display')
    }
  ];

  forms.forEach(({ form, card, nameDisplay }) => {
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = (form.querySelector('input[name="name"]')?.value || '').trim();
      const phone = (form.querySelector('input[name="phone"]')?.value || '').trim();
      const email = (form.querySelector('input[name="email"]')?.value || '').trim();
      const year = form.querySelector('select[name="year"]')?.value || '';
      const city = (form.querySelector('input[name="city"]')?.value || '').trim();
      const whyJoin = (form.querySelector('textarea[name="why_join"]')?.value || '').trim();

      if (!name || !phone || !email || !year || !city || !whyJoin) {
        showToast('Please fill out all required fields!', 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Submitting Application...</span>`;
      }

      const payload = {
        name,
        phone,
        email,
        year,
        city,
        why_join: whyJoin,
        _subject: `New Binary Minds Join Request from ${name}`,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/Binarymind1207@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          showSuccess(name);
        } else {
          throw new Error('API submission error');
        }
      } catch (err) {
        // Fallback: mailto
        const mailSubject = encodeURIComponent(`Binary Minds Team Application - ${name}`);
        const mailBody = encodeURIComponent(
          `Hello Team Binary Minds,\n\nI want to join Binary Minds!\n\n` +
          `• Full Name: ${name}\n` +
          `• Phone Number: ${phone}\n` +
          `• Email: ${email}\n` +
          `• College Year: ${year}\n` +
          `• City: ${city}\n\n` +
          `• Why I Want to Join Binary Minds:\n${whyJoin}\n\nLooking forward to hearing from you!`
        );
        window.open(`mailto:Binarymind1207@gmail.com?subject=${mailSubject}&body=${mailBody}`, '_blank');
        showSuccess(name);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Submit Application to Binary Minds</span> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>`;
        }
      }

      function showSuccess(applicantName) {
        form.style.display = 'none';
        if (card) {
          card.classList.add('active');
        }
        if (nameDisplay) {
          nameDisplay.textContent = applicantName;
        }
        showToast(`Application submitted! Welcome ${applicantName}!`, 'success');
      }
    });
  });
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */

function initToast() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    initToast();
    container = document.querySelector('.toast-container');
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = `✨`;
  if (type === 'error') icon = `⚠️`;
  if (type === 'info') icon = `💡`;

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   STUDENT TOOL 1: SGPA CALCULATOR (UPDATED CURRICULA PRESETS)
   ========================================================================== */

const GRADE_POINTS = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0
};

const CURRICULUM_PRESETS = {
  'sem-1': [
    { name: 'Mathematics For Computer Science', credit: 4, grade: 'A+' },
    { name: 'Problem Solving Using C', credit: 4, grade: 'A' },
    { name: 'Computer Architecture', credit: 4, grade: 'A' },
    { name: 'General English', credit: 3, grade: 'A' },
    { name: 'Indian Knowledge System', credit: 2, grade: 'O' },
    { name: 'Environmental Science', credit: 2, grade: 'A+' },
  ],
  'sem-2': [
    { name: 'Object Oriented Programming using C++', credit: 4, grade: 'A+' },
    { name: 'Data Structures', credit: 4, grade: 'A' },
    { name: 'Operating Systems', credit: 4, grade: 'A' },
    { name: 'Web Technologies', credit: 3, grade: 'A+' },
    { name: 'Object Oriented Programming using Java', credit: 4, grade: 'A' },
    { name: 'Indian Constitution', credit: 2, grade: 'O' },
  ],
  'sem-3': [
    { name: 'Probability and Statistics', credit: 4, grade: 'A' },
    { name: 'Database Management System', credit: 4, grade: 'A+' },
    { name: 'Python Programming', credit: 4, grade: 'O' },
    { name: 'Software Engineering', credit: 3, grade: 'A' },
    { name: 'Feature Engineering', credit: 3, grade: 'A' },
    { name: 'Basics of Data Analytics using Spreadsheet', credit: 2, grade: 'A+' },
    { name: 'Yoga and Physical Fitness', credit: 2, grade: 'O' },
  ],
  'sem-4': [
    { name: 'Entrepreneurship and Startup Ecosystem', credit: 3, grade: 'O' },
    { name: 'Computer Networks', credit: 4, grade: 'A+' },
    { name: 'Design and Analysis of Algorithm', credit: 4, grade: 'A' },
    { name: 'Artificial Intelligence', credit: 4, grade: 'A+' },
    { name: 'Introduction to ML', credit: 3, grade: 'A' },
    { name: 'Data Visualization', credit: 3, grade: 'A+' },
    { name: 'Design Thinking and Innovation', credit: 2, grade: 'O' },
  ]
};

function initSGPACalculator() {
  const tbody = document.getElementById('sgpa-subject-rows');
  const addRowBtn = document.getElementById('add-subject-row-btn');
  const resetBtn = document.getElementById('reset-sgpa-btn');
  const scoreDisplay = document.getElementById('sgpa-score-value');
  const remarkDisplay = document.getElementById('sgpa-remark');
  const presetBtns = document.querySelectorAll('.preset-btn');

  if (!tbody) return;

  function renderRows(subjects) {
    tbody.innerHTML = '';
    subjects.forEach((sub) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="text" class="calc-input sub-name" value="${sub.name}" placeholder="Subject name"></td>
        <td><input type="number" class="calc-input sub-credit" value="${sub.credit}" min="1" max="10"></td>
        <td>
          <select class="calc-select sub-grade">
            ${Object.keys(GRADE_POINTS).map(g => `<option value="${g}" ${g === sub.grade ? 'selected' : ''}>${g} (${GRADE_POINTS[g]} pts)</option>`).join('')}
          </select>
        </td>
        <td style="text-align: center;">
          <button type="button" class="btn-icon remove-row-btn" title="Remove" style="width:32px;height:32px;display:inline-flex;">✕</button>
        </td>
      `;
      tbody.appendChild(tr);

      tr.querySelector('.remove-row-btn').addEventListener('click', () => {
        if (tbody.children.length > 1) {
          tr.remove();
          calculateSGPA();
        } else {
          showToast('Keep at least 1 subject row!', 'info');
        }
      });
    });
  }

  // Load Semester 1 by default
  renderRows(CURRICULUM_PRESETS['sem-1']);
  calculateSGPA();

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      if (CURRICULUM_PRESETS[presetKey]) {
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderRows(CURRICULUM_PRESETS[presetKey]);
        calculateSGPA();
        showToast(`Loaded ${btn.textContent} subjects!`, 'success');
      } else {
        showToast(`${btn.textContent} curriculum is coming soon! Use custom subject rows below.`, 'info');
      }
    });
  });

  if (addRowBtn) {
    addRowBtn.addEventListener('click', () => {
      const count = tbody.children.length + 1;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="text" class="calc-input sub-name" value="Custom Elective ${count}" placeholder="Subject name"></td>
        <td><input type="number" class="calc-input sub-credit" value="3" min="1" max="10"></td>
        <td>
          <select class="calc-select sub-grade">
            ${Object.keys(GRADE_POINTS).map(g => `<option value="${g}" ${g === 'A' ? 'selected' : ''}>${g} (${GRADE_POINTS[g]} pts)</option>`).join('')}
          </select>
        </td>
        <td style="text-align: center;">
          <button type="button" class="btn-icon remove-row-btn" title="Remove" style="width:32px;height:32px;display:inline-flex;">✕</button>
        </td>
      `;
      tbody.appendChild(tr);
      tr.querySelector('.remove-row-btn').addEventListener('click', () => {
        if (tbody.children.length > 1) {
          tr.remove();
          calculateSGPA();
        }
      });
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      renderRows(CURRICULUM_PRESETS['sem-1']);
      calculateSGPA();
      showToast('Calculator reset to Semester 1', 'info');
    });
  }

  tbody.addEventListener('input', calculateSGPA);
  tbody.addEventListener('change', calculateSGPA);

  function calculateSGPA() {
    const rows = tbody.querySelectorAll('tr');
    let totalCredits = 0;
    let weightedPoints = 0;

    rows.forEach(row => {
      const credit = parseFloat(row.querySelector('.sub-credit').value) || 0;
      const grade = row.querySelector('.sub-grade').value;
      const point = GRADE_POINTS[grade] !== undefined ? GRADE_POINTS[grade] : 0;

      if (credit > 0) {
        totalCredits += credit;
        weightedPoints += (credit * point);
      }
    });

    const sgpa = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : '0.00';
    if (scoreDisplay) scoreDisplay.textContent = sgpa;

    if (remarkDisplay) {
      const numSGPA = parseFloat(sgpa);
      if (numSGPA >= 9.0) remarkDisplay.textContent = '🌟 Outstanding! Top tier academic performance!';
      else if (numSGPA >= 8.0) remarkDisplay.textContent = '🔥 Excellent! Distinction grade territory!';
      else if (numSGPA >= 7.0) remarkDisplay.textContent = '👍 Very Good! Solid First Class performance!';
      else if (numSGPA >= 6.0) remarkDisplay.textContent = '👌 Good, well cleared! Keep pushing higher!';
      else if (numSGPA >= 5.0) remarkDisplay.textContent = '⚡ Passed. A bit more revision will boost this!';
      else remarkDisplay.textContent = '⚠️ Attention needed! Focus on PYQs and revision!';
    }
  }
}

/* ==========================================================================
   STUDENT TOOL 2: 75% ATTENDANCE "BUNK OR ATTEND" CALCULATOR
   ========================================================================== */

function initAttendanceCalculator() {
  const totalHeldInput = document.getElementById('att-total-held');
  const attendedInput = document.getElementById('att-attended');
  const targetPctInput = document.getElementById('att-target-pct');
  const resultBox = document.getElementById('att-result-card');
  const pctDisplay = document.getElementById('att-current-pct');
  const statusDisplay = document.getElementById('att-status-text');
  const adviceDisplay = document.getElementById('att-advice-text');

  if (!totalHeldInput || !attendedInput) return;

  function calculateAttendance() {
    const held = parseInt(totalHeldInput.value, 10) || 0;
    const attended = parseInt(attendedInput.value, 10) || 0;
    const target = parseFloat(targetPctInput.value) || 75;

    if (held <= 0) {
      if (pctDisplay) pctDisplay.textContent = '0%';
      if (adviceDisplay) adviceDisplay.textContent = 'Enter classes held and attended to calculate.';
      return;
    }

    if (attended > held) {
      if (adviceDisplay) adviceDisplay.textContent = 'Attended classes cannot be greater than classes held!';
      return;
    }

    const currentPct = (attended / held) * 100;
    if (pctDisplay) pctDisplay.textContent = `${currentPct.toFixed(1)}%`;

    if (resultBox) {
      resultBox.classList.remove('safe', 'warning', 'danger');
    }

    if (currentPct >= target) {
      const maxBunks = Math.floor((100 * attended - target * held) / target);
      if (resultBox) resultBox.classList.add('safe');
      if (statusDisplay) statusDisplay.textContent = '🎉 You are in the Safe Zone!';
      if (adviceDisplay) {
        if (maxBunks > 0) {
          adviceDisplay.innerHTML = `You can safely <strong>bunk the next ${maxBunks} lecture(s)</strong> and still remain above ${target}%.`;
        } else {
          adviceDisplay.innerHTML = `You are right on the edge of ${target}%. Don't bunk the next class or your percentage will dip!`;
        }
      }
    } else {
      if (resultBox) {
        resultBox.classList.add(currentPct < 60 ? 'danger' : 'warning');
      }
      if (statusDisplay) statusDisplay.textContent = '⚠️ Attendance Below Target!';

      if (target >= 100) {
        if (adviceDisplay) {
          adviceDisplay.innerHTML = `You have already missed <strong>${held - attended} lecture(s)</strong>, so 100% attendance is mathematically impossible this semester.`;
        }
      } else {
        const needToAttend = Math.ceil((target * held - 100 * attended) / (100 - target));
        if (adviceDisplay) {
          adviceDisplay.innerHTML = `You need to attend the next <strong>${needToAttend} class(es) consecutively</strong> without absenting to reach ${target}%.`;
        }
      }
    }
  }

  totalHeldInput.addEventListener('input', calculateAttendance);
  attendedInput.addEventListener('input', calculateAttendance);
  targetPctInput.addEventListener('input', calculateAttendance);
  calculateAttendance();
}

/* ==========================================================================
   STUDENT TOOL 3: POMODORO STUDY TIMER WITH WEB AUDIO CHIME
   ========================================================================== */

function initPomodoroTimer() {
  const timerDigits = document.getElementById('pomo-timer-display');
  const startBtn = document.getElementById('pomo-start-btn');
  const resetBtn = document.getElementById('pomo-reset-btn');
  const modeBtns = document.querySelectorAll('.pomo-mode-btn');
  const progressCircle = document.getElementById('pomo-progress-circle');
  const sessionCountDisplay = document.getElementById('pomo-session-count');

  if (!timerDigits || !startBtn) return;

  const MODES = {
    'work': 25 * 60,
    'shortBreak': 5 * 60,
    'longBreak': 15 * 60
  };

  let currentMode = 'work';
  let totalTime = MODES[currentMode];
  let timeRemaining = totalTime;
  let timerInterval = null;
  let isRunning = false;
  let completedSessions = parseInt(localStorage.getItem('fn_pomo_sessions') || '0', 10);

  if (sessionCountDisplay) sessionCountDisplay.textContent = completedSessions;

  const CIRCLE_LENGTH = 690;

  function updateDisplay() {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    timerDigits.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (progressCircle) {
      const progress = (totalTime - timeRemaining) / totalTime;
      const offset = CIRCLE_LENGTH - (progress * CIRCLE_LENGTH);
      progressCircle.style.strokeDashoffset = offset;
    }
  }

  function playChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {}
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.textContent = 'Pause';
    startBtn.style.background = 'var(--accent-amber)';

    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        playChime();
        startBtn.textContent = 'Start';
        startBtn.style.background = '';

        if (currentMode === 'work') {
          completedSessions++;
          localStorage.setItem('fn_pomo_sessions', completedSessions);
          if (sessionCountDisplay) sessionCountDisplay.textContent = completedSessions;
          showToast('🎉 Focus session completed! Take a break!', 'success');
        } else {
          showToast('Break finished! Ready to lock back in?', 'info');
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = 'Resume';
    startBtn.style.background = '';
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeRemaining = totalTime;
    startBtn.textContent = 'Start';
    startBtn.style.background = '';
    updateDisplay();
  }

  startBtn.addEventListener('click', () => {
    if (isRunning) pauseTimer();
    else startTimer();
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', resetTimer);
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentMode = btn.getAttribute('data-mode');
      totalTime = MODES[currentMode];
      resetTimer();
    });
  });

  updateDisplay();
}

/* ==========================================================================
   TOOL TABS SWITCHER (ON TOOLS.HTML)
   ========================================================================== */

function initToolTabs() {
  const toolTabBtns = document.querySelectorAll('.tool-tab-btn');
  const toolPanels = document.querySelectorAll('.tool-panel');

  if (!toolTabBtns.length) return;

  function activateTab(targetId) {
    toolTabBtns.forEach(b => {
      const isTarget = b.getAttribute('data-tool-target') === targetId;
      b.classList.toggle('active', isTarget);
    });
    toolPanels.forEach(p => {
      p.classList.toggle('active', p.id === targetId);
    });
  }

  toolTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tool-target');
      activateTab(targetId);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `#${targetId.replace('panel-', '')}`);
      }
    });
  });

  // Handle direct hash navigation on tools.html (e.g. #pomodoro, #attendance, #sgpa)
  const initialHash = (window.location.hash || '').replace('#', '');
  if (initialHash) {
    const matchedBtn = Array.from(toolTabBtns).find(b => {
      const target = b.getAttribute('data-tool-target');
      return target === initialHash || target === `panel-${initialHash}`;
    });
    if (matchedBtn) {
      activateTab(matchedBtn.getAttribute('data-tool-target'));
    }
  }
}

