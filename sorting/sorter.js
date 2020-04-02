// Handles all sorting algorithms
// *******
// When Adding a New Sorting Algorithm:
// - Add the button in the HTML (sorting-index.html)
// - Update the ALGOS enum (sorting.js)
// - Update the startSortClicked method (sorting.js)
// - Update the sortSelect method (sorting.js)
// - Add the functionality here
// - Add the animations in Animator (animator.js)
// *******
var Sorter = (function() {
    
    var BubbleSort = (function() {
        var performBubbleSort = function() {
            var l = numRects;
            for (var i = 0; i < l; i++) {
                for (var j = 0; j < l-i-1; j++) {
                    if (sortRectsArray[j] > sortRectsArray[j+1]) {
                        var tmp = sortRectsArray[j];
                        sortRectsArray[j] = sortRectsArray[j+1];
                        sortRectsArray[j+1] = tmp;
                        Animator.addSwap(j, j+1);
                    }
                }
            }
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerHTML = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();

            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
            document.getElementById('tc-average').innerHTML = TimeComplexity.average;
            document.getElementById('tc-best').innerHTML = TimeComplexity.best;
            document.getElementById('space-complexity').innerHTML = spaceComplexity;
        }

        var TimeComplexity = {
            worst: 'O(n<sup>2</sup>)',
            average: 'O(n<sup>2</sup>)',
            best: 'O(n)'
        }

        var spaceComplexity = 'O(1)';

        var exampleCode = 
`
bubbleSort(int[] arr)
{ 
    // loops len - 1 times
    int len = arr.length;
    for (int i = 0; i < len-1; i++)
    {
        // continously swaps the largest element
        for (int j = 0; j < len-i-1; j++)
        {
            if (arr[j] > arr[j+1]) { 
                // swaps arr[j] and arr[j+1] 
                int tmp = arr[j]; 
                arr[j] = arr[j+1]; 
                arr[j+1] = tmp; 
            }
        }
    }
}

main() {
    int[] myArray = {8,2,5,7,0,4,1,9,3,6};
    bubbleSort(myArray);
}

`;

        return {
            performBubbleSort: performBubbleSort,
            setDetails: setDetails
        };
    })();


    var MergeSort = (function() {
        var performMergeSort = function() {
            mergeSort(sortRectsArray, 0, numRects-1);
        }

        var mergeSort = function(sortArray, min, max) {
            if (min >= max) { return; }
            var mid = Math.round((min+max) / 2);
            var arr1 = Array(mid-min);
            var arr2 = Array(max-mid+1);
            var k = 0;
            for (var i = 0; i < arr1.length; i++) {
                arr1[i] = sortArray[k++];
            }
            for (var i = 0; i < arr2.length; i++) {
                arr2[i] = sortArray[k++];
            }
            mergeSort(arr1, min, mid-1);
            mergeSort(arr2, mid, max);
            merge(sortArray, arr1, arr2, min);
        }

        var merge = function(sortArray, arr1, arr2, min) {
            var i0 = 0, i1 = 0, i2 = 0;
            Animator.addHighlightRange(min, min+arr1.length+arr2.length-1);
            while (i1 < arr1.length && i2 < arr2.length) {
                if (arr1[i1] <= arr2[i2]) {
                    Animator.addHeightChange(min+i0, arr1[i1]);
                    sortArray[i0++] = arr1[i1++];
                }
                else {
                    Animator.addHeightChange(min+i0, arr2[i2]);
                    sortArray[i0++] = arr2[i2++];
                }
            }
            while(i1 < arr1.length) {
                Animator.addHeightChange(min+i0, arr1[i1]);
                sortArray[i0++] = arr1[i1++];
            }
            while(i2 < arr2.length) {
                Animator.addHeightChange(min+i0, arr2[i2]);
                sortArray[i0++] = arr2[i2++];
            }
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerHTML = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();

            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
            document.getElementById('tc-average').innerHTML = TimeComplexity.average;
            document.getElementById('tc-best').innerHTML = TimeComplexity.best;
            document.getElementById('space-complexity').innerHTML = spaceComplexity;
        }

        var TimeComplexity = {
            worst: 'O(n&#8226log(n))',
            average: 'O(n&#8226log(n))',
            best: 'O(n&#8226log(n))'
        }

        var spaceComplexity = 'O(n)';

        var exampleCode = 
`
mergeSort(int[] arr, int min, int max)
{
    // breaks the recursion
    if (min >= max) {
      return;
    }

    // the middle index to split the array
    int mid = (min+max) / 2;

    // initializes the left and right halves
    int[] leftArr = new int[mid-min+1];
    int[] rightArr = new int[max-mid];
    int k = 0;
    for (int i = 0; i < leftArr.length; i++)
    {
      leftArr[i] = arr[k++];
    }
    for (int i = 0; i < rightArr.length; i++)
    {
      rightArr[i] = arr[k++];
    }

    // recurses with the new halves
    mergeSort(leftArr, min, mid);
    mergeSort(rightArr, mid+1, max);

    // merges the updated halves
    merge(arr, leftArr, rightArr);
}

merge(int[] arr, int[] left, int[] right)
{
    // merges the left and right arrays orderly
    // into the parent array
    int a = 0, l = 0, r = 0;
    while (l < left.length && r < right.length) 
    {
      if (left[l] < right[r]) {
        arr[a++] = left[l++];
      } else {
        arr[a++] = right[r++];
      }
    }
    while (l < left.length) 
    {
      arr[a++] = left[l++];
    }
    while (r < right.length) 
    {
      arr[a++] = right[r++];
    }
}

main() {
    int[] myArray = {8,2,5,7,0,4,1,9,3,6};
    mergeSort(myArray, 0, myArray.length-1);
}

`;

        return {
            performMergeSort: performMergeSort,
            setDetails: setDetails
        };
    })();


    var SelectionSort = (function() {
        var performSelectionSort = function() {
            var l = numRects;
            for (var i = 0; i < l-1; i++) {
                var minIndex = i;
                for (var j = i+1; j < l; j++) {
                    if (sortRectsArray[j] < sortRectsArray[minIndex]) {
                        minIndex = j;
                    }
                }
                var tmp = sortRectsArray[minIndex];
                sortRectsArray[minIndex] = sortRectsArray[i];
                sortRectsArray[i] = tmp;
                Animator.addSearchAndAnchor(i, minIndex, l-1);
            } 
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerHTML = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();

            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
            document.getElementById('tc-average').innerHTML = TimeComplexity.average;
            document.getElementById('tc-best').innerHTML = TimeComplexity.best;
            document.getElementById('space-complexity').innerHTML = spaceComplexity;
        }

        var TimeComplexity = {
            worst: 'O(n<sup>2</sup>)',
            average: 'O(n<sup>2</sup>)',
            best: 'O(n<sup>2</sup>)'
        }

        var spaceComplexity = 'O(1)';

        var exampleCode = 
`
selectionSort(int[] arr)
{
    // loops len - 1 times
    int len = arr.length;
    for (int i = 0; i < len-1; i++) 
    {
        int minIndex = i;
        // searches for the smallest element
        for (int j = i+1; j < len; j++) 
        {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        // swaps arr[i] and arr[minIndex]
        int tmp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = tmp;
    }
}

main() {
    int[] myArray = {8,2,5,7,0,4,1,9,3,6};
    selectionSort(myArray);
}

`;

        return {
            performSelectionSort: performSelectionSort,
            setDetails: setDetails
        };
    })();


    var QuickSort = (function() {

        var performQuickSort = function() {
            quickSort(sortRectsArray, 0, numRects-1);
        }

        var quickSort = function(arr, min, max) {
            if (min >= max) {
                return;
            }
            var partitionIndex = partition(arr, min, max);
            quickSort(arr, min, partitionIndex-1);
            quickSort(arr, partitionIndex+1, max);
        }

        var partition = function(arr, min, max) {
            var pivot = arr[max];
            var i = min;
            for (var j = min; j < max; j++) {
                if (arr[j] < pivot) {
                    var tmp = sortRectsArray[i];
                    sortRectsArray[i] = sortRectsArray[j];
                    sortRectsArray[j] = tmp;
                    Animator.addPartitionSwap(i, j, false);
                    i++;
                }
            }

            var tmp = sortRectsArray[i];
            sortRectsArray[i] = sortRectsArray[max];
            sortRectsArray[max] = tmp;
            Animator.addPartitionSwap(i, max, true);

            Animator.addPartition(min, max, max);
            return (i);
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerHTML = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();

            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
            document.getElementById('tc-average').innerHTML = TimeComplexity.average;
            document.getElementById('tc-best').innerHTML = TimeComplexity.best;
            document.getElementById('space-complexity').innerHTML = spaceComplexity;
        }

        var TimeComplexity = {
            worst: 'O(n<sup>2</sup>)',
            average: 'O(n&#8226log(n))',
            best: 'O(n&#8226log(n))'
        }

        var spaceComplexity = 'O(log(n))';

        var exampleCode = 
`
quickSort(int[] arr, int min, int max)
{
    // stops the recursion
    if (min >= max) {
        return;
    }

    // returns the partition index. the element
    // at this index is in the correct spot
    int partitionIndex = partition(arr, min, max);

    // recurses using the subsections to the
    // left and right of the partition index
    quickSort(arr, min, partitionIndex-1);
    quickSort(arr, partitionIndex+1, max);
}

partition(int[] arr, int min, int max)
{
    // picks the last element as the pivot
    // NOTE: There are other methods to choose
    //       an optimal pivot
    int pivot = arr[max];
    int i = min;

    // searches for elements smaller than the pivot
    for (int j = min; j < max; j++) 
    {
        if (arr[j] < pivot) {
            // swaps arr[i] and arr[j]
            int tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
            i++;
        }
    }
    
    // swaps the element at arr[i] 
    // and the pivot at arr[max]
    int tmp = arr[i];
    arr[i] = arr[max];
    arr[max] = tmp;

    // returns the partition index
    return i;
}

main() {
    int[] myArray = {8,2,5,7,0,4,1,9,3,6};
    quickSort(myArray);
}

`;

        return {
            performQuickSort: performQuickSort,
            setDetails: setDetails
        };
    })();


    var InsertionSort = (function() {

        var performInsertionSort = function() {
            var len = sortRectsArray.length;
            for (var i = 1; i < len; i++) {
                var key = sortRectsArray[i];
                j = i - 1;
                Animator.addKeyIndex(i);

                while (j >= 0 && sortRectsArray[j] > key) {
                    sortRectsArray[j+1] = sortRectsArray[j];
                    Animator.addInsertionSwap(j, j+1);
                    j--;
                }
                sortRectsArray[j+1] = key;
            }
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerHTML = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();

            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
            document.getElementById('tc-average').innerHTML = TimeComplexity.average;
            document.getElementById('tc-best').innerHTML = TimeComplexity.best;
            document.getElementById('space-complexity').innerHTML = spaceComplexity;
        }

        var TimeComplexity = {
            worst: 'O(n<sup>2</sup>)',
            average: 'O(n<sup>2</sup>)',
            best: 'O(n)'
        }

        var spaceComplexity = 'O(1)';

        var exampleCode = 
`
insertionSort(int[] arr)
{
    // starts at index 1
    int len = arr.length;
    for (int i = 1; i < len; i++)
    {
        // the current element to position
        int key = arr[i];
        int j = i - 1;
        
        // moves all elements forward until the
        // key element's spot is found 
        while (j >= 0 && arr[j] > key) 
        {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
}

main() {
    int[] myArray = {8,2,5,7,0,4,1,9,3,6};
    selectionSort(myArray);
}

`;

        return {
            performInsertionSort: performInsertionSort,
            setDetails: setDetails
        };
    })();


    var HeapSort = (function() {

        var performHeapSort = function() {
            buildMaxHeap(sortRectsArray);
            var len = sortRectsArray.length;
            for (var i = len - 1; i >= 0; i--) {
                // swaps arr[0] and arr[i]
                var tmp = sortRectsArray[0];
                sortRectsArray[0] = sortRectsArray[i];
                sortRectsArray[i] = tmp;
                Animator.addHeapSwap(0, i, false);

                maxHeapify(sortRectsArray, i, 0);
            }
        }
        var buildMaxHeap = function(arr) {
            var n = arr.length;
            var start = Math.ceil(n / 2) - 1;
            for (var i = start; i >= 0; i--) {
                maxHeapify(arr, n, i);
            }
        }
        var maxHeapify = function(arr, n, i) {
            var largest = i;
            var l = 2*i + 1;
            var r = 2*i + 2;

            if (l < n && arr[l] > arr[largest]) {
                largest = l;
            }

            if (r < n && arr[r] > arr[largest]) {
                largest = r;
            }

            if (largest != i) {
                // swaps arr[i] and arr[largest]
                var tmp = arr[i];
                arr[i] = arr[largest];
                arr[largest] = tmp;
                Animator.addHeapSwap(i, largest, true);

                // Recursively heapify its changed child sub-tree
                maxHeapify(arr, n, largest);
            }
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerHTML = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();

            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
            document.getElementById('tc-average').innerHTML = TimeComplexity.average;
            document.getElementById('tc-best').innerHTML = TimeComplexity.best;
            document.getElementById('space-complexity').innerHTML = spaceComplexity;
        }

        var TimeComplexity = {
            worst: 'O(n&#8226log(n))',
            average: 'O(n&#8226log(n))',
            best: 'O(n&#8226log(n))'
        }

        var spaceComplexity = 'O(1)';

        var exampleCode = 
`
heapSort(int[] arr)
{
    // create the max-heap
    buildMaxHeap(arr);

    // loop the array backwards
    int len = arr.length;
    for (int i = len - 1; i >= 0; i--)
    {
        // swap arr[0] and arr[i]
        int tmp = arr[0];
        arr[0] = arr[i];
        arr[i] = tmp;

        // heapifies the remaining unsorted elements
        maxHeapify(arr, i, 0);
    }
}

buildMaxHeap(int[] arr)
{
    // builds a Binary Max-Heap with the given array
    int len = arr.length;
    int start = len / 2 - 1; // round up
    for (int i = start; i >= 0; i--)
    {
        maxHeapify(arr, len, i);
    }
}

maxHeapify(int[] arr, int len, int i)
{
    int largest = i; // parent
    int l = 2 * i + 1; // left child
    int r = 2 * i + 2; // right child

    // finds the larger element between
    // the parent and its two children
    if (l < n && arr[l] > arr[largest]) {
        largest = l;
    }

    if (r < n && arr[r] > arr[largest]) {
        largest = r;
    }

    // when the larger element is not the parent
    if (largest != i) {
        // swaps arr[i] and arr[largest]
        int tmp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = tmp;

        // recursively heapifies the subtree
        // below the current parent
        maxHeapify(arr, n, largest);
    }
}

main() {
    int[] myArray = {8,2,5,7,0,4,1,9,3,6};
    heapSort(myArray);
}

`;

        return {
            performHeapSort: performHeapSort,
            setDetails: setDetails
        };
    })();


    return {
        BubbleSort: BubbleSort,
        MergeSort: MergeSort,
        SelectionSort: SelectionSort,
        QuickSort: QuickSort,
        InsertionSort: InsertionSort,
        HeapSort: HeapSort
    };

})();
