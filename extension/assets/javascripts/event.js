function showPageIcon(tab) {
  chrome.bookmarks.search(tab.url, function(results) {
    var details = { tabId: tab.id };
    if (results.length) {
      details.path = 'assets/images/icon_128.png';
    } else {
      details.path = 'assets/images/icon_128_gray.png';
    }

    chrome.pageAction.setIcon(details)
    chrome.pageAction.show(tab.id);
  });
}

function updateActiveTabIcon() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { showPageIcon(tabs[0]);
  });
}

chrome.tabs.onUpdated.addListener(updateActiveTabIcon);
chrome.tabs.onActivated.addListener(updateActiveTabIcon);
chrome.bookmarks.onCreated.addListener(updateActiveTabIcon);
chrome.bookmarks.onRemoved.addListener(updateActiveTabIcon);
