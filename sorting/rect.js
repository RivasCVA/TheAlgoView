//Handles all the creation and styling of the Sorting Rectangles
var Rect = (function() {

    // Contains and animates each rect
    var SortRectangle = class {
        constructor(divRect, posX, value) {
            this.divRect = divRect;
            this.posX = posX;
            this.value = value;
        }
        moveTo(newPosX) {
            this.posX = newPosX;
            this.divRect.style.left = this.posX.toString(10) + '%';
        }
    }

    // Handles the creation of all rects 
    var createAndStyleRects = function() {
        rectsArray = Array(numRects);
        let leftRatio = 100 / (numRects+1);
        let widthPercent = 100 / numRects;
        let widthSeparator = 40 / numRects;
        let heightRatio = MAX_HEIGHT / MAX_VALUE;
        for (var i = 0; i < numRects; i++) {
            var posX = (i+1)*leftRatio;
            var value = (Math.ceil(Math.random() * (MAX_VALUE-MIN_VALUE))) + MIN_VALUE;
            var rect = document.createElement('div');

            rect.className = 'sort-rect';
            rect.style.background = RECT_COLOR;
            rect.style.left = (posX).toString(10) + '%';
            rect.style.width = (widthPercent-widthSeparator).toString(10) + '%';
            rect.style.height = (value*heightRatio).toString(10) + 'px';

            if (numRects <= MAX_NUM_TO_SHOW_LABEL) {
                var valueLabel = document.createElement('h3');
                valueLabel.innerText = value.toString(10);
                rect.appendChild(valueLabel);
            }

            document.getElementById('sort-container').appendChild(rect);
            rectsArray[i] = new SortRectangle(rect, posX, value);
        }
    }

    // Removes all active rects to create a new set
    var clearAllRects = function() {
        var parent = document.getElementById('sort-container');
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // Re-Colors all rects to their default color
    var resetAllRectsColor = function() {
        for (var i = 0; i < rectsArray.length; i++) {
            rectsArray[i].divRect.style.background = RECT_COLOR;
        }
    }

    // Colors all rects to their complete (in-order) color
    var lightAllRects = function() {
        for (var i = 0; i < rectsArray.length; i++) {
            rectsArray[i].divRect.style.background = COMPLETE_COLOR;
        }
    }

    return {
        createAndStyleRects: createAndStyleRects,
        clearAllRects: clearAllRects,
        resetAllRectsColor: resetAllRectsColor,
        lightAllRects: lightAllRects
    };

})();
