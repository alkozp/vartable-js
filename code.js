

//create content for iframe
function createFrameContent(exampleContent, highlightTheme, highlighter = 'prism' ) {

    let docFrame = '';
    
    const prismHeader =`
    <head>
        <link href="https://unpkg.com/prismjs@1.29.0/themes/${highlightTheme}.css" rel="stylesheet" />
        <script src="https://unpkg.com/prismjs@1.29.0/components/prism-core.min.js"></sc`+`ript>
        <script src="https://unpkg.com/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></sc`+`ript>
    `;
    
    const hTheme = highlightTheme.split ('highlight-')[1];

    const highlightHeader = `
    <head>
        <link href="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/${hTheme}.min.css" rel="stylesheet" />
        <script src="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.js"></sc`+`ript>
        <script>hljs.highlightAll();</scr`+`ipt>
    `;
    
    if (highlighter === 'prism') {
        docFrame += prismHeader;
    } else if (highlighter === 'highlight') {
        docFrame += highlightHeader; 
    }

    docFrame += `
        <style>
            html{
                font-size: 1rem;
            }
            .console{
                font-family: monospace;
                background-color: darkslategray;
                padding: 0.2rem;
                font-size: 0.8rem;
            }
            .console>span {
                color: lightgray;
            }
            .output {
                border-top: 1px solid gray;
                margin-top: 0.5rem;
            }
            .result{
                color: lime;
                padding: 0.2rem;
            }
            .error {
                color: red;
                padding: 0.2rem;
            }
        </style>
    </head>
    <body style="padding:0; margin:0">
    `;
    
    docFrame += `<pre><code class="language-javascript"> ${exampleContent} </code></pre>`;
  
    //add code runner and console output
    const output = `<div class='console'><span>Console output:<span><div class='output'></div></div>`;
    
    const codeRunner = `
    <script>
        const out = document.querySelector('.output'); 
        console.log = function (...args) {
            const logString = args.join(' ');
            out.innerHTML+= '<div class="result">&gt;&gt; '+logString+'</div>';
        };
        try{
            eval(\`${exampleContent}\`);
        } catch (error) {
            out.innerHTML+= '<div class="error">&gt;&gt; '+error+'</div>';
        }
    </scr`+`ipt>
    `;


    docFrame += output;
    docFrame += codeRunner;
    return docFrame;
}


//resize iframe height for content
function resizeFrameHeight(frame) {
    frame.style.height = frame.contentWindow.document.documentElement.scrollHeight + 'px';
}

async function getExamplesFromJSON (fileJSON) {

    let response;
    try{
        response = await fetch(fileJSON);
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.warn(error);
    }
}

//create iframes content
async function createExamples() {
    const examplesList = document.querySelectorAll('iframe[id^="codeviewer"]');

    const optionsHighlight = document.getElementById('highlight');
    const selectedTheme = optionsHighlight[optionsHighlight.selectedIndex].value;
    const highlighter = selectedTheme.split('-')[0];

    const examplesFromJSON = await getExamplesFromJSON('./examples.json');

    for (const frame of examplesList) {
        const frameNumber = frame.id.split(/(\d)/)[1];
        const currentExample = examplesFromJSON.examples[frameNumber-1];
        const docFrame = createFrameContent(currentExample.code, selectedTheme, highlighter);
        frame.style.height = 0;
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