async function getTemplate(snippet) {
    let promise = new Promise(resolve => {
        chrome.storage.sync.get(snippet, res => {
            resolve(res[snippet]);
        });
    });
    return await promise;
}

//returns true if snippet replaced, false otherwise
async function replaceContentEditable() {
    var selection = document.getSelection();
    var node = selection.focusNode;
    if (!node || !node.parentElement.isContentEditable) return false;
    while (node.hasChildNodes()) { 
        node = node.firstChild;
    }

    var range = new Range();
    range.setStart(node, 0); //dummy word start
    range.setEnd(selection.focusNode, selection.focusOffset);
    var trueWordStart = Math.max(range.toString().lastIndexOf(" "), 
                                range.toString().lastIndexOf("\n")) + 1;
    range.setStart(node, trueWordStart); 

    console.log("search snippet: " + range.toString());
    var template = await getTemplate(range.toString());
    if (!template) { 
        console.log("nothing found");
        return false;
    }
    console.log("found template: " + template);

    range.deleteContents();
    var fragment = new DocumentFragment();
    var lines = template.split("\n");
    for (let i = 0; i < lines.length-1; i++) {
      fragment.appendChild(document.createTextNode(lines[i]));
      fragment.appendChild(document.createElement("br"));
    }
    fragment.appendChild(document.createTextNode(lines[lines.length-1]));
    node.parentElement.style["white-space"] = "pre-wrap"; //otherwise spaces in the end of line can dissapear
    range.insertNode(fragment);
    node.parentNode.normalize(); //unite text nodes

    range.collapse(); 
    selection.empty();
    selection.addRange(range);
    return true;
}    

//returns true if snippet replaced, false otherwise
async function replaceInputAndTextarea(input) {
    if(!(input.value) || !(input.selectionEnd) || input.readOnly || input.disabled) 
        return false;

    var word = input.value.substring(0, input.selectionEnd)
    var wordStart = Math.max(word.lastIndexOf(" "), word.lastIndexOf("\n")) + 1;
    word = word.substring(wordStart);

    console.log("search snippet: " + word);
    var template = await getTemplate(word);
    if (!template) { 
        console.log("nothing found");
        return false;
    }
    console.log("found template: " + template);
    input.value = input.value.substring(0, wordStart) 
                + template
                + input.value.substring(input.selectionEnd);

    input.setSelectionRange(wordStart + template.length, wordStart + template.length);
    input.focus();  
    return true;
}

Mousetrap.bindGlobal("tab", event => {
    if (event.__templateChecked) return;
    let newEvent = new KeyboardEvent(event.type, event);
    newEvent.__templateChecked = true;

    //cancel this event, dispatch new, if nothing replaced
    event.preventDefault();
    event.stopPropagation();
    
    replaceContentEditable()
        .then(isReplaced => {return isReplaced || replaceInputAndTextarea(event.target)})
        .then(isReplaced => {if (!isReplaced) event.target.dispatchEvent(newEvent)});
});