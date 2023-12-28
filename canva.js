let textId = 1;
        let selectedElement = null;
        let undoStack = [];
        let redoStack = [];

        // function for changing text size::

        function changeSize() {
            const sizeDropdown = document.getElementById('sizes');
            const selectedSize = sizeDropdown.value;
            if (selectedElement) {
                selectedElement.style.fontSize = selectedSize + 'px';
                addToUndoStack();
            }
        }

        // function for changing text Font::

        function changeFont() {
            const fontDropdown = document.getElementById('fonts');
            const selectedFont = fontDropdown.value;
        
            if (selectedElement) {
                selectedElement.querySelector('div').style.fontFamily = selectedFont;
            }
        }

        // function for changing text color::

        function changeColor() {
            const colorDropdown = document.getElementById('colors');
            const selectedColor = colorDropdown.options[colorDropdown.selectedIndex].dataset.color;
            if (selectedElement) {
                selectedElement.style.color = selectedColor;
                addToUndoStack();
            }
        }

        function addText() {
            const canvas = document.getElementById('canvas');
            const textElement = document.createElement('div');
            textElement.className = 'draggable';
            textElement.id = 'text_' + textId;
            textElement.innerHTML = '<div contenteditable="true" ondblclick="makeEditable(this)">Type your text</div>';
            textElement.style.top = '169px';
            textElement.style.left = '360px';
            textElement.style.overflow = 'hidden'; // Restrict text overflow
            makeDraggable(textElement);
            makeSelectable(textElement);
            canvas.appendChild(textElement);
            addToUndoStack();
            textId++;
        }

        function deleteText() {
            if (selectedElement) {
                selectedElement.remove();
                addToUndoStack();
                selectedElement = null;
            }
        }

        function makeEditable(element) {
            element.focus();
            document.execCommand('selectAll', false, null);
        }

        function makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            element.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = element.offsetTop - pos2 + 'px';
                element.style.left = element.offsetLeft - pos1 + 'px';
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                addToUndoStack();
            }
        }

        function makeSelectable(element) {
            element.onclick = selectElement;

            function selectElement() {
                deselectAll();
                selectedElement = element;
                element.style.border = '2px solid #000';
            }
        }

        function deselectAll() {
            const canvas = document.getElementById('canvas');
            const elements = canvas.getElementsByClassName('draggable');
            for (const element of elements) {
                element.style.border = '1px solid #ccc';
            }
            selectedElement = null;
        }

        function addToUndoStack() {
            const canvasClone = document.getElementById('canvas').cloneNode(true);
            undoStack.push(canvasClone);
            redoStack = [];
        }

        function undo() {
            if (undoStack.length > 1) {
                redoStack.push(undoStack.pop());
                const canvas = document.getElementById('canvas');
                canvas.innerHTML = new XMLSerializer().serializeToString(undoStack[undoStack.length - 1]);
            }
        }

        function redo() {
            if (redoStack.length > 0) {
                undoStack.push(redoStack.pop());
                const canvas = document.getElementById('canvas');
                canvas.innerHTML = new XMLSerializer().serializeToString(undoStack[undoStack.length - 1]);
            }
        }

        document.getElementById('undo').addEventListener('click', undo);
        document.getElementById('redo').addEventListener('click', redo);
    