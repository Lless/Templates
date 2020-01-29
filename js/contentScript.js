async function getTemplate(snippet) {
    let promise = new Promise(resolve => {
        chrome.storage.sync.get(snippet, res => {
            resolve(res[snippet]);
        });
    });
    return await promise;
}

//returns true if snippet replaced, false otherwise
async function tryReplaceContentEditable(node) {
    if (!node || !node.isContentEditable) return false;
    node.style["white-space"] = "pre-wrap"; //otherwise spaces in the end of line can dissapear

    let selection = document.getSelection();
    node = selection.focusNode;
    let caretPosition = selection.focusOffset;
    let execResult = /(\s|^)(\S*)$/.exec(node.textContent.substring(0, caretPosition));

    console.log("search snippet: " + execResult[2]);
    let template = await getTemplate(execResult[2]);
    if (!template) { 
        console.log("nothing found");
        return false;
    }
    console.log("found template: " + template);

    let fragment = new DocumentFragment();
    let lines = template.split("\n");
    for (let i = 0; i < lines.length-1; i++) {
      fragment.appendChild(document.createTextNode(lines[i]));
      fragment.appendChild(document.createElement("br"));
    }
    fragment.appendChild(document.createTextNode(lines[lines.length-1]));

    let range = new Range();
    range.setStart(node, execResult.index + (execResult[1] == "" ? 0 : 1));
    range.setEnd(node, caretPosition);
    range.deleteContents();
    range.insertNode(fragment);
    node.parentNode.normalize(); //unite text nodes

    range.collapse(); 
    selection.empty();
    selection.addRange(range);
    return true;
}    

//returns true if snippet replaced, false otherwise
async function tryReplaceInputAndTextarea(input) {
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
    
    tryReplaceContentEditable(event.target)
        .then(isReplaced => {return isReplaced || tryReplaceInputAndTextarea(event.target)})
        .then(isReplaced => {if (!isReplaced) event.target.dispatchEvent(newEvent)});
});

console.log("Mousetrap binded");