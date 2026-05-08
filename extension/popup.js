const toggle = document.getElementById('toggle');
const status = document.getElementById('status');

function updateUI(enabled) {
  toggle.checked = enabled;
  status.textContent = enabled ? 'Enabled' : 'Disabled';
  status.classList.toggle('off', !enabled);
}

chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
  if (response) updateUI(response.enabled);
});

toggle.addEventListener('change', () => {
  chrome.runtime.sendMessage({ action: 'toggle' }, (response) => {
    if (response) updateUI(response.enabled);
  });
});
