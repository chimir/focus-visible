/* https://github.com/alice/modality */
document.addEventListener("DOMContentLoaded", function() {
    var hadKeyboardEvent = false,
        keyboardModalityWhitelist = [ "input:not([type])",
                                      "input[type=text]",
                                      "input[type=number]",
                                      "input[type=date]",
                                      "input[type=time]",
                                      "input[type=datetime]",
                                      "textarea",
                                      "[role=textbox]",
                                      "[supports-modality=keyboard]"].join(","),
        matcher = (function () {
			var el = document.body;
			if (el.matchesSelector)
				return el.matchesSelector;
			if (el.webkitMatchesSelector)
				return el.webkitMatchesSelector;
			if (el.mozMatchesSelector)
				return el.mozMatchesSelector;
			if (el.msMatchesSelector)
				return el.msMatchesSelector;
			console.error("Couldn't find any matchesSelector method on document.body.");
		}()),
        disableFocusRingByDefault = function () {
			var css = "body:not([modality=keyboard]) :focus { outline: none; }",
				head = document.head || document.getElementsByTagName("head")[0],
				style = document.createElement("style");

			style.type = "text/css";
			style.id = "disable-focus-ring";
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			head.insertBefore(style, head.firstChild);
		},
		focusTriggersKeyboardModality = function (el) {
			return matcher.call(el, keyboardModalityWhitelist);
		};

    disableFocusRingByDefault();

    document.body.addEventListener("keydown", function() {
        hadKeyboardEvent = true;
        setTimeout(function() { hadKeyboardEvent = false; }, 0);
    }, true);

    document.body.addEventListener("focus", function(e) {
        if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target))
            document.body.setAttribute("modality", "keyboard");
    }, true);

    document.body.addEventListener("blur", function() {
        document.body.removeAttribute("modality");
    }, true);
});
