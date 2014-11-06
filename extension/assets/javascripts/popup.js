function restoreBookmark(bookmark, callback) {
  chrome.bookmarks.search({ url: bookmark.url }, function(results) {
    callback(_.isEmpty(results) ? bookmark : _.first(results));
  });
}

function removeBookmark() {
  chrome.bookmarks.remove($('#id').val());
}

function saveBookmark() {
  var bookmark = {
    id: $('#id').val(),
    title: $('#title').val(),
    url: $('#url').val(),
    parentId: $('#parentId').val()
  };

  if (bookmark.id) {
    // Update bookmark
    var changes = _.pick(bookmark, 'title', 'url');
    var moves   = _.pick(bookmark, 'parentId');

    chrome.bookmarks.update(bookmark.id, changes);
    chrome.bookmarks.move(bookmark.id, moves);
  } else {
    // Create bookmark
    var creation = _.omit(bookmark, 'id');

    chrome.bookmarks.create(creation, function(result) {
      // Update bookmark id in the page.
      $('#id').val(result.id);
    });
  }
}

$(function() {
  function initEventBinding() {
    $('#save').click(function() {
      saveBookmark();
      window.close();
    });

    $('#remove').click(function() {
      removeBookmark();
      window.close();
    });
  }

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
      node.folder = true;
      node.render();

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

        chrome.bookmarks.getFolderTree(function(folderTree) {
          initFolderTree(folderTree, (bookmark.parentId || folderTree[0].id));
          initEventBinding();

          // Save bookmark automatically
          saveBookmark();
        });
      });
    });

  });
});