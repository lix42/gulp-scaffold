(function(window, document, undefined) {
    function addMoreContent() {
        var mainContent = document.getElementById("main-content");
        if (mainContent) {
            var content = mainContent.innerText;
            mainContent.innerText += content;
        }
    }
    document.getElementById("action").addEventListener("click", addMoreContent);
})(window, document);
