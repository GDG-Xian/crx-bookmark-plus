function restoreBookmark(bookmark, callback) {
  chrome.bookmarks.search({ url: bookmark.url }, function(results) {
    callback(_.isEmpty(results) ? bookmark : _.first(results));
  });
}

$(function() {

  function initFolderTree(folderTree, folderId) {
    var $tree = $('#tree').fancytree({
      extensions: ['filter'],
      filter: { mode: "hide" },
      source: folderTree,
      activate: function(event, data){
        var node = data.node;
        $('#parentId').val(node.data.id);
      },
    });

    var tree = $tree.fancytree('getTree');

    // Auto select and expand selected folder.
    tree.visit(function(node) {
      if (node.data.id == folderId) {
        node.setActive(true);
        node.makeVisible();
      }
    });

    $('#filter').on('input', function() {
      var keyword = $.trim($(this).val()).toLowerCase();
      if (keyword) {
        tree.filterNodes(function(node) {
          return node.title.toLowerCase().indexOf(keyword) != -1;
        }, false);

        tree.visit(function(node){
          node.setExpanded(true);
        });
      } else {
        tree.clearFilter();      
      }
    });

  }

  chrome.runtime.getBackgroundPage(function(application) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      restoreBookmark({ title: tabs[0].title, url: tabs[0].url }, function(bookmark) {
        $('#title').val(bookmark.title);
        $('#url').val(bookmark.url);
        $('#id').val(bookmark.id);

        application.getFolderTree(function(folderTree) {
          initFolderTree(folderTree, bookmark.parentId);
        });
      });
    });

  });
});