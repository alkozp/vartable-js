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
        //frame.style.height = frame.contentWindow.document.body.scrollHeight + 'px';
        
        //console.log(frame.contentWindow.document.body.height);
    }
}

function openExample(event) {
    //const selectedRow = event.target.closest('tr')
    const selectedRowId = event.target.closest('tr').id;
    const rowNumber = selectedRowId.split(/(\d)/)[1];
    const currentExample = document.getElementById('example-row'+rowNumber);
    const currentFrame = document.getElementById('codeviewer'+rowNumber);

    //console.log(currentExample.style.visibility);

    //collapse all examples exclude current 
    const exampleRowList = document.querySelectorAll('tr[id^="example-row"]');
    for (const row of exampleRowList) {
        if (row.style.visibility === 'visible' && row.id !== currentExample.id) {
            row.style.transition = '0.5s';
            row.style.opacity = 0;
            row.style.visibility = 'collapse';
        }
    }

    //toggle current example state
    if (currentExample.style.visibility === 'collapse' || currentExample.style.visibility === ''){
        currentExample.style.transition = '0.5s';
        currentExample.style.opacity = 1;
        currentExample.style.visibility = 'visible';
        currentFrame.style.height = currentFrame.contentWindow.document.body.height+'px';
    } else {
        currentExample.style.transition = '0.5s';
        currentExample.style.opacity = 0;
        currentExample.style.visibility = 'collapse';
    }  

    // console.log(1, event);
    // console.log(event.target);
    // console.log(currentExample);
    // console.log(selectedRowId);
    // console.log(selectedRow.nextElementSibling.id);
}


// create iframes content after loading page
window.onload = createExamples();

//
tableVars = document.querySelector('table');        
tableVars.addEventListener("click", openExample)