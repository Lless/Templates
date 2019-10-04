function getTemplate(snippet) {
    if (snippet == "such") return "wow";
    return null;
}

//returns true if snippet replaced, false otherwise
function replaceContentEditable() {
    var node = document.getSelection().focusNode;
    if (!node || !node.parentElement.isContentEditable) return false;
    
    var wordRange = new Range();
    wordRange.setStart(node, 0); //dummy word start
    wordRange.setEnd(node, document.getSelection().focusOffset);

    var trueWordStart = Math.max(wordRange.toString().lastIndexOf(" "), 
                                wordRange.toString().lastIndexOf("\n")) + 1;
    wordRange.setStart(node, trueWordStart);
    console.log(wordRange.toString());

    var template = getTemplate(wordRange.toString());
    if (!template) return false;
    wordRange.deleteContents();
    wordRange.insertNode(document.createTextNode(template));
    node.normalize();
    return true;
}    

//returns true if snippet replaced, false otherwise
function replaceInputAndTextarea(input) {
    if(!(input.value) || !(input.selectionEnd) || input.readOnly || input.disabled) {
        console.log("not input");
        return false;
    }

    var word = input.value.substring(0, input.selectionEnd)
    var wordStart = Math.max(word.lastIndexOf(" "), word.lastIndexOf("\n")) + 1;
    word = word.substring(wordStart);
    var template = getTemplate(word);
    console.log(word);

    if (!template) return false;
    input.value = input.value.substring(0, wordStart) 
                + getTemplate(word) 
                + input.value.substring(input.selectionEnd);
    return true;
}

Mousetrap.bindGlobal("tab", event => {
    if (replaceContentEditable() || replaceInputAndTextarea(event.target)) {
        event.preventDefault();
        event.stopPropagation();
    }
});