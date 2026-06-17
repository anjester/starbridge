// navigation.js — StarBridge routing & exit alert
// Dipende da: game.js (initGame, state, mode, tid, GAME_MODES, spTick)

const SCREENS = {
  home:    'screenHome',
  modes:   'screenModes',
  play:    'screenPlay',
  rank:    'screenRank',
  mondo:   'screenMondo',
  profile: 'screenProfile',
};

let currentTab = 'home';
let _pendingTab = null;

function goTo(tab) {
  if (currentTab === 'play' && tab !== 'play' &&
      typeof state !== 'undefined' && state === 'playing') {
    _pendingTab = tab;
    showExitAlert();
    return;
  }
  _navigateTo(tab);
}

function _navigateTo(tab) {
  Object.values(SCREENS).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const target = document.getElementById(SCREENS[tab]);
  if (target) {
    target.classList.remove('hidden');
    const sc = target.querySelector('[style*="overflow-y"]');
    if (sc) sc.scrollTop = 0;
  }
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (tab === 'modes') { setTimeout(initAnimCards, 50); }
  const _navMap = { home:'home', rank:'rank', play:'play', modes:'play', mondo:'mondo', profile:'profile' };
  const navTab = _navMap[tab] || 'home';
  const btn = document.getElementById('btn-' + navTab);
  if (btn) btn.classList.add('active');
  currentTab = tab;
  if (tab === 'play' && typeof initGame === 'function') initGame();
}

function startMode(m) {
  window._startMode = m;
  _navigateTo('play');
}

function showExitAlert() {
  const al = document.getElementById('exitAlert');
  if (al) al.style.display = 'flex';
  if (typeof tid !== 'undefined' && tid) clearInterval(tid);
}

function closeExitAlert() {
  const al = document.getElementById('exitAlert');
  if (al) al.style.display = 'none';
  _pendingTab = null;
  if (typeof state !== 'undefined' && state === 'playing' && typeof GAME_MODES !== 'undefined') {
    const m = GAME_MODES[typeof mode !== 'undefined' ? mode : 'timed'];
    if (m && m.timed && typeof spTick === 'function') {
      if (typeof tid !== 'undefined') clearInterval(tid);
      tid = setInterval(spTick, 1000);
    }
  }
}

function confirmExit() {
  const al = document.getElementById('exitAlert');
  if (al) al.style.display = 'none';
  if (typeof tid !== 'undefined') clearInterval(tid);
  const dest = _pendingTab || 'home';
  _pendingTab = null;
  _navigateTo(dest);
}
