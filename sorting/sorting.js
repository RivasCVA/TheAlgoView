// Constant values
let MAX_HEIGHT = 400;
let MIN_LENGTH = 5;
let MAX_LENGTH = 200;
let MAX_VALUE = 200;
let MIN_VALUE = 1;
let START_NUM_RECTS = 40;
let MAX_NUM_TO_SHOW_LABEL = 50;
let MAX_SORTING_SPEED = 10;

// Constant Color Values
let RECT_COLOR = '#ff8229';
let COMPLETE_COLOR = '#16d900';
let SWAP_COLOR = '#ffd900';
let SELECTED_COLOR = '#e6e6e6'
let RANGE_EDGE_COLOR = '#ffc400';
let ANCHOR_COLOR = '#ffd900';
let PIVOT_COLOR = '#00de76';
let INDEX_I_COLOR = '#ffc400';
let IN_POSITION_COLOR = '#0de09a';
let HEAP_COLOR = '#00de76';

// Keeps track of all rects
var numRects = START_NUM_RECTS;
var rectsArray = Array(numRects);

// Enum mockup for State Management
const STATES = {
    READY: 'ready',
    SORTING: 'sorting'
}
var CURRENT_STATE = STATES.READY;

// Enum to keep track of selected sorting algorithm
const ALGOS = {
    BUBBLE_SORT: 'Bubble Sort',
    MERGE_SORT: 'Merge Sort',
    SELECTION_SORT: 'Selection Sort',
    QUICK_SORT: 'Quick Sort',
    INSERTION_SORT: 'Insertion Sort',
    HEAP_SORT: 'Heap Sort'
}
var SELECTED_ALGO = ALGOS.BUBBLE_SORT;

// Starts the sorting algorithm execution process when sort button is pressed
var sortRectsArray;
var swapQueue;
var heightChangeQueue;
var highlightRangeQueue;
var searchAndAnchorQueue;
var partitionQueue;
var partitionSwapQueue;
var insertionSwapQueue;
var insertionKeyIndexQueue;
var heapSwapQueue;
function startSortClicked() {
    if (CURRENT_STATE == STATES.READY) {
        CURRENT_STATE = STATES.SORTING;
        sortRectsArray = getRectsValuesArray();
        swapQueue = new DataStructures.Queue();
        heightChangeQueue = new DataStructures.Queue();
        highlightRangeQueue = new DataStructures.Queue();
        searchAndAnchorQueue = new DataStructures.Queue();
        partitionQueue = new DataStructures.Queue();
        partitionSwapQueue = new DataStructures.Queue();
        insertionSwapQueue = new DataStructures.Queue();
        insertionKeyIndexQueue = new DataStructures.Queue();
        heapSwapQueue = new DataStructures.Queue();

        switch (SELECTED_ALGO) {
            case ALGOS.BUBBLE_SORT:
                Sorter.BubbleSort.performBubbleSort();
                break;
            case ALGOS.MERGE_SORT:
                Sorter.MergeSort.performMergeSort();
                break;
            case ALGOS.SELECTION_SORT:
                Sorter.SelectionSort.performSelectionSort();
                break;
            case ALGOS.QUICK_SORT:
                Sorter.QuickSort.performQuickSort();
                break;
            case ALGOS.INSERTION_SORT:
                Sorter.InsertionSort.performInsertionSort();
                break;
            case ALGOS.HEAP_SORT:
                Sorter.HeapSort.performHeapSort();
                break;
            default:
                Sorter.BubbleSort.performBubbleSort();
                break;
        }
    }
}

