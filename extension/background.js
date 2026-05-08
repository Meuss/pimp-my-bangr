chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggle') {
    chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
      const newState = !enabled;
      chrome.storage.local.set({ enabled: newState });
      sendResponse({ enabled: newState });
    });
    return true;
  }

  if (message.action === 'getState') {
    chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
      sendResponse({ enabled });
    });
    return true;
  }
});
