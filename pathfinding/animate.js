// Animates the Pathfinding Algorithms
var Animate = (function() {

    var finishedLoop = function() {
        CURRENT_STATE = STATES.READY;
    }

    // Adds a search vertex to the search queue
    var addSearchNode = function(node) {
        FSSearchQueue.enqueue(node);
        if (FSSearchQueue.getLength() == 1) {
            startPathfindLoop();
        }
    }

    // Adds a path vertex to the path queue
    var addFinalPathNode = function(node) {
        if (node == null) {
            finishedLoop();
            return;
        }
        FSFinalPathQueue.enqueue(node);
    }

    // Begins the First Serach Loop
    var startPathfindLoop = function() {
        // Controls the Change in Path Speed
        var pathSpeedAtStart = currentPathSpeed;
        var getTickRate = function() {
            return (currentPathSpeed < MAX_PATH_SPEED) ? (250 / currentPathSpeed) : 10;
        }

        // Main Function
        var node = null;
        var loopFunc = function() {
            // Quits when reached End or State changed
            if ((FSFinalPathQueue.getLength() == 0 && FSSearchQueue.getLength() == 0) ||
                CURRENT_STATE != STATES.PATHFINDING) {
                clearInterval(FSLoop);
                CURRENT_STATE = STATES.READY;
                return;
            }
            // Checks if Path Speed changed
            if (pathSpeedAtStart != currentPathSpeed) {
                pathSpeedAtStart = currentPathSpeed;
                clearInterval(FSLoop);
                FSLoop = setInterval(loopFunc, getTickRate());
            }
            // Updates the Search Elements
            if (FSSearchQueue.getLength() > 0) {
                if (node != null) {
                    node.element.style.background = SEARCH_SOFT_COLOR;
                }
                node = FSSearchQueue.dequeue();
                if (!FSSearchQueue.isEmpty()) {
                    node.element.style.background = SEARCH_HARD_COLOR;
                } else {
                    node.element.style.background = SEARCH_SOFT_COLOR;
                    node = null;
                }
            }
            // Updates the Path Elements
            else if (FSFinalPathQueue.getLength() > 0) {
                if (node != null) {
                    node.element.style.background = PATH_SOFT_COLOR;
                }
                node = FSFinalPathQueue.dequeue();
                if (!FSFinalPathQueue.isEmpty()) {
                    node.element.style.background = PATH_HARD_COLOR;
                } else {
                    node.element.style.background = PATH_SOFT_COLOR;
                    node = null;
                }
            }
        }
        var FSLoop = setInterval(loopFunc, getTickRate());
    }


    return {
        addSearchNode: addSearchNode,
        addFinalPathNode: addFinalPathNode
    };

})();