// Sets up the Size slider
var sortSizeSlider = document.getElementById('sort-size-slider');
var sortSizeSliderLabel = document.getElementById('sort-size-slider-label');
sortSizeSlider.value = START_NUM_RECTS;
sortSizeSliderLabel.innerText = sortSizeSlider.value.toString(10);
sortSizeSlider.oninput = function() {
    // Will return if the change is less than the increment
    if (sortSizeSlider.value < numRects + 5 && sortSizeSlider.value > numRects - 5) {
        sortSizeSlider.value = numRects;
        return;
    }
    var newVal = Math.round(sortSizeSlider.value / 5) * 5;
    sortSizeSlider.value = newVal;
    sortSizeSliderLabel.innerText = sortSizeSlider.value.toString(10);
    numRects = Math.round(sortSizeSlider.value);

    if (newVal >= 150) {
        setNewSortingSpeed(MAX_SORTING_SPEED);
    } else if (newVal >= 100) {
        setNewSortingSpeed(MAX_SORTING_SPEED * (8/10));
    } else if (newVal >= 75) {
        setNewSortingSpeed(MAX_SORTING_SPEED * (6/10));
    } else if (newVal >= 35) {
        setNewSortingSpeed(MAX_SORTING_SPEED * (4/10));
    } else if (newVal >= 20) {
        setNewSortingSpeed(MAX_SORTING_SPEED * (2/10));
    } else {
        setNewSortingSpeed(1);
    }

    CURRENT_STATE = STATES.READY;
    Rect.clearAllRects();
    Rect.createAndStyleRects();
}

// Sets up the Speed slider
var sortSpeedSlider = document.getElementById('sort-speed-slider');
var sortSpeedSliderLabel = document.getElementById('sort-speed-slider-label');
var sortingSpeed = 4;
sortSpeedSlider.value = sortingSpeed;
sortSpeedSliderLabel.innerText = sortSpeedSlider.value.toString(10) + 'x';
sortSpeedSlider.oninput = function() {
    // Will return if the change is less than the increment
    var newVal = sortSpeedSlider.value;
    if (newVal != 1) {
        newVal = Math.round(sortSpeedSlider.value / 2) * 2;
    }
    setNewSortingSpeed(newVal);
}

function setNewSortingSpeed(speed) {
    sortSpeedSlider.value = speed;
    sortSpeedSliderLabel.innerText = sortSpeedSlider.value.toString(10) + 'x';
    sortingSpeed = speed;
}

// Sets up the Randomize button
var randomizeButton = document.getElementById('sort-randomize');
randomizeButton.onclick = function() {
    CURRENT_STATE = STATES.READY;
    setTimeout(function() {
        Rect.clearAllRects();
        Rect.createAndStyleRects();
    }, 100);
}

// Sets up the sorting algorithm dropdown
function dropdownClick() {
    var dropdownContent = document.getElementById('sort-dropdown-content');
    dropdownContent.classList.toggle('show');
    dropdownContent.style.left = "25px";
}

// When a new Sort Type is selected
Sorter.BubbleSort.setDetails();
var sortSelect = function(ref) {
    // Ensures that the selected one is not the current one
    if (ref.innerText == SELECTED_ALGO) {
        return;
    }

    // Randomizes the rects
    CURRENT_STATE = STATES.READY;
    setTimeout(function() {
        Rect.clearAllRects();
        Rect.createAndStyleRects();
    }, 100);

    document.getElementsByClassName('dropdown-button')[0].innerText = ref.innerText;
    // Updates the selected sorting algorithm state
    SELECTED_ALGO = ref.innerText;
    switch (SELECTED_ALGO) {
        case ALGOS.BUBBLE_SORT:
            Sorter.BubbleSort.setDetails();
            break;
        case ALGOS.MERGE_SORT:
            Sorter.MergeSort.setDetails();
            break;
        case ALGOS.SELECTION_SORT:
            Sorter.SelectionSort.setDetails();
            break;
        case ALGOS.QUICK_SORT:
            Sorter.QuickSort.setDetails();
            break;
        case ALGOS.INSERTION_SORT:
            Sorter.InsertionSort.setDetails();
            break;
        case ALGOS.HEAP_SORT:
            Sorter.HeapSort.setDetails();
            break;
        default:
            Sorter.BubbleSort.setDetails();
            break;
    }
    CURRENT_STATE = STATES.READY;
}

// When the window is clicked
window.onclick = function(event) {
    // When clicked outside dropdown
    if (!event.target.matches('.dropdown-button')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
    }
}

// Creates and returns an Int array of all values of rectsArray
function getRectsValuesArray() {
    var arr = Array(rectsArray.length);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = rectsArray[i].value;
    }
    return arr;
}


// Initializes the first rects
Rect.createAndStyleRects();

