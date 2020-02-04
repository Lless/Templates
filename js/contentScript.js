async function getTemplate(snippet) {
    console.log("search snippet: " + snippet);
    let promise = new Promise(resolve => {
        chrome.storage.sync.get(snippet, res => {
            if (res[snippet]) console.log("found template: " + res[snippet]);
            else console.log("nothing found");
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

    let template = await getTemplate(execResult[2]);
    if (!template) return false;

    let range = new Range();
    range.setStart(node, execResult.index + (execResult[1] == "" ? 0 : 1));
    range.setEnd(node, caretPosition);
    selection.empty();
    selection.addRange(range);
    document.execCommand("insertText", false, template);
    return true;    
}   

//returns true if snippet replaced, false otherwise
async function tryReplaceInputAndTextarea(input) {
    if(!(input.value) || !(input.selectionEnd) || input.readOnly || input.disabled) 
        return false;

    var word = input.value.substring(0, input.selectionEnd)
    var wordStart = Math.max(word.lastIndexOf(" "), word.lastIndexOf("\n")) + 1;
    word = word.substring(wordStart);

    var template = await getTemplate(word);
    if (!template) return false;

    input.setSelectionRange(wordStart, input.selectionEnd);
    document.execCommand("insertText", false, template);
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