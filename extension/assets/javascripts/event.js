chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.pageAction.show(tabId);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.pageAction.show(activeInfo.tabId);
});