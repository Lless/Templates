function getTemplateNode(snippet) {
    return document.createTextNode("Wow");
}

function replaceHandler(event) {
    var node = document.getSelection().focusNode;
    if (!node || !node.parentElement.isContentEditable) return;
    
    var wordRange = new Range();
    wordRange.setStart(node, 0); //dummy word start
    wordRange.setEnd(node, document.getSelection().focusOffset);

    var trueWordStart = Math.max(wordRange.toString().lastIndexOf(" "), 
                                wordRange.toString().lastIndexOf("\n")) + 1;
    wordRange.setStart(node, trueWordStart);
    console.log(wordRange.toString());

    var template = getTemplateNode(wordRange.toString());
    if (!template) return;
    wordRange.deleteContents();
    wordRange.insertNode(template);
    template.parentNode.normalize();

    event.preventDefault();
    event.stopPropagation();
}

Mousetrap.bindGlobal("tab", replaceHandler);