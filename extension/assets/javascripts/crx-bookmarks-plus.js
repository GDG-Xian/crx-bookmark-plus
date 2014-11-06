/**
 * crx-bookmarks-plus.js
 * 
 * Functions:
 *  - getFolderTree
 *
 * Dependencies:
 *  - underscore.js
 */

(function() {
  function toFolderTree(tree) {
    var folderTree = []

    folderTree = _.filter(tree, function(node) {
      return !node.url && _.isArray(node.children);
    });

    folderTree = _.map(folderTree, function(node) {
      var children = toFolderTree(node.children);

      return _.extend(node, { children: children });
    });

    return folderTree;
  }

  chrome.bookmarks.getFolderTree = function(callback) {
    chrome.bookmarks.getTree(function(tree) {
      callback(toFolderTree(tree[0].children));
    });
  };
})();