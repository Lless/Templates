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
    var node = document.getSelection().focusNode;
    if (!node || !node.parentElement.isContentEditable) return false;
    
    var wordRange = new Range();
    wordRange.setStart(node, 0); //dummy word start
    wordRange.setEnd(node, document.getSelection().focusOffset);

    var trueWordStart = Math.max(wordRange.toString().lastIndexOf(" "), 
                                wordRange.toString().lastIndexOf("\n")) + 1;
    wordRange.setStart(node, trueWordStart);
    console.log("found snippet: " + wordRange.toString());

    var template = await getTemplate(wordRange.toString());
    console.log("found template: " + template);
    if (!template) return false;
    wordRange.deleteContents();
    wordRange.insertNode(document.createTextNode(template));
    node.normalize();
    return true;
}    

//returns true if snippet replaced, false otherwise
async function replaceInputAndTextarea(input) {
    if(!(input.value) || !(input.selectionEnd) || input.readOnly || input.disabled) 
        return false;

    var word = input.value.substring(0, input.selectionEnd)
    var wordStart = Math.max(word.lastIndexOf(" "), word.lastIndexOf("\n")) + 1;
    word = word.substring(wordStart);
    console.log("found snippet: " + word);

    var template = await getTemplate(word);
    console.log("found template: " + template);
    if (!template) return false;
    input.value = input.value.substring(0, wordStart) 
                + template
                + input.value.substring(input.selectionEnd);
    return true;
}

Mousetrap.bindGlobal("tab", async event => {
    if ((await replaceContentEditable()) || (await replaceInputAndTextarea(event.target))) {
        event.preventDefault();
        event.stopPropagation();
    }
});