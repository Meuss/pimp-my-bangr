function apply(enabled) {
  if (enabled) {
    document.documentElement.setAttribute('data-pmb', 'on');
  } else {
    document.documentElement.removeAttribute('data-pmb');
  }
}

chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  apply(enabled);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    apply(changes.enabled.newValue);
  }
});
