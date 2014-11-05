function toFolderTree(tree) {
  var folderTree = []

  folderTree = _.filter(tree, function(node) {
    return !node.url && _.isArray(node.children);
  });

  folderTree = _.map(folderTree, function(node) {
    return {
      id: node.id,
      title: node.title,
      folder: true,
      children: toFolderTree(node.children)
    };
  });

  return folderTree;
}

function getFolderTree(callback) {
  chrome.bookmarks.getTree(function(tree) {
    callback(toFolderTree(tree[0].children));
  });
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.pageAction.show(tabId);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.pageAction.show(activeInfo.tabId);
});