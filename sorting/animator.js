// Handles all animations of Rects
var Animator = (function() {
    // Colors all Rects to a Complete color to indicate that they have finished sorting
    var showSortingComplete = function() {
        Rect.lightAllRects();
        setTimeout(function() {
            Rect.resetAllRectsColor();
        }, 
        1500);
    }


    //********* BUBBLE SORT ANIMATION *****************
    // NOTE: Other sorts also use the swap animations

    // Used within sorting algorithms to swap elements in rectsArray
    var addSwap = function(index1, index2) {
        swapQueue.enqueue(index1);
        swapQueue.enqueue(index2);
        if (isSwapLoopActive == false) {
            startSwapLoop(performSwap);
        }
    }

    // Animates the swapping of two rects
    var totalSwapsCount = 0;
    var activeSwapsCount = 0;
    var performSwap = function(rectIndex1, rectIndex2) {
        var numRectsAtSwapStart = numRects;
        var movesCount = 0;
        activeSwapsCount++;
        rectsArray[rectIndex1].divRect.style.background = SWAP_COLOR;
        rectsArray[rectIndex2].divRect.style.background = SWAP_COLOR;
        rectsArray[rectIndex1].divRect.style.zIndex = (++totalSwapsCount).toString(10);
        rectsArray[rectIndex2].divRect.style.zIndex = totalSwapsCount.toString(10);
        var x1 = rectsArray[rectIndex1].posX, x2 = rectsArray[rectIndex2].posX;
        var x1End = x2, x2End = x1;
        var numMoves = Math.abs(rectIndex1-rectIndex2);
        var leftRatio = 100 / (numRects+1);
        var direction = (x1 <= x2) ? 1 : -1;
        var stepSize = (sortingSpeed < MAX_SORTING_SPEED) ? Math.round(20 / sortingSpeed) : 1;
        var tick = (sortingSpeed < MAX_SORTING_SPEED) ? (3 * (MAX_SORTING_SPEED / sortingSpeed)) : 1;
        var intervalHandle = setInterval(function() {
            // Immediately kills all active swapping
            if (CURRENT_STATE != STATES.SORTING || rectIndex1 == rectIndex2) { 
                // Ensures the color is reset to default if number of Rects changed
                if (numRects == numRectsAtSwapStart) {
                    rectsArray[rectIndex1].divRect.style.background = RECT_COLOR;
                    rectsArray[rectIndex2].divRect.style.background = RECT_COLOR;
                    rectsArray[rectIndex1].moveTo(x1End);
                    rectsArray[rectIndex2].moveTo(x2End);
                }
                clearInterval(intervalHandle);
                activeSwapsCount--;
                return;
            }
            // Ends when the number of expected moves to finish is complete
            if (movesCount++ == (numMoves * stepSize)) {
                clearInterval(intervalHandle);
                rectsArray[rectIndex1].divRect.style.background = RECT_COLOR;
                rectsArray[rectIndex2].divRect.style.background = RECT_COLOR;
                var tmp = rectsArray[rectIndex1];
                rectsArray[rectIndex1] = rectsArray[rectIndex2];
                rectsArray[rectIndex2] = tmp;
                activeSwapsCount--;
                return;
            }
            // Moves the rects
            x1 += (direction * leftRatio) / stepSize;
            rectsArray[rectIndex1].moveTo(x1);
            x2 += (-direction * leftRatio) / stepSize;
            rectsArray[rectIndex2].moveTo(x2);
        },
        tick);
    }

    // Starts the swapping loop that performs swaps based on the swapQueue
    var isSwapLoopActive = false;
    var startSwapLoop = function(callback) {
        isSwapLoopActive = true;
        var speedAtStart = sortingSpeed;
        var getTickRate = function() { 
            return ((sortingSpeed < MAX_SORTING_SPEED) ? (5 * MAX_SORTING_SPEED / sortingSpeed) : 1);
        }
        var loopFunction = function() {
            // Resets the function interval to set new tick rate
            if (speedAtStart != sortingSpeed) {
                speedAtStart = sortingSpeed;
                clearInterval(swapLoop);
                swapLoop = setInterval(loopFunction, getTickRate());
            }
            if (swapQueue.getLength() == 0 || CURRENT_STATE != STATES.SORTING) {
                // Colors all Rects to their Complete color when the sorting is done
                if (CURRENT_STATE == STATES.SORTING && activeSwapsCount == 0 && swapQueue.getLength() == 0 && 
                    !isSearchAndAnchorLoopActive && !isPartitionLoopActive && !isInsertionLoopActive && !isHeapLoopActive) {
                    showSortingComplete();
                    isSwapLoopActive = false;
                    clearInterval(swapLoop);
                }
                // Force quits the loop
                else if (CURRENT_STATE != STATES.SORTING) {
                    isSwapLoopActive = false;
                    clearInterval(swapLoop);
                }
            }
            else if (activeSwapsCount == 0) {
                var index1 = swapQueue.dequeue(), index2 = swapQueue.dequeue();
                callback(index1, index2);
            }
        }
        var swapLoop = setInterval(loopFunction, getTickRate());
    }



    //********* MERGE SORT ANIMATION *****************

    // Used within sorting algorithms to perform height changes
    var addHeightChange = function(index, newValue) {
        heightChangeQueue.enqueue(index);
        heightChangeQueue.enqueue(newValue);
        if (isHeightChangeLoopActive == false) {
            startHeightChangeLoop(performHeightChange);
        }
    }

    // Instantly changes the height of the given rects
    var performHeightChange = function(index, newValue) {
        var heightRatio = MAX_HEIGHT / MAX_VALUE;
        rectsArray[index].value = newValue;
        // Changes the value label if the rect has it
        if (rectsArray.length <= MAX_NUM_TO_SHOW_LABEL) {
            rectsArray[index].divRect.getElementsByTagName('h3')[0].innerText = newValue.toString(10);
        }
        // Changes the height and highlights it
        rectsArray[index].divRect.style.height = (newValue*heightRatio).toString(10) + 'px';
        // Resets the color of the previous rect if it is not an edge
        if (index-1 > highlightRangeMin && index < highlightRangeMax) {
            rectsArray[index-1].divRect.style.background = RECT_COLOR;
        }
        // Recolors the min edge if it was the previous rect
        else if (index-1 == highlightRangeMin) {
            rectsArray[index-1].divRect.style.background = RANGE_EDGE_COLOR;
        }
        // Recolors the max edge if it was the previous rect
        else if (index == highlightRangeMax) {
            if (index-1 == highlightRangeMin) {
                rectsArray[index-1].divRect.style.background = RANGE_EDGE_COLOR;
            } else {
                rectsArray[index-1].divRect.style.background = RECT_COLOR;
            }
            rectsArray[index].divRect.style.background = SELECTED_COLOR;
        }
    }

    // Adds a Highlight to the starting and ending rect in a range
    // The highlight queue is asynchronus to the change height qeueu
    var addHighlightRange = function(min, max) {
        highlightRangeQueue.enqueue(min);
        highlightRangeQueue.enqueue(max);
        if (highlightRangeQueue.getLength() == 2) {
            updateHighlightRange(0)
        }
    }

    // Changes the highlight range to the next in the queue when it is needed
    var highlightRangeMin = 0;
    var highlightRangeMax = 0;
    var updateHighlightRange = function(currentIndex) {
        // Emmediately quits
        if (highlightRangeQueue.getLength() == 0 || CURRENT_STATE != STATES.SORTING) {
            highlightRangeMin = 0;
            highlightRangeMax = 0;
            return;
        }
        // When the traversal of the current range ends
        if (currentIndex == highlightRangeMax) {
            rectsArray[highlightRangeMin].divRect.style.background = RECT_COLOR;
            rectsArray[highlightRangeMax].divRect.style.background = RECT_COLOR;
            var newMin = highlightRangeQueue.dequeue(), newMax = highlightRangeQueue.dequeue();
            rectsArray[newMin].divRect.style.background = RANGE_EDGE_COLOR;
            rectsArray[newMax].divRect.style.background = RANGE_EDGE_COLOR;
            highlightRangeMin = newMin;
            highlightRangeMax = newMax;
        }
    }

    // Starts the height change loop that performs height changes based on the heightChangeQueue
    var isHeightChangeLoopActive = false;
    var startHeightChangeLoop = function(callback) {
        isHeightChangeLoopActive = true;
        var speedAtStart = sortingSpeed;
        var getTickRate = function() {
            return ((sortingSpeed < MAX_SORTING_SPEED) ? (50 * MAX_SORTING_SPEED / sortingSpeed) : 20);
        }
        var index = 0;
        var loopFunction = function() {
            // Resets the function interval to set new tick rate
            if (speedAtStart != sortingSpeed) {
                speedAtStart = sortingSpeed;
                clearInterval(heightChangeLoop);
                heightChangeLoop = setInterval(loopFunction, getTickRate());
            }
            // Ends the loop
            if (heightChangeQueue.getLength() == 0 || CURRENT_STATE != STATES.SORTING) {
                // Colors all rects to their Complete color if sorting is done
                if (highlightRangeQueue.getLength() == 0) {
                    showSortingComplete();
                } else {
                    Rect.resetAllRectsColor();
                }
                updateHighlightRange(index);
                isHeightChangeLoopActive = false;
                clearInterval(heightChangeLoop);
                return;
            }
            if (index != highlightRangeMax) {
                // Retrieves data from the height change queue
                index = heightChangeQueue.dequeue(), newValue = heightChangeQueue.dequeue();
                // Selects the current rect
                rectsArray[index].divRect.style.background = SELECTED_COLOR;
                // Performs the height change
                callback(index, newValue);
            } else {
                // Checks to update the edge to edge range
                updateHighlightRange(index);
                index = -1;
            }
        }
        var heightChangeLoop = setInterval(loopFunction, getTickRate());
    }


    //********* SELECTION SORT ANIMATION *****************

    // Cycles from the start to end index and highlights minimum anchors until it
    // reaches the permanent anchor, then it just finishes cycling to the end
    var addSearchAndAnchor = function(startIndex, anchorIndex, endIndex) {
        searchAndAnchorQueue.enqueue(startIndex);
        searchAndAnchorQueue.enqueue(anchorIndex);
        searchAndAnchorQueue.enqueue(endIndex);
        if (searchAndAnchorQueue.getLength() == 3) {
            startSearchAndAnchorLoop();
        }
    }

    // Starts the Seach and Anchor loop
    var isSearchAndAnchorLoopActive = false;
    var startSearchAndAnchorLoop = function() {
        isSearchAndAnchorLoopActive = true;
        var speedAtStart = sortingSpeed;
        var getTickRate = function() {
            return ((sortingSpeed < MAX_SORTING_SPEED) ? (25 * MAX_SORTING_SPEED / sortingSpeed) : 10);
        }
        var startIndex, anchorIndex, endIndex, currentIndex, currentAnchorIndex;
        var resetIndexes = function() {
            startIndex = 0;
            anchorIndex = 0;
            endIndex = 0;
            currentIndex = 0;
            currentAnchorIndex = 0;
        }
        var areIndexesReset = function() {
            return (startIndex + anchorIndex + endIndex + currentIndex + currentAnchorIndex == 0)
        }
        resetIndexes();
        var loopFunction = function() {
            // Resets the function interval to set new tick rate
            if (speedAtStart != sortingSpeed) {
                speedAtStart = sortingSpeed;
                clearInterval(searchAndAnchorLoop);
                searchAndAnchorLoop = setInterval(loopFunction, getTickRate());
            }
            // Quits the loop
            if ((areIndexesReset() && searchAndAnchorQueue.getLength() == 0) || CURRENT_STATE != STATES.SORTING) {
                if (CURRENT_STATE != STATES.SORTING) {
                    Rect.resetAllRectsColor();
                }
                isSearchAndAnchorLoopActive = false;
                clearInterval(searchAndAnchorLoop);
                resetIndexes();
                return;
            }
            // Retrieves new data from the queue
            if (areIndexesReset()) {
                startIndex = searchAndAnchorQueue.dequeue();
                anchorIndex = searchAndAnchorQueue.dequeue();
                endIndex = searchAndAnchorQueue.dequeue();
                currentIndex = startIndex;
                currentAnchorIndex = startIndex;
            }
            // Waits for the swap to finish before continuing the next cycle
            if (activeSwapsCount == 0) {
                // Reached the end
                if (currentIndex == endIndex) { 
                    if (searchAndAnchorQueue.getLength() == 0) {
                        isSearchAndAnchorLoopActive = false;
                    }
                    if (currentIndex == anchorIndex) {
                        rectsArray[currentAnchorIndex].divRect.style.background = RECT_COLOR;
                    }
                    rectsArray[currentIndex-1].divRect.style.background = RECT_COLOR;
                    addSwap(startIndex, anchorIndex);
                    resetIndexes();
                }
                // Has just started
                else if (currentIndex == startIndex) { rectsArray[currentIndex].divRect.style.background = ANCHOR_COLOR;
                }
                // Reached the permanent Anchor Index
                else if (currentIndex == anchorIndex) { 
                    rectsArray[currentIndex].divRect.style.background = ANCHOR_COLOR;
                    rectsArray[currentAnchorIndex].divRect.style.background = RECT_COLOR;
                    currentAnchorIndex = currentIndex;
                } 
                // Has yet to reach the permanent Anchor Index and the current Rect is a possible minimum
                else if (currentIndex < anchorIndex && 
                        rectsArray[currentIndex].value < rectsArray[currentAnchorIndex].value) { 
                    rectsArray[currentIndex].divRect.style.background = ANCHOR_COLOR;
                    if (currentAnchorIndex != startIndex) {
                        rectsArray[currentAnchorIndex].divRect.style.background = RECT_COLOR;
                    }
                    currentAnchorIndex = currentIndex;
                }
                // Has not other condition, so it is regularly highlighted
                else {
                    rectsArray[currentIndex].divRect.style.background = SELECTED_COLOR;
                }

                // Resets the color of the previosly highlighted rect
                if (currentIndex - 1 > startIndex && currentIndex - 1 != currentAnchorIndex) {
                    rectsArray[currentIndex-1].divRect.style.background = RECT_COLOR;
                }
                else if (currentIndex - 1 == startIndex) {
                    rectsArray[currentIndex-1].divRect.style.background = ANCHOR_COLOR;
                }
                // Increments the counting index
                if (currentIndex != endIndex) {
                    currentIndex++;
                }
            }
        }
        var searchAndAnchorLoop = setInterval(loopFunction, getTickRate());
    }



    //********* QUICK SORT ANIMATION *****************

    var addPartition = function(startIndex, endIndex, pivotIndex) {
        partitionQueue.enqueue(startIndex);
        partitionQueue.enqueue(endIndex);
        partitionQueue.enqueue(pivotIndex);
        if (partitionQueue.getLength() == 3) {
            startPartitionLoop();
        }
    }

    var addPartitionSwap = function(indexI, indexJ, isFinalPartitionSwap) {
        partitionSwapQueue.enqueue(indexI);
        partitionSwapQueue.enqueue(indexJ);
        partitionSwapQueue.enqueue(isFinalPartitionSwap);
    }

    var isPartitionLoopActive = false;
    var startPartitionLoop = function() {
        isPartitionLoopActive = true;
        var speedAtStart = sortingSpeed;
        var getTickRate = function() {
            return ((sortingSpeed < MAX_SORTING_SPEED) ? (35 * MAX_SORTING_SPEED / sortingSpeed) : 15);
        }
        var swapI = 0, swapJ = 0, isFinalPartitionSwap = true;
        var startIndex = 0, endIndex = 0, pivotIndex = 0;
        var indexI = 0, indexJ = 0;
        var lessThanIndexes = [];
        var needsToColorNewLessThan = false;
        var colorNewLessThan = function() {
            if (lessThanIndexes.length > 0) {
                var end = lessThanIndexes[lessThanIndexes.length-1];
                rectsArray[end].divRect.style.backgroundColor = PIVOT_COLOR;
            }
        }
        var needsToCompleteDeq = false;
        var loopFunction = function() {
            // Resets the function interval to set new tick rate
            if (speedAtStart != sortingSpeed) {
                speedAtStart = sortingSpeed;
                clearInterval(partitionLoop);
                partitionLoop = setInterval(loopFunction, getTickRate());
            }
            // Quits the loop
            if ((activeSwapsCount == 0 && partitionSwapQueue.getLength() == 0) 
                || CURRENT_STATE != STATES.SORTING) {
                isPartitionLoopActive = false;
                clearInterval(partitionLoop);
                if (CURRENT_STATE != STATES.SORTING) {
                    Rect.resetAllRectsColor();
                }
                return;
            }
            // Will only make next moves when there is no active swapping
            if (activeSwapsCount == 0 && partitionSwapQueue.getLength() > 0) {
                // Prepares variables and rects for the next partition
                if (isFinalPartitionSwap && indexJ >= swapJ) {
                    // Ensures tha the J rect is not selected when the new partition begins
                    if (swapJ-1 >= startIndex) {
                        rectsArray[swapJ-1].divRect.style.background = RECT_COLOR;
                    }
                    // Will make the final swap of the current partition
                    // Then it waits for the swap to finish before making the rest of the preparations
                    if (!needsToCompleteDeq) {
                        if (swapI != swapJ) { 
                            if (needsToColorNewLessThan) {
                                colorNewLessThan();
                            }
                            needsToCompleteDeq = true; addSwap(swapI, swapJ); return; 
                        }
                    }
                    needsToCompleteDeq = false;
                    isFinalPartitionSwap = false;
                    for (var i = 0; i < lessThanIndexes.length; i++) {
                        rectsArray[lessThanIndexes[i]].divRect.style.background = RECT_COLOR;
                    }
                    lessThanIndexes = [];

                    // Sets up the data from the Partition Swap Queue
                    swapI = partitionSwapQueue.dequeue();
                    swapJ = partitionSwapQueue.dequeue();
                    isFinalPartitionSwap = partitionSwapQueue.dequeue();
                    // Will add the very final swap to the Swap Queue
                    if (partitionSwapQueue.getLength() == 0) { addSwap(swapI, swapJ); }

                    // Sets up the data from the Partition Queue
                    rectsArray[pivotIndex].divRect.style.background = RECT_COLOR;
                    rectsArray[indexI].divRect.style.background = RECT_COLOR;
                    startIndex = partitionQueue.dequeue();
                    endIndex = partitionQueue.dequeue();
                    pivotIndex = partitionQueue.dequeue();
                    indexI = startIndex;
                    indexJ = indexI;
                    rectsArray[indexI].divRect.style.background = INDEX_I_COLOR;
                    rectsArray[pivotIndex].divRect.style.background = PIVOT_COLOR;
                }
                // Updates the rects and elements of the current partition
                else {
                    // Ensures that the previously selectd J rect is unselected
                    if (indexJ-1 >= startIndex) {
                        if (indexJ-1 == indexI) {
                            rectsArray[indexI].divRect.style.background = INDEX_I_COLOR;
                        } else if (!lessThanIndexes.includes(indexJ-1)) {
                            rectsArray[indexJ-1].divRect.style.background = RECT_COLOR;
                        }
                    }
                    // Colors the swapped rects that are less than the pivot
                    if (needsToColorNewLessThan) {
                        needsToColorNewLessThan = false;
                        colorNewLessThan();
                    }
                    // Performs the next swap of the partition
                    if (indexJ == swapJ) {
                        // Ensures that it does not swap the same element
                        if (swapI != swapJ) {
                            addSwap(swapI, swapJ);
                            lessThanIndexes.push(swapI);
                            needsToColorNewLessThan = true;
                        }
                        // Selects the next I index, and deselects the previous I index
                        rectsArray[indexI].divRect.style.background = RECT_COLOR;
                        rectsArray[++indexI].divRect.style.background = INDEX_I_COLOR;
                        // Colors the new less than if there was no swap
                        if (swapI == swapJ) {
                            lessThanIndexes.push(swapJ);
                            colorNewLessThan();
                        }
                        // Gets the next indexes for the next swap
                        var prevI = swapI;
                        swapI = partitionSwapQueue.dequeue();
                        swapJ = partitionSwapQueue.dequeue();
                        isFinalPartitionSwap = partitionSwapQueue.dequeue();
                        // Schedules to color the new less than when final swap is done
                        if (isFinalPartitionSwap) {
                            lessThanIndexes.push(prevI);
                            needsToColorNewLessThan = true;
                        }
                        // Will add the very final swap to the Swap Queue
                        if (partitionSwapQueue.getLength() == 0) { addSwap(swapI, swapJ); }
                    }
                    else {
                        // Selects the current J index
                        rectsArray[indexJ].divRect.style.background = SELECTED_COLOR;
                    }
                    indexJ++;
                }
            }
        }
        var partitionLoop = setInterval(loopFunction, getTickRate());
    }


    //********* INSERTION SORT ANIMATION *****************

    var addInsertionSwap = function(index1, index2) {
        insertionSwapQueue.enqueue(index1);
        insertionSwapQueue.enqueue(index2);
        if (insertionSwapQueue.getLength() == 2) {
            startInsertionLoop();
        }
    }

    var addKeyIndex = function(keyIndex) {
        insertionKeyIndexQueue.enqueue(keyIndex);
    }

    var isInsertionLoopActive = false;
    var startInsertionLoop = function() {
        isInsertionLoopActive = true;
        var speedAtStart = sortingSpeed;
        var getTickRate = function() {
            return ((sortingSpeed < MAX_SORTING_SPEED) ? (35 * MAX_SORTING_SPEED / sortingSpeed) : 5);
        }
        var keyIndex = 0;
        var swapI = 0, swapJ = 0;
        var hasFlashedSinceSwap = true;
        // Shortly flashes the rect at index
        var flashRectInOrder = function(index) {
            rectsArray[index].divRect.style.background = IN_POSITION_COLOR;
            var inPlaceTimeout = setTimeout(function() {
                if (isInsertionLoopActive == true) {
                    rectsArray[index].divRect.style.background = RECT_COLOR;
                }
            }, 550 / sortingSpeed);
        }
        var loopFunction = function() {
            // Resets the function interval to set new tick rate
            if (speedAtStart != sortingSpeed) {
                speedAtStart = sortingSpeed;
                clearInterval(insertionLoop);
                insertionLoop = setInterval(loopFunction, getTickRate());
            }
            // Quits the loop
            if (insertionSwapQueue.getLength() == 0 || CURRENT_STATE != STATES.SORTING) {
                isInsertionLoopActive = false;
                clearInterval(insertionLoop);
                if (CURRENT_STATE != STATES.SORTING) {
                    Rect.resetAllRectsColor();
                }
                return;
            }
            // Runs when there is no active swapping
            if (activeSwapsCount == 0) {
                // Recolors the keyIndex if previously swapped
                if (swapJ+1 >= keyIndex) {
                    rectsArray[keyIndex].divRect.style.background = PIVOT_COLOR;
                }
                // Gets and highlights the key index rect
                if (insertionSwapQueue.peek()+1 > keyIndex) {
                    // Flashes the previously positioned rect
                    if (!hasFlashedSinceSwap) {
                        hasFlashedSinceSwap = true;
                        flashRectInOrder(swapI);
                    }
                    // Colors the next key index rect
                    rectsArray[keyIndex].divRect.style.background = RECT_COLOR;
                    keyIndex = insertionKeyIndexQueue.dequeue();
                    rectsArray[keyIndex].divRect.style.background = PIVOT_COLOR;
                    return;
                }
                // Retrieves the swap indexes
                swapI = insertionSwapQueue.dequeue();
                swapJ = insertionSwapQueue.dequeue();
                // Performs the swap
                addSwap(swapI, swapJ);
                hasFlashedSinceSwap = false;
            }
        }
        var insertionLoop = setInterval(loopFunction, getTickRate());

    }


    //********* HEAP SORT ANIMATION *****************
    
    var addHeapSwap = function(index1, index2, isHeapifying) {
        heapSwapQueue.enqueue(index1);
        heapSwapQueue.enqueue(index2);
        heapSwapQueue.enqueue(isHeapifying);
        if (heapSwapQueue.getLength() == 3) {
            startHeapLoop();
        }
    }

    var isHeapLoopActive = false;
    var startHeapLoop = function() {
        isHeapLoopActive = true;
        var speedAtStart = sortingSpeed;
        var getTickRate = function() {
            return ((sortingSpeed < MAX_SORTING_SPEED) ? (35 * MAX_SORTING_SPEED / sortingSpeed) : 5);
        }
        var prevIndex1 = null;
        var prevIndex2 = null;
        var prevIsHeapifying = null;
        var hasFinishedMaxHeapifying = false;
        var loopFunction = function() {
            // Resets the function interval to set new tick rate
            if (speedAtStart != sortingSpeed) {
                speedAtStart = sortingSpeed;
                clearInterval(heapLoop);
                heapLoop = setInterval(loopFunction, getTickRate());
            }
            // Quits the loop
            if (heapSwapQueue.getLength() == 0 || CURRENT_STATE != STATES.SORTING) {
                isHeapLoopActive = false;
                clearInterval(heapLoop);
                if (CURRENT_STATE != STATES.SORTING) {
                    Rect.resetAllRectsColor();
                }
                return;
            }
            // Runs next swaps after previous is complete
            if (activeSwapsCount == 0) {
                var index1 = heapSwapQueue.dequeue();
                var index2 = heapSwapQueue.dequeue();
                var isHeapifying = heapSwapQueue.dequeue();
                if (prevIsHeapifying) {
                    rectsArray[prevIndex1].divRect.style.background = HEAP_COLOR;
                    rectsArray[prevIndex2].divRect.style.background = HEAP_COLOR;
                }
                if (!isHeapifying && prevIsHeapifying && !hasFinishedMaxHeapifying) {
                    hasFinishedMaxHeapifying = true;
                    for (var i = 0; i < rectsArray.length; i++) {
                        rectsArray[i].divRect.style.background = HEAP_COLOR;
                    }
                }
                addSwap(index1, index2);
                prevIndex1 = index1;
                prevIndex2 = index2;
                prevIsHeapifying = isHeapifying;
            }
        }
        var heapLoop = setInterval(loopFunction, getTickRate());
    }



    return {
        addSwap: addSwap,
        addHeightChange: addHeightChange,
        addHighlightRange: addHighlightRange,
        addSearchAndAnchor: addSearchAndAnchor,
        addPartition: addPartition,
        addPartitionSwap: addPartitionSwap,
        addKeyIndex: addKeyIndex,
        addInsertionSwap: addInsertionSwap,
        addHeapSwap: addHeapSwap
    };

})();

