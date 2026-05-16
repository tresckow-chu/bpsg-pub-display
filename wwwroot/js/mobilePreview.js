window.mobilePreview = {
    set: function (enabled) {
        if (enabled) {
            document.body.classList.add("mobile-preview");
        } else {
            document.body.classList.remove("mobile-preview");
        }
    }
};