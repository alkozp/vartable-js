
//https://unpkg.com/prismjs@1.29.0/themes/prism-coy.css

//create content for iframe
function createFrameContent(exampleContent, highlightTheme) {

    let docFrame = `
    <head>
        <link href="https://unpkg.com/prismjs@1.29.0/themes/${highlightTheme}.css" rel="stylesheet" />
    </head>
    <body style="padding:0; margin:0">
    `;
    
    docFrame += `<pre><code class="language-javascript"> ${exampleContent.innerHTML} </code></pre>`;
    docFrame += `
    <script src="https://unpkg.com/prismjs@1.29.0/components/prism-core.min.js"></sc`+`ript>
    <script src="https://unpkg.com/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></sc`+`ript>
    `;

    return docFrame;
}


//resize iframe height for content
function resizeFrameHeight(frame) {
    frame.style.height = frame.contentWindow.document.documentElement.scrollHeight + 'px';
}



//create iframes content
function createExamples() {
    const examplesList = document.querySelectorAll('iframe[id^="codeviewer"]');

    const optionsHighlight = document.getElementById('highlight');
    const selectedTheme = optionsHighlight[optionsHighlight.selectedIndex].value;

    for (const frame of examplesList) {
        const frameNumber = frame.id.split(/(\d)/)[1];
        const currentExample = document.getElementById('example'+frameNumber);

        const docFrame = createFrameContent(currentExample, selectedTheme);
        frame.onload = ()=>{
            return resizeFrameHeight(frame);
        };
        frame.srcdoc = docFrame;
    }
}



//set row visibility
function visibilityRow(currentRow, state) {
    if (state === 'collapse') {
        currentRow.style.transition = 'all 0.2s';
        currentRow.style.opacity = 0;
        currentRow.style.visibility = 'collapse';
    } else if (state === 'visible') {
        currentRow.style.transition = 'all 0.7s';
        currentRow.style.opacity = 1;
        currentRow.style.visibility = 'visible';
    }
}



function switchExampleState(event) {
    let selectedRowId;
    try {
        selectedRowId = event.target.closest('tr').id;
    }
    catch {
        selectedRowId = false;
    }
    // if click on table caption
    if (!selectedRowId){
        return false;
    }

    const rowNumber = selectedRowId.split(/(\d)/)[1];
    const currentExample = document.getElementById('example-row'+rowNumber);


    //collapse all examples exclude current 
    const exampleRowList = document.querySelectorAll('tr[id^="example-row"]');
    for (const row of exampleRowList) {
        if (row.style.visibility === 'visible' && row.id !== currentExample.id) {
            visibilityRow(row, "collapse");
        }
    }

    //switch current example state
    if (currentExample.style.visibility === 'collapse' || currentExample.style.visibility === ''){
        visibilityRow(currentExample, 'visible')
    } else {
        visibilityRow(currentExample, 'collapse')
    }  
}




// start create iframes content after loading page
window.onload = createExamples();

const tableVars = document.querySelector('table');        
tableVars.addEventListener("click", switchExampleState);

const optionsHighlight = document.getElementById('highlight');
optionsHighlight.addEventListener("change", createExamples)