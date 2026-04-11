(function () {
  try {
    var t = localStorage.getItem('gcss-theme');
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) { /* no-op */ }
})();
