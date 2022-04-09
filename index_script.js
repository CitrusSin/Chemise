var b = document.getElementById("body");
var chemInput = document.getElementById("chemInput");
var inputDisplay = document.getElementById("inputDisplay");
var updateInput = false;
var inputInnerText = ""

function convertToTex(chemicalFormulaStr) {
    if (chemicalFormulaStr.match(/=+/)) {
        let chems = chemicalFormulaStr.split(/=+/);
        let totalResult = [];
        chems.forEach(element => {
            totalResult.push(convertToTex(element));
        });
        return totalResult.join(" $===$ ");
    } else {
        let chems = chemicalFormulaStr.split("+");
        let result = [];
        chems.forEach(element => {
            let replaced = element.replace(/([A-Z][a-z]*)(\d+)?(\^\d*[-*])?/g, function(_, elementName, drCount, urCharge) {
                let str = elementName;
                if (drCount != undefined) {
                    str += "_{" + drCount + "}";
                }
                if (urCharge != undefined) {
                    str += urCharge.replace(/\^(\d*)([-*])/, "^{$1$2}").replace("*", "+");
                }
                return str;
            }).replace(/^\d+/, "\\color{red}{$&}");
            replaced = replaced.replace(/\)(\d+)/g, ")_{$1}");
            if (replaced.length > 0) {
                result.push("$" + replaced + "$");
            }
        });
        return result.join(" $+$ ");
    }
}

b.setAttribute("style", "background-size: " + window.screen.availWidth + "px " + window.screen.availHeight + "px;");
chemInput.oninput = function(e) {
    inputInnerText = convertToTex(chemInput.value)
    updateInput = true;
}

setInterval(function() {
    if (updateInput) {
        inputDisplay.innerText = inputInnerText;
        if (inputInnerText != "") {
            window.MathJax.Hub.Queue(["Typeset", MathJax.Hub, inputDisplay]);
        }
        updateInput = false;
    }
}, 1000)

function processStart() {
    document.getElementById("showdiv").hidden = false;
    var output = document.getElementById("output");
    var warning = document.getElementById("warning");
    try {
        var balanced = balance(document.getElementById("chemInput").value);
        output.style.color = "black";
        output.innerText = "结果\n" + convertToTex(balanced);
        window.MathJax.Hub.Queue(["Typeset", MathJax.Hub, output])
        warning.hidden = true;
    } catch (err) {
        warning.hidden = false;
        output.style.color = "red";
        output.innerText = err;
    }
}

