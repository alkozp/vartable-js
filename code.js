function createFrameContent(exampleContent) {

    let docFrame = `
    <head>
        <link href="https://unpkg.com/prismjs@1.29.0/themes/prism-tomorrow.css" rel="stylesheet" />
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

function createExamples() {

    const examplesList = document.querySelectorAll('iframe[id^="codeviewer"]');

    for (const frame of examplesList) {
        const frameNumber = frame.id.split(/(\d)/)[1];
        const currentExample = document.getElementById('example'+frameNumber);
        const docFrame = createFrameContent(currentExample);
        frame.srcdoc = docFrame;
    }
}

//set row visibility
function visibilityRow(currentRow, state) {
    if (state === 'collapse') {
        currentRow.style.transition = '0.2s';
        currentRow.style.opacity = 0;
        currentRow.style.visibility = 'collapse';
    } else if (state === 'visible') {
        currentRow.style.transition = '0.7s';
        currentRow.style.opacity = 1;
        currentRow.style.visibility = 'visible';
    }
}

function openExample(event) {
    //const selectedRow = event.target.closest('tr')
    const selectedRowId = event.target.closest('tr').id;
    const rowNumber = selectedRowId.split(/(\d)/)[1];
    const currentExample = document.getElementById('example-row'+rowNumber);

    //collapse all examples exclude current 
    const exampleRowList = document.querySelectorAll('tr[id^="example-row"]');
    for (const row of exampleRowList) {
        if (row.style.visibility === 'visible' && row.id !== currentExample.id) {
            visibilityRow(row, "collapse");
        }
    }

    //toggle current example state
    if (currentExample.style.visibility === 'collapse' || currentExample.style.visibility === ''){
        visibilityRow(currentExample, 'visible')
    } else {
        visibilityRow(currentExample, 'collapse')
    }  
}


// create iframes content after loading page
window.onload = createExamples();

//
const tableVars = document.querySelector('table');        
tableVars.addEventListener("click", openExample)