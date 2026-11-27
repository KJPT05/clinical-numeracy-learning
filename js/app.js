// Clinical Numeracy Learning – app logic.
// Questions live in questions/*.js and js/drills.js; this file should rarely need editing.
(() => {
  'use strict';

  const APP_VERSION = 'v2.0';
  const STORAGE_PREFIX = 'cnl_progress_';        // + workbook id. Do not change between releases.
  const ACCEPT_KEY = 'cnl_accepted';
  const LEGACY_PREFIX = 'clinicalNumeracyLearningMultiWorkbookV1_9_';

  const WORKBOOKS = NUMERACY.workbooks;
  // Calculation skills are shown first, in teaching order (simplest first). Ids never change: saved progress uses them.
  const SKILL_ORDER = ['drill-conversions', 'drill-tablets', 'drill-liquids', 'drill-concentration', 'drill-injections', 'drill-weight', 'drill-pump', 'drill-drip', 'drill-times', 'drill-fluid'];
  const skillRank = d => { const i = SKILL_ORDER.indexOf(d.id); return i === -1 ? 999 : i; };
  const DRILLS = [...NUMERACY.drills].sort((a, b) => skillRank(a) - skillRank(b))
    .map((d, i) => Object.assign({ isDrill: true, theme: 'drill', system: `Skill ${i + 1}` }, d));
  const ALL = [...DRILLS, ...WORKBOOKS];
  const byId = id => ALL.find(w => w.id === id);

  // ---------------------------------------------------------------- storage
  const store = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (_) { return null; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* storage full or blocked */ } },
    remove(key) { try { localStorage.removeItem(key); } catch (_) { } }
  };

  const emptyState = () => ({
    schema: 2, mode: 'practice', current: 0, answers: {}, attempts: {}, checked: {},
    calculatorHistory: [], view: 'questions', finished: false, retry: null, generated: null
  });

  function readSaved(id) {
    let saved = store.get(STORAGE_PREFIX + id);
    if (!saved) {
      const legacy = store.get(LEGACY_PREFIX + id);
      if (legacy && typeof legacy === 'object') {
        saved = Object.assign(emptyState(), {
          mode: legacy.mode || 'practice', current: legacy.current || 0,
          answers: legacy.answers || {}, attempts: legacy.attempts || {}, checked: legacy.checked || {},
          calculatorHistory: legacy.calculatorHistory || []
        });
        store.set(STORAGE_PREFIX + id, saved);
      }
    }
    return saved;
  }
  // One-off: carry over the old "I understand" tick.
  if (store.get(ACCEPT_KEY) === null) {
    const old = store.get(LEGACY_PREFIX + 'frank');
    if (old && old.accepted) store.set(ACCEPT_KEY, true);
  }

  let active = WORKBOOKS[0];
  let state = emptyState();

  const key = () => STORAGE_PREFIX + active.id;
  function loadState() {
    state = Object.assign(emptyState(), readSaved(active.id) || {});
    ['answers', 'attempts', 'checked'].forEach(k => { if (!state[k] || typeof state[k] !== 'object') state[k] = {}; });
    if (!Array.isArray(state.calculatorHistory)) state.calculatorHistory = [];
    if (active.isDrill && !Array.isArray(state.generated)) state.generated = null;
  }
  function saveState() { store.set(key(), state); }
  function clearState() { store.remove(key()); store.remove(LEGACY_PREFIX + active.id); state = emptyState(); }

  const questions = () => active.isDrill ? (state.generated || []) : active.questions;
  const total = () => questions().length;
  const modeName = m => ({ learn: 'Learn', practice: 'Practice', challenge: 'Challenge' })[m] || 'Practice';
  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  const firstName = wb => wb.title.split(':')[0];

  // ---------------------------------------------------------------- elements
  const $ = id => document.getElementById(id);
  const els = {
    welcome: $('welcomeScreen'), choice: $('workbookChoiceScreen'), mode: $('modeScreen'), workbook: $('workbookScreen'), results: $('resultsScreen'),
    understand: $('understandCheck'), choose: $('chooseWorkbookBtn'), caseCards: $('caseCards'), drillCards: $('drillCards'),
    questionCard: $('questionCard'), questionDots: $('questionDots'), progressText: $('progressText'), progressCount: $('progressCount'),
    progressFill: $('progressFill'), modeLabel: $('modeLabel'), navMessage: $('navMessage'), previous: $('previousBtn'), next: $('nextBtn'),
    sheet: $('toolSheet'), backdrop: $('sheetBackdrop'), sheetTitle: $('sheetTitle'),
    calculatorPanel: $('calculatorPanel'), formulaPanel: $('formulaPanel'), conversionPanel: $('conversionPanel'), newsPanel: $('newsPanel'), scorePanel: $('scorePanel'),
    resultScore: $('resultScore'), resultMessage: $('resultMessage'), resultList: $('resultList'),
    retryCard: $('retryCard'), retryHeading: $('retryHeading'), retryText: $('retryText'), retryProgress: $('retryProgress')
  };
  $('appVersion').textContent = APP_VERSION;

  function showScreen(name) {
    [els.welcome, els.choice, els.mode, els.workbook, els.results].forEach(s => s.classList.remove('active'));
    els[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function updateLabels() { document.querySelectorAll('[data-workbook-title]').forEach(e => { e.textContent = active.title; }); }

  // ---------------------------------------------------------------- marking (see js/engine.js)
  const { roundTo, parseAnswer, formatAnswer, normaliseTime, evaluate } = NUMERACY.engine;

  function feedbackHtml(q, r) {
    if (r.correct) {
      let note = '';
      if (r.moreDp) note = `<span class="note">Your value is correct, but the question asks for ${q.dp === 1 ? 'one decimal place' : q.dp + ' decimal places'}: write <strong>${esc(formatAnswer(q))}</strong>. In an exam, follow the rounding instruction exactly.</span>`;
      return { cls: 'correct', html: `<strong>Correct: ${esc(formatAnswer(q))}.</strong><br>${q.explanation}${note}` };
    }
    if (q.answerType === 'time') {
      return { cls: 'error', html: `<strong>Not correct.</strong><br>Check the time calculation. Use the 24-hour clock.<br><br><strong>Method:</strong> ${q.explanation}` };
    }
    const issues = [];
    if (r.signIssue) issues.push('Check the sign: is this a positive or a negative value?');
    else if (r.roundingIssue) issues.push(`You are close: check your rounding. The answer must be given to ${q.dp === 0 ? 'the nearest whole number' : q.dp === 1 ? 'one decimal place' : q.dp + ' decimal places'}.`);
    else if (!r.numericOk) issues.push('Check the numerical calculation.');
    if (!r.unitOk) issues.push(`The required unit is <strong>${esc(q.unit)}</strong>.${q.unitNote ? ' ' + q.unitNote : ''}`);
    if (r.numericOk && !r.unitOk) issues.unshift('The numerical value is correct.');
    return { cls: 'error', html: `<strong>Not correct.</strong><br>${issues.join(' ')}<br><br><strong>Method:</strong> ${q.explanation}` };
  }

  function answerText(q, a) {
    if (!a || a.value === '' || a.value == null) return 'No answer';
    if (q.answerType === 'time') return esc(a.value);
    return esc(String(a.value).replace('-', '−')) + (a.unit ? ' ' + esc(a.unit) : ' (no unit)');
  }

  // ---------------------------------------------------------------- choice screen
  function cardHtml(wb) {
    const n = wb.isDrill ? wb.count : wb.questions.length;
    const label = wb.isDrill ? `${n} questions · new numbers each time` : `${n} questions`;
    return `<section class="card workbook-card theme-${esc(wb.theme)}">
      <span class="pill theme-${esc(wb.theme)}">${esc(wb.system)}</span>
      <h2>${esc(wb.title)}</h2>
      <p class="card-meta">${label}</p>
      <p class="muted" style="margin-top:0">${esc(wb.summary || '')}</p>
      <p id="saved-${esc(wb.id)}" class="resume-line"></p>
      <button class="btn choose-workbook" data-workbook="${esc(wb.id)}" type="button">${wb.isDrill ? 'Start skill' : 'Choose ' + esc(firstName(wb))}</button>
    </section>`;
  }
  function buildCards() {
    els.caseCards.innerHTML = WORKBOOKS.map(cardHtml).join('');
    els.drillCards.innerHTML = DRILLS.map(cardHtml).join('');
    document.querySelectorAll('.choose-workbook').forEach(b => b.addEventListener('click', () => openWorkbook(b.dataset.workbook)));
  }
  function updateWorkbookCards() {
    ALL.forEach(wb => {
      const target = $('saved-' + wb.id);
      if (!target) return;
      const saved = readSaved(wb.id);
      const qs = wb.isDrill ? (saved && saved.generated) || [] : wb.questions;
      const ids = new Set(qs.map(q => q.id));
      const sub = saved ? Object.keys(saved.checked || {}).filter(id => ids.has(id)).length : 0;
      target.textContent = sub ? `Saved progress: ${sub} of ${qs.length} submitted.` : 'No saved progress yet.';
    });
  }

  function openWorkbook(id) {
    active = byId(id) || WORKBOOKS[0];
    loadState();
    updateLabels();
    renderModeScreen();
    showScreen('mode');
  }

  function renderModeScreen() {
    const intro = $('caseIntroCard');
    if (active.intro || active.isDrill) {
      intro.style.display = 'block';
      intro.innerHTML = active.isDrill
        ? `<h2>About this skill</h2><p class="muted" style="margin:0">${esc(active.summary)} Each attempt gives you ${active.count} new questions.</p>`
        : `<h2>Case summary</h2><p class="muted" style="margin:0">${esc(active.intro)}</p>`;
    } else intro.style.display = 'none';

    const card = $('existingSessionCard');
    const count = Object.keys(state.answers).length;
    if (!count && !state.finished) { card.style.display = 'none'; return; }
    card.style.display = 'block';
    card.innerHTML = `<h2>Saved ${active.isDrill ? 'skill practice' : 'workbook'}</h2>
      <p class="muted">You have saved answers in ${modeName(state.mode)} mode. Choosing a mode above starts again${active.isDrill ? ' with new numbers' : ''}.</p>
      <div class="button-row two-col">
        <button id="continueSessionBtn" class="btn outline" type="button">Continue ${modeName(state.mode)} session</button>
        ${state.finished ? '<button id="viewResultsBtn" class="btn secondary" type="button">View results</button>' : ''}
      </div>`;
    $('continueSessionBtn').addEventListener('click', () => { state.view = 'questions'; saveState(); renderWorkbook(); showScreen('workbook'); });
    if (state.finished) $('viewResultsBtn').addEventListener('click', () => { renderResults(); showScreen('results'); });
  }

  function startMode(m) {
    const fresh = emptyState();
    fresh.mode = m;
    if (active.isDrill) {
      const seen = new Set();
      fresh.generated = [];
      let guard = 0;
      while (fresh.generated.length < active.count && guard++ < 200) {
        const q = active.make();
        const sig = q.context + q.prompt;
        if (seen.has(sig) && guard < 150) continue;
        seen.add(sig);
        q.id = `${active.id}-${fresh.generated.length + 1}`;
        fresh.generated.push(q);
      }
    }
    state = fresh;
    saveState();
    renderWorkbook();
    showScreen('workbook');
  }

  // ---------------------------------------------------------------- question screen
  const inRetry = () => state.view === 'retry' && state.retry;
  const inReview = () => state.view === 'review';
  const retryList = () => (state.retry ? state.retry.ids : []).map(id => questions().find(q => q.id === id)).filter(Boolean);
  const visibleQuestions = () => inRetry() ? retryList() : questions();
  function currentIndex() { return inRetry() ? state.retry.index : state.current; }
  function setIndex(i) { if (inRetry()) state.retry.index = i; else state.current = i; }

  function showNavMessage(text) {
    els.navMessage.textContent = text || '';
    els.navMessage.classList.toggle('show', !!text);
  }

  function renderWorkbook() {
    const list = visibleQuestions();
    if (!list.length) { showScreen('mode'); return; }
    const idx = Math.max(0, Math.min(currentIndex(), list.length - 1));
    setIndex(idx);
    const q = list[idx];
    const challenge = state.mode === 'challenge';
    updateLabels();
    showNavMessage('');

    if (inRetry()) {
      const done = Object.values(state.retry.results).filter(r => r.correct).length;
      els.modeLabel.textContent = 'Quick retry · Learn support';
      els.progressText.textContent = `Retry ${idx + 1} of ${list.length}`;
      els.progressCount.textContent = `${done} now correct`;
      els.progressFill.style.width = `${done / list.length * 100}%`;
    } else if (inReview()) {
      els.modeLabel.textContent = `Reviewing ${modeName(state.mode)} answers (read only)`;
      els.progressText.textContent = `Question ${idx + 1} of ${list.length}`;
      const correct = list.filter(x => state.checked[x.id] && state.checked[x.id].correct).length;
      els.progressCount.textContent = `${correct} correct`;
      els.progressFill.style.width = '100%';
    } else {
      const submitted = list.filter(x => state.checked[x.id]).length;
      els.modeLabel.textContent = `${modeName(state.mode)} mode`;
      els.progressText.textContent = `Question ${idx + 1} of ${list.length}`;
      els.progressCount.textContent = `${submitted} submitted`;
      els.progressFill.style.width = `${submitted / list.length * 100}%`;
    }

    els.questionDots.innerHTML = list.map((x, i) => {
      let cls = 'q-dot', label = `Question ${i + 1}`;
      const res = inRetry() ? state.retry.results[x.id] : state.checked[x.id];
      if (i === idx) cls += ' current';
      if (res) {
        if (challenge && !inReview() && !inRetry()) { cls += ' saved'; label += ', answer saved'; }
        else { cls += res.correct ? ' correct' : ' incorrect'; label += res.correct ? ', correct' : ', not correct'; }
      }
      const showTick = challenge && res && !inReview() && !inRetry();
      return `<button class="${cls}" type="button" data-index="${i}" aria-label="${label}"${i === idx ? ' aria-current="step"' : ''}>${showTick ? '✓' : i + 1}</button>`;
    }).join('');
    els.questionDots.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { setIndex(Number(b.dataset.index)); saveState(); renderWorkbook(); }));

    renderQuestion(q);
    els.previous.disabled = idx === 0;
    const last = idx === list.length - 1;
    els.next.textContent = last ? (inRetry() || inReview() ? 'Back to results' : (active.isDrill ? 'Finish skill' : 'Finish workbook')) : 'Next question';
  }

  function toolsFor(q, mode) {
    // What each mode is allowed to see.
    const learn = mode === 'learn', practice = mode === 'practice';
    const buttons = ['<button class="tool-btn" data-tool="calculator" type="button">Calculator</button>'];
    if (learn) buttons.push('<button class="tool-btn" data-tool="formula" type="button">Formula</button>');
    if (learn || practice) buttons.push('<button class="tool-btn" data-tool="conversion" type="button">Units</button>');
    if ((learn || practice) && q.showNews) buttons.push('<button class="tool-btn" data-tool="news" type="button">NEWS2 chart</button>');
    if (learn && q.scoreList) buttons.push('<button class="tool-btn" data-tool="scores" type="button">Item scores</button>');
    if (mode === 'challenge') buttons.push('<button class="tool-btn dimmed" type="button" disabled>Formula &amp; units hidden</button>');
    const cols = buttons.length >= 3 ? '' : ' two';
    return `<div class="tool-row${cols}">${buttons.join('')}</div>`;
  }

  function renderQuestion(q) {
    const retry = inRetry(), review = inReview();
    const mode = retry ? 'learn' : state.mode;
    const challenge = mode === 'challenge';
    const a = (retry ? state.retry.answers[q.id] : state.answers[q.id]) || { value: '', unit: '', working: '' };
    const result = retry ? state.retry.results[q.id] : state.checked[q.id];
    const disabled = review ? ' disabled' : '';
    const isNeg = String(a.value || '').trim().startsWith('-');

    let answerHtml;
    if (q.answerType === 'time') {
      answerHtml = `<div class="answer-area"><label for="timeAnswer">Your answer (24-hour clock, for example 09:30)</label>
        <input id="timeAnswer" type="text" inputmode="numeric" placeholder="HH:MM" autocomplete="off" value="${esc(a.value || '')}"${disabled}></div>`;
    } else {
      answerHtml = `<div class="answer-area"><label for="numericAnswer">Your answer</label>
        <div class="answer-row">
          <div class="num-wrap">
            <button id="signBtn" class="sign-btn" type="button" aria-label="Make the answer negative or positive" aria-pressed="${isNeg}"${disabled}>±</button>
            <input id="numericAnswer" type="text" inputmode="decimal" autocomplete="off" placeholder="Number" value="${esc(a.value || '')}"${disabled}>
          </div>
          <select id="unitAnswer" aria-label="Unit"${disabled}>
            <option value="">Select unit</option>
            ${q.units.map(u => `<option value="${esc(u)}"${a.unit === u ? ' selected' : ''}>${esc(u)}</option>`).join('')}
          </select>
        </div></div>`;
    }

    const intro = active.intro ? `<details class="case-intro"><summary>Case summary: ${esc(firstName(active))}</summary><p>${esc(active.intro)}</p></details>` : '';
    let banner = '';
    if (review) banner = `<div class="view-banner"><strong>Read-only review.</strong> Your ${modeName(state.mode)} result is kept. Use Quick retry on the results page to try questions again.</div>`;
    else if (retry) banner = `<div class="view-banner"><strong>Quick retry.</strong> Hints and tools are available. Retries do not change your workbook score.</div>`;
    else if (challenge) banner = `<div class="challenge-message">Challenge mode: formulas, reference charts and item scores are hidden. Your answers are marked when you finish.</div>`;

    els.questionCard.innerHTML = `${intro}
      <div class="question-topic">${esc(q.topic)}</div>
      <h2>${esc(q.title)}</h2>
      <p class="muted">${esc(q.context)}</p>
      <div class="context-box"><strong>Information provided</strong>
        <div class="data-list">${q.data.map(d => `<div class="data-item">${esc(d)}</div>`).join('')}</div></div>
      <p><strong>${esc(q.prompt)}</strong></p>
      ${banner}
      ${answerHtml}
      ${review ? '' : `<button id="workingToggle" class="working-toggle" type="button" aria-expanded="${a.working ? 'true' : 'false'}" aria-controls="workingWrap">Show calculation working</button>`}
      <div id="workingWrap" class="working-wrap ${a.working ? 'open' : ''}">
        <label for="workingAnswer" class="small">Your working (optional)</label>
        <textarea id="workingAnswer" placeholder="For example: 1000 ÷ 8 = 125"${disabled}>${esc(a.working || '')}</textarea>
      </div>
      ${review ? '' : toolsFor(q, mode)}
      ${mode === 'learn' && !review ? '<div class="question-actions"><button id="hintBtn" class="btn outline" type="button">Show hint</button></div>' : ''}
      <div id="hintBox" class="feedback info" role="status" aria-live="polite"></div>
      ${review ? `<p class="answer-summary"><strong>Your answer:</strong> ${answerText(q, a)}</p>` : `<div class="question-actions"><button id="checkBtn" class="btn${result && challenge ? ' save-btn saved' : ''}" type="button">${challenge ? (result ? '✓ Answer saved – save again' : 'Save answer') : 'Check answer'}</button></div>`}
      <div id="feedbackBox" class="feedback" role="status" aria-live="polite"></div>`;

    // Events
    if (!review) {
      $('workingToggle').addEventListener('click', e => {
        const open = $('workingWrap').classList.toggle('open');
        e.currentTarget.setAttribute('aria-expanded', String(open));
      });
      $('workingAnswer').addEventListener('input', saveInputs);
      if (q.answerType === 'time') {
        $('timeAnswer').addEventListener('input', saveInputs);
      } else {
        $('numericAnswer').addEventListener('input', () => { saveInputs(); syncSign(); });
        $('unitAnswer').addEventListener('change', saveInputs);
        $('signBtn').addEventListener('click', () => {
          const i = $('numericAnswer');
          const v = i.value.trim();
          i.value = v.startsWith('-') || v.startsWith('−') ? v.slice(1) : '-' + v;
          saveInputs(); syncSign(); i.focus();
        });
      }
      els.questionCard.querySelectorAll('[data-tool]').forEach(b => b.addEventListener('click', () => openTool(b.dataset.tool, q, b)));
      $('checkBtn').addEventListener('click', () => submitQuestion(q));
      if (mode === 'learn') $('hintBtn').addEventListener('click', () => {
        const box = $('hintBox');
        box.innerHTML = `<strong>Hint:</strong> ${esc(q.hint)}`;
        box.classList.add('show');
      });
      const enterSubmits = e => { if (e.key === 'Enter') { e.preventDefault(); submitQuestion(q); } };
      ($('numericAnswer') || $('timeAnswer')).addEventListener('keydown', enterSubmits);
    }

    if (result && (!challenge || review)) showFeedback(q, result);
    else if (result && challenge) {
      const box = $('feedbackBox');
      box.className = 'saved-message';
      box.innerHTML = '<strong>✓ Answer saved.</strong> You can change and save it again before finishing the workbook.';
    }
    if (review && !result) {
      const box = $('feedbackBox');
      box.className = 'feedback info show';
      box.innerHTML = `<strong>Not answered.</strong> Answer: ${esc(formatAnswer(q))}.<br><br><strong>Method:</strong> ${q.explanation}`;
    }
  }

  function syncSign() {
    const i = $('numericAnswer'), b = $('signBtn');
    if (i && b) b.setAttribute('aria-pressed', String(/^\s*[-−]/.test(i.value)));
  }

  function saveInputs() {
    const list = visibleQuestions();
    const q = list[currentIndex()];
    if (!q || inReview()) return;
    const entry = q.answerType === 'time'
      ? { value: $('timeAnswer').value, unit: '', working: $('workingAnswer').value }
      : { value: $('numericAnswer').value, unit: $('unitAnswer').value, working: $('workingAnswer').value };
    if (inRetry()) state.retry.answers[q.id] = entry; else state.answers[q.id] = entry;
    saveState();
  }

  function submitQuestion(q) {
    saveInputs();
    const answer = inRetry() ? state.retry.answers[q.id] : state.answers[q.id];
    const box = $('feedbackBox');
    let problem = '';
    if (q.answerType === 'time') {
      if (!normaliseTime(answer.value)) problem = 'Enter a time in 24-hour format, for example 09:30.';
    } else if (answer.value.trim() === '' || !answer.unit) {
      problem = 'Enter a numerical value and select a unit before continuing.';
    } else if (!parseAnswer(answer.value)) {
      problem = 'Enter numbers only, for example 1250 or -350 or 0.75. Choose the unit from the list.';
    }
    if (problem) {
      box.className = 'feedback error show';
      box.innerHTML = `<strong>Complete your answer.</strong><br>${problem}`;
      return;
    }
    const result = evaluate(q, answer);
    if (inRetry()) {
      state.retry.results[q.id] = result;
    } else {
      state.checked[q.id] = result;
      state.attempts[q.id] = (state.attempts[q.id] || 0) + 1;
    }
    saveState();
    renderWorkbook();
    const fb = $('feedbackBox');
    if (fb) fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showFeedback(q, r) {
    const box = $('feedbackBox');
    const f = feedbackHtml(q, r);
    box.className = `feedback ${f.cls} show`;
    box.innerHTML = f.html;
  }

  // ---------------------------------------------------------------- tools drawer
  let sheetReturnFocus = null;
  let activeTool = null;
  function openTool(tool, q, trigger) {
    sheetReturnFocus = trigger || document.activeElement;
    activeTool = tool;
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('show'));
    if (tool === 'calculator') { els.sheetTitle.textContent = 'Calculator'; renderCalculator(); els.calculatorPanel.classList.add('show'); }
    if (tool === 'formula') {
      els.sheetTitle.textContent = 'Formula';
      els.formulaPanel.innerHTML = `<div class="reference-list"><div class="reference-item"><strong>Current question</strong><br>${esc(q.formula)}</div><div class="reference-item"><strong>Reminder</strong><br>Use the information in the question. The formula does not complete the calculation for you.</div></div>`;
      els.formulaPanel.classList.add('show');
    }
    if (tool === 'conversion') {
      els.sheetTitle.textContent = 'Units and conversions';
      els.conversionPanel.innerHTML = `<div class="reference-list">
        <div class="reference-item"><strong>Mass</strong><br>1 g = 1,000 mg<br>1 mg = 1,000 micrograms</div>
        <div class="reference-item"><strong>Volume</strong><br>1 L = 1,000 mL</div>
        <div class="reference-item"><strong>Time</strong><br>1 hour = 60 minutes<br>Minutes → hours: ÷ 60</div>
        <div class="reference-item"><strong>Giving sets</strong><br>Crystalloid set: 20 drops/mL<br>Blood set: 15 drops/mL</div>
        <div class="reference-item"><strong>Percentage</strong><br>Percentage = (part ÷ whole) × 100</div>
        <div class="reference-item"><strong>Average</strong><br>Mean = sum of values ÷ number of values</div>
        <div class="reference-item"><strong>Rounding</strong><br>Look at the next digit: 5 or more rounds up; 4 or less rounds down.</div></div>`;
      els.conversionPanel.classList.add('show');
    }
    if (tool === 'news') { els.sheetTitle.textContent = 'NEWS2 Scale 1 reference'; renderNews(); els.newsPanel.classList.add('show'); }
    if (tool === 'scores') {
      els.sheetTitle.textContent = q.scoreTitle || 'Item scores';
      els.scorePanel.innerHTML = `<p class="small muted">Use this list to add each value. It is shown in Learn mode only.</p><div class="score-list">${q.scoreList.map(x => `<div class="score-row">${esc(x)}</div>`).join('')}</div>`;
      els.scorePanel.classList.add('show');
    }
    els.backdrop.classList.add('show');
    els.sheet.classList.add('show');
    els.sheet.removeAttribute('inert');
    els.sheet.setAttribute('aria-hidden', 'false');
    setTimeout(() => els.sheetTitle.focus(), 30);
  }
  function closeSheet() {
    if (!els.sheet.classList.contains('show')) return;
    els.backdrop.classList.remove('show');
    els.sheet.classList.remove('show');
    els.sheet.setAttribute('inert', '');
    els.sheet.setAttribute('aria-hidden', 'true');
    activeTool = null;
    if (sheetReturnFocus && document.body.contains(sheetReturnFocus)) sheetReturnFocus.focus();
  }

  // ---------------------------------------------------------------- calculator
  const calc = { exp: '', res: '', justEvaluated: false, last: '' };
  const OPS = ['÷', '×', '−', '+'];
  function calcPress(k) {
    if (k === '=') return calcEvaluate();
    if (calc.justEvaluated) {
      // After "=", an operator continues from the answer; a number starts a new calculation.
      calc.exp = (OPS.includes(k) || k === 'x²') ? calc.res + (k === 'x²' ? '²' : k) : (k === 'Ans' ? 'Ans' : k);
      calc.justEvaluated = false;
      calc.res = '';
    } else {
      calc.exp += k === 'x²' ? '²' : k;
    }
    calcUpdate();
  }
  function calcEvaluate() {
    try {
      let safe = calc.exp.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/²/g, '**2').replace(/Ans/g, calc.last ? `(${calc.last})` : '');
      if (!safe || !/^[0-9+\-*/.()\s]+$/.test(safe)) throw new Error('bad');
      const n = Function(`"use strict";return(${safe})`)();
      if (!Number.isFinite(n)) throw new Error('bad');
      calc.res = String(Math.round((n + Number.EPSILON) * 1e6) / 1e6);
      calc.last = calc.res;
      calc.justEvaluated = true;
      state.calculatorHistory.push(`${calc.exp} = ${calc.res}`);
      state.calculatorHistory = state.calculatorHistory.slice(-20);
      saveState();
      renderCalcHistory();
    } catch (_) { calc.res = 'Error'; calc.justEvaluated = false; }
    calcUpdate();
  }
  function calcUpdate() {
    const e = $('calcExpression'), r = $('calcResult');
    if (e) e.textContent = calc.exp;
    if (r) r.textContent = calc.res;
  }
  function renderCalcHistory() {
    const ul = $('calcHistoryList');
    if (!ul) return;
    ul.innerHTML = state.calculatorHistory.length ? state.calculatorHistory.slice(-5).reverse().map(x => `<li>${esc(x)}</li>`).join('') : '<li>No calculations saved yet.</li>';
  }
  function renderCalculator() {
    calc.exp = ''; calc.res = ''; calc.justEvaluated = false;
    els.calculatorPanel.innerHTML = `
      <div class="calc-display" aria-live="polite"><div id="calcExpression" class="calc-expression"></div><div id="calcResult" class="calc-result"></div></div>
      <div id="calcGrid" class="calc-grid"></div>
      <p class="calc-hint">Use brackets when order matters, e.g. BMI: 86 ÷ (1.72 × 1.72). x² squares the number before it. On a computer you can type too (Enter = equals).</p>
      <div class="calc-actions">
        <button id="calcClear" class="btn secondary" type="button">Clear</button>
        <button id="calcBack" class="btn secondary" type="button">Backspace</button>
        <button id="addWorking" class="btn outline" type="button">Copy calculation</button>
        <button id="useNumber" class="btn" type="button">Use result</button>
      </div>
      <p class="small muted" style="margin:9px 0 0"><strong>Copy calculation</strong> adds the full calculation to your working box. <strong>Use result</strong> copies only the final number into your answer; you must still round it if asked and choose the unit.</p>
      <div class="calc-history"><strong>Session history</strong><ul id="calcHistoryList"></ul></div>`;
    const keys = ['(', ')', 'x²', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', 'Ans', '='];
    const grid = $('calcGrid');
    keys.forEach(k => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `calc-key${OPS.includes(k) ? ' operator' : ''}${k === '=' ? ' equal' : ''}${['(', ')', 'x²', 'Ans'].includes(k) ? ' fn' : ''}`;
      b.textContent = k;
      b.setAttribute('aria-label', { '÷': 'divide', '×': 'multiply', '−': 'minus', '+': 'plus', 'x²': 'squared', '=': 'equals', 'Ans': 'previous answer', '(': 'open bracket', ')': 'close bracket', '.': 'decimal point' }[k] || k);
      b.addEventListener('click', () => calcPress(k));
      grid.appendChild(b);
    });
    $('calcClear').addEventListener('click', () => { calc.exp = ''; calc.res = ''; calc.justEvaluated = false; calcUpdate(); });
    $('calcBack').addEventListener('click', () => {
      if (calc.justEvaluated) { calc.justEvaluated = false; calc.res = ''; }
      calc.exp = calc.exp.endsWith('Ans') ? calc.exp.slice(0, -3) : calc.exp.slice(0, -1);
      calcUpdate();
    });
    $('useNumber').addEventListener('click', () => {
      const i = $('numericAnswer');
      if (i && calc.res !== '' && calc.res !== 'Error') { i.value = calc.res; saveInputs(); syncSign(); closeSheet(); }
    });
    $('addWorking').addEventListener('click', () => {
      const w = $('workingAnswer');
      if (w && calc.exp && calc.res !== 'Error') {
        w.value += `${w.value ? '\n' : ''}${calc.exp}${calc.res ? ' = ' + calc.res : ''}`;
        $('workingWrap').classList.add('open');
        saveInputs(); closeSheet();
      }
    });
    renderCalcHistory();
    calcUpdate();
  }

  function renderNews() {
    els.newsPanel.innerHTML = '<p class="small muted">Educational Scale 1 reference. Use current RCP NEWS2 resources and local policy in practice.</p><table class="news-table"><thead><tr><th scope="col">Parameter</th><th scope="col">3</th><th scope="col">2</th><th scope="col">1</th><th scope="col">0</th></tr></thead><tbody><tr><td>Respiratory rate</td><td>≤8 or ≥25</td><td>21–24</td><td>9–11</td><td>12–20</td></tr><tr><td>SpO₂ Scale 1</td><td>≤91%</td><td>92–93%</td><td>94–95%</td><td>≥96%</td></tr><tr><td>Supplemental O₂</td><td>—</td><td>Yes</td><td>—</td><td>No (air)</td></tr><tr><td>Systolic BP</td><td>≤90 or ≥220</td><td>91–100</td><td>101–110</td><td>111–219</td></tr><tr><td>Pulse</td><td>≤40 or ≥131</td><td>111–130</td><td>41–50 or 91–110</td><td>51–90</td></tr><tr><td>Consciousness</td><td>V, P, U or new confusion</td><td>—</td><td>—</td><td>Alert</td></tr><tr><td>Temperature</td><td>≤35.0</td><td>≥39.1</td><td>35.1–36.0 or 38.1–39.0</td><td>36.1–38.0</td></tr></tbody></table>';
  }

  // ---------------------------------------------------------------- finishing and results
  function finishWorkbook() {
    const list = questions();
    const missing = list.findIndex(q => !state.checked[q.id]);
    if (missing !== -1) {
      state.current = missing;
      saveState();
      renderWorkbook();
      const n = list.filter(q => !state.checked[q.id]).length;
      showNavMessage(`${n} question${n === 1 ? '' : 's'} still need${n === 1 ? 's' : ''} an answer. You have been taken to the first one.`);
      return;
    }
    state.finished = true;
    state.view = 'questions';
    saveState();
    renderResults();
    showScreen('results');
  }

  function renderResults() {
    const list = questions();
    const correct = list.filter(q => state.checked[q.id] && state.checked[q.id].correct).length;
    updateLabels();
    els.resultScore.textContent = `${correct} / ${list.length}`;
    els.resultMessage.textContent = state.mode === 'challenge'
      ? 'Your Challenge answers are now marked. Review the methods for any you got wrong.'
      : 'Use the feedback below to guide your next revision step.';
    els.resultList.innerHTML = list.map((q, i) => {
      const ok = state.checked[q.id] && state.checked[q.id].correct;
      const retried = state.retry && state.retry.results[q.id] && state.retry.results[q.id].correct;
      return `<li><span>${i + 1}. ${esc(q.title)}</span><span class="${ok ? 'status-good' : 'status-bad'}">${ok ? '✓ Correct' : retried ? '↺ Correct on retry' : '↺ Revisit'}</span></li>`;
    }).join('');
    const wrong = list.filter(q => !(state.checked[q.id] && state.checked[q.id].correct));
    if (wrong.length) {
      els.retryCard.style.display = 'block';
      els.retryHeading.textContent = `Quick retry: ${wrong.length} question${wrong.length === 1 ? '' : 's'} to improve`;
      els.retryText.textContent = 'Try these again with hints and immediate feedback. Your score above will not change.';
      const fixed = state.retry ? wrong.filter(q => state.retry.results[q.id] && state.retry.results[q.id].correct).length : 0;
      els.retryProgress.textContent = state.retry ? `${fixed} of ${wrong.length} now correct on retry.` : '';
    } else {
      els.retryCard.style.display = 'none';
    }
  }

  function startRetry() {
    const wrong = questions().filter(q => !(state.checked[q.id] && state.checked[q.id].correct)).map(q => q.id);
    if (!wrong.length) return;
    const same = state.retry && state.retry.ids.join() === wrong.join();
    if (!same) state.retry = { ids: wrong, index: 0, answers: {}, results: {} };
    state.retry.index = 0;
    state.view = 'retry';
    saveState();
    renderWorkbook();
    showScreen('workbook');
  }

  function startReview() {
    state.view = 'review';
    state.current = 0;
    saveState();
    renderWorkbook();
    showScreen('workbook');
  }

  function backToResults() {
    state.view = 'questions';
    saveState();
    renderResults();
    showScreen('results');
  }

  // ---------------------------------------------------------------- modals and keyboard
  let modalReturnFocus = null;
  function openModal(id) {
    modalReturnFocus = document.activeElement;
    const m = $(id);
    m.classList.add('show');
    setTimeout(() => m.querySelector('.modal-card').focus(), 30);
  }
  function closeModals() {
    document.querySelectorAll('.modal.show').forEach(m => m.classList.remove('show'));
    if (modalReturnFocus && document.body.contains(modalReturnFocus)) modalReturnFocus.focus();
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (document.querySelector('.modal.show')) { closeModals(); return; }
      if (els.sheet.classList.contains('show')) { closeSheet(); return; }
    }
    if (activeTool !== 'calculator' || !els.sheet.classList.contains('show')) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const map = { '*': '×', 'x': '×', 'X': '×', '/': '÷', '-': '−', '+': '+', '^': 'x²' };
    let k = null;
    if (/^[0-9.()]$/.test(e.key)) k = e.key;
    else if (map[e.key]) k = map[e.key];
    else if (e.key === 'Enter' || e.key === '=') k = '=';
    if (k) { e.preventDefault(); calcPress(k); return; }
    if (e.key === 'Backspace') { e.preventDefault(); $('calcBack').click(); }
    if (e.key === 'Delete' || e.key === 'c' || e.key === 'C') { e.preventDefault(); $('calcClear').click(); }
  });

  // ---------------------------------------------------------------- wiring
  buildCards();
  $('aboutButton').addEventListener('click', () => openModal('aboutModal'));
  document.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', closeModals));
  document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModals(); }));
  $('resetBtn').addEventListener('click', () => openModal('resetModal'));
  $('confirmReset').addEventListener('click', () => { clearState(); closeModals(); updateWorkbookCards(); showScreen('choice'); });

  els.understand.checked = !!store.get(ACCEPT_KEY);
  els.choose.disabled = !els.understand.checked;
  els.understand.addEventListener('change', () => { store.set(ACCEPT_KEY, els.understand.checked); els.choose.disabled = !els.understand.checked; });
  els.choose.addEventListener('click', () => { updateWorkbookCards(); showScreen('choice'); });
  $('backToWelcomeFromWorkbooks').addEventListener('click', () => showScreen('welcome'));
  $('backToWorkbooks').addEventListener('click', () => { updateWorkbookCards(); showScreen('choice'); });
  document.querySelectorAll('.mode-card').forEach(b => b.addEventListener('click', () => startMode(b.dataset.mode)));
  $('leaveWorkbook').addEventListener('click', () => {
    saveInputs();
    if (inRetry() || inReview()) { backToResults(); return; }
    saveState(); renderModeScreen(); showScreen('mode');
  });
  els.previous.addEventListener('click', () => { const i = currentIndex(); if (i > 0) { setIndex(i - 1); saveState(); renderWorkbook(); } });
  els.next.addEventListener('click', () => {
    const i = currentIndex();
    if (i === visibleQuestions().length - 1) {
      if (inRetry() || inReview()) backToResults(); else finishWorkbook();
    } else { setIndex(i + 1); saveState(); renderWorkbook(); }
  });
  $('closeSheet').addEventListener('click', closeSheet);
  els.backdrop.addEventListener('click', closeSheet);
  $('resultsHome').addEventListener('click', () => { updateWorkbookCards(); showScreen('choice'); });
  $('repeatBtn').addEventListener('click', () => { state = Object.assign(emptyState(), { mode: state.mode }); saveState(); renderModeScreen(); showScreen('mode'); });
  $('quickRetryBtn').addEventListener('click', startRetry);
  $('reviewBtn').addEventListener('click', startReview);
  updateWorkbookCards();

})();
