$(function() {
  function initFolderTree(folderTree) {
    var $tree, tree;

    $tree = $('#tree').fancytree({
      extensions: ['filter'],
      filter: { mode: "hide" },
      source: folderTree
    });

    tree = $tree.fancytree('getTree');

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
    application.getFolderTree(initFolderTree);
  });
});