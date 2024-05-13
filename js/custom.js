$(document).ready(function () {
  // Listen for clicks on elements that toggle modals
  $('[data-toggle="modal"]').click(function () {
    var $trigger = $(this);
    var targetModalId = $trigger.data("target"); // e.g., #live-call-translator
    var $modal = $(targetModalId);

    // Only load content if it hasn't been loaded yet
    if (!$modal.data("loaded")) {
      var contentUrl = `${targetModalId.replace("#", "")}.html`;

      // Fetch the modal content and load it into the modal's .modal-content div
      $.get(contentUrl, function (html) {
        console.log(`Loaded modal content from ${html}`);
        $modal.find(".modal-content").html(html);
        $modal.data("loaded", true); // Mark as loaded
      }).fail(function () {
        console.error("Failed to load modal content.");
      });
    }
  });
});
