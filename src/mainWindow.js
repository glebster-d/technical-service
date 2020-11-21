
const electron = require('electron');
const { ipcRenderer } = electron;
window.$ = window.jQuery = require('jquery');


const tbody = document.querySelector('tbody');

// Add item
ipcRenderer.on('item:add', (e, item) => {
    console.log("Item from main window");
    console.log(item);

    var workStatusArr = ['בביצוע','הצעת מחיר ','בהשהיה', 'בביצוע אצל גורם חוץ', 'בוטל', 'הסתיים'];

    const tr = document.createElement('tr');

    for (const [key, value] of Object.entries(item)) {
        
        const td = document.createElement('td');

        // if ( key != "workDescription") {
        //     td.classList.add("centered-field");
        // }      
        // if (key != "workStatus") {
        //     var sel = document.createElement('select');
            
        //     for (var index = 0; index < 7; index++) {
        //         var opt = document.createElement('option');
        //         opt.value = index;
        //         opt.appendChild(createTextNode(workStatusArr[index]));
        //     }
        //     td.appendChild(sel);             
        // }
        // // td.appendChild(document.createTextNode(value));
        // // tr.appendChild(td);

        switch(key) {
            case "workDescription":
                td.classList.add("big-text");
                td.appendChild(document.createTextNode(value));
                break;

            case "workStatus":
                var sel = document.createElement('select');
                sel.style.width = "100%";

                for (var index = 0; index < 6; index++) {
                    var option = document.createElement('option');
                    option.value = index;
                    option.appendChild(document.createTextNode(workStatusArr[index]));
                    sel.appendChild(option);
                    console.log(`index ${index} value ${workStatusArr[index]}`);
                }
                td.appendChild(sel); 
                break;

            default:
                td.classList.add("centered-field");
                td.appendChild(document.createTextNode(value));
        }

        tr.appendChild(td);
    }

    // Object.values(item).forEach(value => {
    //     const td = document.createElement('td');       
    //     td.classList.add("centered-field");
    //     td.appendChild(document.createTextNode(value));
    //     tr.appendChild(td);
    // });

    tbody.appendChild(tr);
});

// // Clear items
// ipcRenderer.on('item:clear', () => {

//     ul.innerHTML = "";
// });

$('#new-work').on('click', () => {
    ipcRenderer.send('item:new-work');
});

$('#print-all-works').on('click', () => {
    ipcRenderer.send('item:print-all-works');
});

function resizableGrid(table) {
    var row = table.getElementsByTagName('tr')[0],
        cols = row ? row.children : undefined;
    if (!cols) return;

    table.style.overflow = 'hidden';

    var tableHeight = table.offsetHeight;

    for (var i = 0; i < cols.length; i++) {
        var div = createDiv(tableHeight);
        cols[i].appendChild(div);
        cols[i].style.position = 'relative';
        setListeners(div);
    }

    function setListeners(div) {
        var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

        div.addEventListener('mousedown', function (e) {
            curCol = e.target.parentElement;
            nxtCol = curCol.nextElementSibling;
            pageX = e.pageX;

            var padding = paddingDiff(curCol);

            curColWidth = curCol.offsetWidth - padding;
            if (nxtCol)
                nxtColWidth = nxtCol.offsetWidth - padding;
        });

        div.addEventListener('mouseover', function (e) {
            e.target.style.borderRight = '2px solid #0000ff';
        })

        div.addEventListener('mouseout', function (e) {
            e.target.style.borderRight = '';
        })

        document.addEventListener('mousemove', function (e) {
            if (curCol) {
                var diffX = e.pageX - pageX;

                if (nxtCol)
                    nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';

                curCol.style.width = (curColWidth + diffX) + 'px';
            }
        });

        document.addEventListener('mouseup', function (e) {
            curCol = undefined;
            nxtCol = undefined;
            pageX = undefined;
            nxtColWidth = undefined;
            curColWidth = undefined
        });
    }

    function createDiv(height) {
        var div = document.createElement('div');
        div.style.top = 0;
        div.style.right = 0;
        div.style.width = '5px';
        div.style.position = 'absolute';
        div.style.cursor = 'col-resize';
        div.style.userSelect = 'none';
        div.style.height = height + 'px';
        return div;
    }

    function paddingDiff(col) {

        if (getStyleVal(col, 'box-sizing') == 'border-box') {
            return 0;
        }

        var padLeft = getStyleVal(col, 'padding-left');
        var padRight = getStyleVal(col, 'padding-right');
        return (parseInt(padLeft) + parseInt(padRight));

    }

    function getStyleVal(elm, css) {
        return (window.getComputedStyle(elm, null).getPropertyValue(css))
    }
};