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

  // public methods:

  chrome.bookmarks.getFolderTree = function(callback) {
    chrome.bookmarks.getTree(function(tree) {
      callback(toFolderTree(tree[0].children));
    });
  };

  chrome.bookmarks.getRecentFolders = function(max_count, callback) {
    chrome.bookmarks.getRecent(100, function(results) {
      var folderIds = _.chain(results).pluck('parentId').uniq().value();
      chrome.bookmarks.get(folderIds, function(folders) {
        var recents = _.chain(folders)
                       .sortBy('dateGroupModified')
                       .last(max_count)
                       .value();
        callback(recents.reverse());
      });
    });
  };
})();