var PathFinder = (function() {

    // Holds the Path of the last run Algorithm
    var lastPath = [];

    // Clears the Nodes from the Last Path
    var clearLastPath = function() {
        for (var i = 0; i < lastPath.length; i++) {
            var v = lastPath[i];
            if (v.node.nodeType == NODE_TYPES.FREE) {
                v.node.element.style.background = FREE_NODE_COLOR;
            }
        }
        lastPath = [];
    }


    var BreadthFirstSearch = (function() {
        var performBFS = function(source, destination) {
            // Uses a Map to store the Previously visited Verticies
            var path = new Map();
            // Uses a Queue to order the Vertex visitation
            var Q = new DataStructures.Queue();

            // Sets the Initial Vertex (aka Source)
            path.set(source, null);
            Q.enqueue(source);
            // Loops until the Queue is empty
            while (!Q.isEmpty()) {
                // Gets the next Vertex to process from the Queue
                var vertex = Q.dequeue();
                // Found the destination
                if (vertex == destination) {
                    var prev = path.get(destination);
                    // Quits the animation loop
                    if (prev == source) { Animate.addFinalPathNode(null); }
                    // Traces back through the final path
                    while (prev != source) {
                        if (prev == undefined) { return false; }
                        Animate.addFinalPathNode(prev.node);
                        prev = path.get(prev);
                    }
                    return true;
                }
                // Loops through the Vertex's adjacent Verticies
                for (var i = 0; i < vertex.adjList.length; i++) {
                    // Not visited
                    if (!path.has(vertex.adjList[i])) {
                        // Appends this vertex to the Queue to visit later
                        var adjVertex = vertex.adjList[i];
                        lastPath.push(adjVertex);
                        if (adjVertex != destination) {
                            Animate.addSearchNode(adjVertex.node);
                        }
                        path.set(adjVertex, vertex);
                        Q.enqueue(adjVertex);
                    }
                }
            }
            return false;
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerText = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();

            document.getElementById('details-rundown').innerHTML = rundown;
            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
        }

        var rundown = "<strong>BFS</strong> is useful for finding the shortest path in an unweighted graph.\n\nThe <strong>Breadth-First Search</strong> (<strong>BFS</strong>) algorithm traverses the graph layer by layer, starting its traversal from the source node. It explores the neighbors of the source node, then the algorithm moves to the neighbors of these neighbors. This allows the algorithm to traverse in layers (or levels) expanding outwards from the source.";

        var TimeComplexity = {
            worst: 'O(|V| + |E|)',
        }

        var exampleCode = 
`
breadthFirstSearch(Vertex source, Vertex destination) 
{
    // HashMap (dictionary) keeps track of the 
    // predecessor of each visited vertex
    HashMap<Vertex, Vertex> parentMap = new HashMap<>();

    // Queue allows a level-by-level traversal 
    Queue<Vertex> queue = new LinkedList<>();

    // adds the source as the start
    parentMap.put(source, null);
    queue.add(source);

    // loops until the queue is empty
    while(!queue.isEmpty())
    {
        // dequeues / pops 
        Vertex vertex = queue.remove();

        // checks if destination is reached
        if (vertex == destination) {
            // NOTE: parentMap can be used to
            // retrace the steps of finding 
            // the destination by looping 
            // through all its predecessors 
            retracePath(parentMap);
            return true;
        }

        // loops through all adjacent vertices 
        int len = vertex.adjacencyList.length;
        for (int i = 0; i < len; i++) 
        {
            Vertex adjVertex = vertex.adjacencyList[i];
            // ensures that it has not been visited
            if (!parentMap.containsKey(adjVertex))
            {
                // adds the adjacent vertex
                parentMap.put(adjVertex, vertex);
                queue.add(adjVertex);
            }
        }
    }
    return false;
}

`;

        return {
            performBFS: performBFS,
            setDetails: setDetails
        };

    })();


    var DepthFirstSearch = (function() {
        var performDFS = function(source, destination) {
            // Keeps track of all visited Vertices and holds the Parents
            var path = new Map();
            // Calls the Recursive Algorithm
            path.set(source, null);
            var didFind = DFSUtil(source, destination, path);
            // Did find path
            if (didFind) {
                var prev = path.get(destination);
                // Quits the animation loop
                if (prev == source) { Animate.addFinalPathNode(null); }
                // Traces back through the final path
                while (prev != source) {
                    if (prev == undefined) { return false; }
                    Animate.addFinalPathNode(prev.node);
                    prev = path.get(prev);
                }
                return true;
            } 
            // Did NOT find path
            else {
                return false;
            }
        }

        // DFS Helper
        var DFSUtil = function(vertex, destination, path) {
            // Attempts each Vertex adjacent to the parent Vertex
            for (var i = 0; i < vertex.adjList.length; i++) {
                var newVertex = vertex.adjList[i];
                // Checks to make sure Vertex has not been visited
                if (!path.has(newVertex)) {
                    path.set(newVertex, vertex);
                    // Found the Destination
                    if (newVertex == destination) {
                        return true;
                    }
                    lastPath.push(newVertex);
                    Animate.addSearchNode(newVertex.node);
                    if (DFSUtil(newVertex, destination, path)) {
                        return true;
                    }
                }
            }
            return false;
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerText = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();
            
            document.getElementById('details-rundown').innerHTML = rundown;
            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
        }

        var rundown = "<strong>DFS</strong> is useful for finding a path in a wide and complex unweighted graph. <strong>DFS</strong> does <u>NOT</u> find the shortest path.\n\nThe <strong>Depth-First Search</strong> (<strong>DFS</strong>) algorithm traverses as deep as possible in one direction, then it backtracks and attempts a different direction once it hits a dead end. This movement allows the algorithm to reach obscure depths in quick successions.";

        var TimeComplexity = {
            worst: 'O(|V| + |E|)',
        }

        var exampleCode = 
`
depthFirstSearch(Vertex source, Vertex destination) 
{
    // HashMap (dictionary) keeps track of the
    // predecessors of the visited vertices
    HashMap<Vertex> parentMap = new HashMap<>();

    // adds the source as the start
    parentMap.put(source, null);

    // recurses DFS
    recDFS(source, destination, parentMap);
}

recDFS(Vertex vertex, Vertex destination, 
        HashMap<Vertex> parentMap)
{
    // loops through all adjacent vertices
    int len = vertex.adjacencyList.length;
    for (int i = 0; i < len; i++) 
    {
        Vertex adjV = vertex.adjacencyList[i];
        // ensures it has not been visited
        if (!parentMap.containsKey(adjV)) 
        {
            // adds the adjacent vertex
            parentMap.put(adjV, vertex);

            // checks if destination is reached
            if (adjVertex == destination) {
                // NOTE: parentMap can be used to 
                // retrace the steps of finding the 
                // destination 
                retracePath(parentMap);
                return true;
            }

            // recurses with the adjacent vertex
            if (recDFS(adjV, destination, parentMap)) {
                return true;
            }
        }
    }
    return false;
}

`;
        
        return {
            performDFS: performDFS,
            setDetails: setDetails
        };

    })();


    var AStarSearch = (function() {
        var performAStarSearch = function(source, destination) {
            Graph.resetCostValues();
            var openList = []; // Keeps track of possible next vertices
            var closeList = []; // Keeps track of all visited vertices
            var parentMap = new Map(); // Keeps track of the predecessors

            // Adds the source as the start node
            openList.push(source);
            parentMap.set(source, null);

            // loops until the openList is empty
            while (openList.length != 0) {
                // The vertex with the lowest F cost
                var vertex = openList[0];
                for (var i = 0; i < openList.length; i++) {
                    if (openList[i].FCost() < vertex.FCost()) {
                        vertex = openList[i];
                    }
                }
                openList.splice(openList.indexOf(vertex), 1);
                closeList.push(vertex);

                // Animates
                if (vertex != source && vertex != destination) {
                    lastPath.push(vertex);
                    Animate.addSearchNode(vertex.node);
                }

                // Found the destination
                if (vertex == destination) {
                    var prev = parentMap.get(destination);
                    // Quits the animation loop
                    if (prev == source) { Animate.addFinalPathNode(null); }
                    // Traces back through the final path
                    while (prev != source) {
                        if (prev == undefined) { return false; }
                        Animate.addFinalPathNode(prev.node);
                        prev = parentMap.get(prev);
                    }
                    return true;
                }

                // Loops through all of vertex's neighbors
                for (var i = 0; i < vertex.adjList.length; i++) {
                    var newVertex = vertex.adjList[i];
                    // Ensures it is not already in the closeList
                    if (!closeList.includes(newVertex)) {
                        var isInOpenList = openList.includes(newVertex);
                        var newGCost = vertex.GCost + 1;
                        if (!isInOpenList || newGCost < newVertex.GCost) {
                            newVertex.GCost = newGCost;
                            newVertex.HCost = getDistance(newVertex, destination);
                            // Adds / Updates this new vertex to the openList
                            parentMap.set(newVertex, vertex);
                            if (!isInOpenList) {
                                openList.push(newVertex);
                            }
                        }
                    }
                }
            }

            return false;
        }
        var getDistance = function(vertex1, vertex2) {
            // The Heuristic
            var disX = Math.abs(vertex1.node.posX - vertex2.node.posX);
            var disY = Math.abs(vertex1.node.posY - vertex2.node.posY);
            var min = Math.min(disX, disY);
            var max = Math.max(disX, disY)
            return 2 * min + max;
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerText = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();

            document.getElementById('details-rundown').innerHTML = rundown;
            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
        }

        var rundown = "<strong>A* Search</strong> is useful for finding the shortest path in a weighted graph. The shortest path is guaranteed as long as the <u>heurisitc</u> function is <u>admissible</u>.\n\nThe <strong>A* Search</strong> algorithm combines the strenghts of the Breadth-First Search and Greedy Best-First Search algorithms. It finds the shortest path and does so in a fast manner. This performance is achieved by using heuristics to guide it towards the destination. Because of this, the algorithm's performance is heavily dependent on its set heuristic.";

        var TimeComplexity = {
            worst: 'O(|V| + |E|)',
        }

        var exampleCode = 
`
aStarSearch(Vertex source, Vertex destination) 
{
    // NOTE: Each Vertex must keep track of 
    // a G value and an H value (F = G + H)
    // G: distance from the source
    // H: heuristic distance to the destination
    
    // NOTE: A Priority Queue can be used to
    // minimize the time cost of openList
    ArrayList<Vertex> openList = new ArrayList<>();

    // NOTE: A HashSet or Map can be used to
    // minimize the time cost of closeList
    ArrayList<Vertex> closeList = new ArrayList<>();

    // HashMap (dictionary) keeps track of the
    // predecessors of the visited vertices
    HashMap<Vertex, Vertex> parentMap = new HashMap<>();
    
    // adds the source as the start
    openList.add(source);
    parentMap.put(source, null);

    // loops until no element is in openList
    while (!openList.isEmpty())
    {
        // retrieves the vertex in openList with
        // the lowest F Value (F = G + H)
        Vertex vertex = openList.get(0);
        for (int i = 1; i < openList.size(); i++)
        {
            Vertex newV = openList[i];
            if (newV.FValue < vertex.FValue) {
                vertex = newV;
            }
        }

        // moves the vertex to the closeList
        openList.remove(vertex);
        closeList.add(vertex);

        // reached destination
        if (vertex == destination) {
            // NOTE: parentMap can be used to 
            // retrace the steps of finding the 
            // destination 
            retracePath(parentMap);
            return true;
        }

        // loops through all adjacent vertices
        int len = vertex.adjacencyList.length;
        for (int i = 0; i < len; i++) 
        {
            Vertex adjV = vertex.adjacencyList[i];
            // ensures it is not in closeList
            if (!closeList.contains(adjV)) 
            {
                // add the weight/cost to move
                int newGValue = adjV.GValue + 1;

                // only use this vertex if it is
                // not in openList or if its newly
                // calculated G Value is smaller
                boolean isInOpenList = 
                    openList.contains(adjV);
                if (!isInOpenList || 
                    newGValue < adjV.GValue) 
                {
                    // update new G and H values
                    adjV.GValue = newGValue;
                    adjV.HValue = 
                        getHDistance(adjV, destination);
                    // update predecessor
                    parentMap.put(adjV, vertex);
                    // add to openList if not already
                    if (!isInOpenList) {
                        openList.add(adjV);
                    }
                }
            }
        }
    }
}

getHDistance(Vertex a, Vertex b) 
{
    // NOTE: There are many heuristic
    // formulas. Each depends on the
    // movement allowed and the type
    // of graph. Always find the most
    // admissible heurisitc for the
    // situation.
    int disX = Math.abs(a.x - b.x);
    int disY = Math.abs(a.y - b.y);
    int min = Math.min(disX, disY);
    int max = Math.max(disX, disY);
    return 2 * min + max;
}

`;

        return {
            performAStarSearch: performAStarSearch,
            setDetails: setDetails
        };

    })();


    var GreedyBestFirstSearch = (function() {
        var performGreedyBestFirstSearch = function(source, destination) {
            Graph.resetCostValues();
            // Priority Queue retrieves the next closest vertex
            var open = new DataStructures.PriorityQueue();
            // Set used to check if vertex has been visited
            var closed = new Set();
            // Keeps track of all predecessors
            var parentMap = new Map();

            // Add source to the queue
            open.enqueue(source, 0);
            parentMap.set(source, null);

            while (!open.isEmpty()) {
                // Get the closest vertex (lowest H Cost)
                var vertex = open.dequeue();
                closed.add(vertex);

                // Animates
                if (vertex != source && vertex != destination) {
                    lastPath.push(vertex);
                    Animate.addSearchNode(vertex.node);
                }

                // Found the destination
                if (vertex == destination) {
                    var prev = parentMap.get(destination);
                    // Quits the animation loop
                    if (prev == source) { Animate.addFinalPathNode(null); }
                    // Traces back through the final path
                    while (prev != source) {
                        if (prev == undefined) { return false; }
                        Animate.addFinalPathNode(prev.node);
                        prev = parentMap.get(prev);
                    }
                    return true;
                }

                // Loops through neighbors
                for (var i = 0; i < vertex.adjList.length; i++) {
                    var newVertex = vertex.adjList[i];
                    // make sure it is a new vertex
                    if (!closed.has(newVertex) && !open.has(newVertex)) {
                        newVertex.HCost = getHDistance(newVertex, destination);
                        open.enqueue(newVertex, newVertex.HCost);
                        parentMap.set(newVertex, vertex);
                    }
                }
            }
            return false;
        }
        var getHDistance = function(vertex, destination) {
            // The Heuristic
            var disX = Math.abs(destination.node.posX - vertex.node.posX);
            var disY = Math.abs(destination.node.posY - vertex.node.posY);
            return disX + disY;
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerText = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();

            document.getElementById('details-rundown').innerHTML = rundown;
            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
        }

        var rundown = "<strong>Greedy Best-First Search</strong> is useful for finding <u>a</u> short path in a weighted graph. Since the algorithm is greedy, it does <u>NOT</u> guarantee the shortest path.\n\nThe <strong>Greedy Best-First Search</strong> algorithm always moves to the node that is closest to the target node. Such traversal allows the algorithm to reach the target node quickly. However, this greedy behavior makes the algorithm not complete, not optimal, which leads to paths that may not be the shortest solutions.";

        var TimeComplexity = {
            worst: 'O(|V| + |E|)',
        }

        var exampleCode = 
`
greedyBestFirstSearch(Vertex source, Vertex destination)
{
    // NOTE: Each Vertex must keep track
    // of an H value (F = H)
    // H: heuristic distance to the destination
    
    // Priority Queue retrieves the next vertex
    // with the lowest H value
    Queue<Vertex> pq = new PriorityQueue<>(
        (v1, v2) -> Integer.compare(v1.HValue, v2.HValue)
    );

    // HashSet holds all previously visited vertices
    HashSet<Vertex> visited = new HashSet<>();

    // HashMap (dictionary) keeps track of the
    // predecessors of the visited vertices
    HashMap<Vertex, Vertex> parentMap = new HashMap<>();
    
    // adds the source as the start
    pq.add(source);
    parentMap.put(source, null);
    
    // loops until pq is empty
    while (!pq.isEmpty()) 
    {
        // dequeues / pops
        Vertex vertex = pq.poll();

        // marks the vertes as visited
        visited.add(vertex);
        
        // reached the destination
        if (vertex == destination) {
            // NOTE: parentMap can be used to 
            // retrace the steps of finding the 
            // destination 
            retracePath(parentMap);
            return true;
        }
        
        // loops through all adjacent vertices
        int len = vertex.adjacencyList.length;
        for (int i = 0; i < len; i++) 
        {
            Vertex adjV = vertex.adjacencyList[i];
            // ensures it is not visited and it is 
            // not already in the priority queue
            if (!visited.contains(adjV) && 
                !pq.contains(adjV))
            {
                // calculates its heuristic value
                adjV.HValue = 
                    getHDistance(adjV, destination);
                pq.add(adjV);
                parentMap.put(adjV, vertex);
            }
        }
    }
    return false;
}

getHDistance(Vertex a, Vertex b) 
{
    // NOTE: There are many heuristic
    // formulas. Each depends on the
    // movement allowed and the type
    // of graph. Always find the most
    // admissible heurisitc for the
    // situation.
    int disX = Math.abs(a.x - b.x);
    int disY = Math.abs(a.y - b.y);
    return disX + disY;
}

`;

        return {
            performGreedyBestFirstSearch: performGreedyBestFirstSearch,
            setDetails: setDetails
        };

    })();


    var BellmanFord = (function() {
        var performBellmanFord = function(source, destination) {
            // Converts the vertex map to an array
            var vIt = Graph.getAllVerticesIterator();
            var v = vIt.next();
            var vertexArray  = [];
            while (!v.done) {
                vertexArray.push(v.value);
                v = vIt.next();
            }
            
            // Distance from the source
            var distanceMap = new Map();
            // Keeps track of predecessors
            var parentMap = new Map();


            // Step 1: Initialize the distance of all other Vertices as INFINITY
            for (var i = 0; i < vertexArray.length; i++) {
                distanceMap.set(vertexArray[i], Number.POSITIVE_INFINITY);
            }

            // Set the distace of the source as 0
            distanceMap.set(source, 0);

            // Step 2: Relaxes all Edges V - 1 times (where V is the total number of Vertices)
            // Relaxing: attempting to lower the cost of getting to a Vertex by attempting different Vertices
            // V - 1 times is because the longest (worst case) possible path to get to the destination is V - 1 traversals
            for (var i = 0; i < vertexArray.length-1; i++) {
                for (var j = 0; j < vertexArray.length; j++) {
                    var vertex = vertexArray[j];
                    for (var k = 0; k < vertex.adjList.length; k++) {
                        var adjV = vertex.adjList[k];
                        if (distanceMap.get(vertex) + 1 < distanceMap.get(adjV)) {
                            // Animates
                            if (adjV != destination) {
                                Animate.addSearchNode(adjV.node);
                                lastPath.push(adjV);
                            }
                            distanceMap.set(adjV, distanceMap.get(vertex) + 1);
                            parentMap.set(adjV, vertex);
                        }
                    }
                }
            }

            // Step 3: Check for any Negative Weight Cycles
            // If a shorter path is found, then it means there is a negative wieght cycle
            for (var i = 0; i < vertexArray.length; i++) {
                var vertex = vertexArray[i];
                for (var j = 0; j < vertex.adjList.length; j++) {
                    var adjV = vertex.adjList[j];
                    if (distanceMap.get(vertex) + 1 < distanceMap.get(adjV)) {
                        console.log('Negative Weight Cycle Detected!');
                        return false;
                    }
                }
            }

            // Checks if path to destination was found
            if (parentMap.get(destination) != undefined) {
                var prev = parentMap.get(destination);
                // Quits the animation loop
                if (prev == source) { Animate.addFinalPathNode(null); }
                // Traces back through the final path
                while (prev != source) {
                    if (prev == undefined) { return false; }
                    Animate.addFinalPathNode(prev.node);
                    prev = parentMap.get(prev);
                }
                return true;
            }
            return false;
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerText = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();

            document.getElementById('details-rundown').innerHTML = rundown;
            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
        }

        var rundown = "<strong>Bellman-Ford</strong> is useful for finding the shortest path in a weighted graph. The algorithm can be used with <u>negative weights</u> and can also detect negative weight <u>cycles</u>.\n\nThe <strong>Bellman-Ford</strong> algorithm calculates the shortest path from the source node to all other reachable nodes. The algorithm performs a relaxation process with all nodes to constantly update them with better paths. The algorithm is similar to Dijkstra's algorithm, but it can run with negative weights and is <u>NOT</u> greedy. However, the algorithm is slower than Dijkstra's algorithm.";

        var TimeComplexity = {
            worst: 'O(|V| &#8226 |E|)',
        }

        var exampleCode = 
`
bellmanFord(Vertex source, Vertex destination)
{
    // Holds all Vertices in the Graph
    Vertex[] vertices = Graph.getAllVertices();
    
    // Tracks the Distance Cost of all Vertices
    HashMap<Vertex, Integer> distanceMap = 
                                        new HashMap<>();

    // HashMap (dictionary) keeps track of the
    // predecessors of the visited vertices
    HashMap<Vertex, Vertex> parentMap = new HashMap<>();

    // Step 1: Initialize the Distance of all Vertices
    // to INFINITY or MAX_VALUE
    for (int i = 0; i < vertices.length; i++)
    {
        distanceMap.put(vertices[i], Integer.MAX_VALUE);
    }

    // set the Source's Distance to 0
    distanceMap.put(source, 0);

    // Step 2: Relaxes all Edges V - 1 times
    // NOTE: V - 1 times because the worst case
    // path to the destination is V - 1 traversals
    // NOTE: Relaxing attempts to lower the cost 
    // of getting to a Vertex by using other Vertices
    int V = vertices.length;
    int E = edges.length;
    for (int i = 0; i < V - 1; i++)
    {
        // loops through all Edges
        for (int j = 0; j < V; j++) {
            Edge[] edges = vertices[j].edges;
            int E = edges.length;
            for (int k = 0; k < E; k++) {
                Vertex src = edges[k].src;
                Vertex dest = edges[k].dest;
                int weight = edges[k].weight;
                int newDistance =
                    distanceMap.get(src) + weight;
                if (newDistance < distanceMap.get(dest))
                {
                    distanceMap.put(dest, newDistance);
                }
            }
        }
    }

    // Step 3: Checks for Negative Weight Cycles
    // NOTE: If a shorter path is found, then 
    // it means there is a negative wieght cycle.
    // NOTE: Loops through all Edges one last time
    for (int j = 0; j < V; j++) {
        Edge[] edges = vertices[j].edges;
        int E = edges.length;
        for (int k = 0; k < E; k++) {
            Vertex src = edges[k].src;
            Vertex dest = edges[k].dest;
            int weight = edges[k].weight;
            int newDistance =
                distanceMap.get(src) + weight;
            if (newDistance < distanceMap.get(dest))
            {
                System.out.println("Negative Cycle");
                return false;
            }
        }
    }

    // verify if destination was ever reached
    if (parentMap.get(destination) != null) 
    {
        // NOTE: parentMap can be used to 
        // retrace the steps of finding the 
        // destination 
        retracePath(parentMap);
        return true;
    }
    return false;
}

`;

        return {
            performBellmanFord: performBellmanFord,
            setDetails: setDetails
        };

    })();


    var Dijkstras = (function() {
        var performDijkstras = function(source, destination) {
            // Converts the vertex map to an array
            var vIt = Graph.getAllVerticesIterator();
            var v = vIt.next();
            var vertexArray  = [];
            while (!v.done) {
                vertexArray.push(v.value);
                v = vIt.next();
            }

            // Priority Queue to get the Vertex with the lowest Distance
            var pq = new DataStructures.PriorityQueue();
            // Holds each Vertex's Distance
            var distanceMap = new Map();
            // Keeps track of all visited Vertices
            var visited = new Set();
            // Keeps track of predecessors
            var parentMap = new Map();

            // Sets all Distances to INFINITY
            for (var i = 0; i < vertexArray.length; i++) {
                distanceMap.set(vertexArray[i], Number.POSITIVE_INFINITY);
            }
            // Ensures that source's Distance stays at 0
            distanceMap.set(source, 0);

            pq.enqueue(source, distanceMap.get(source)); // should be 0
            while (!pq.isEmpty()) {
                // pops and adds the Vertex to the visisted set
                var vertex = pq.dequeue();
                visited.add(vertex);

                // Found destination
                if (vertex == destination) {
                    var prev = parentMap.get(destination);
                    // Quits the animation loop
                    if (prev == source) { Animate.addFinalPathNode(null); }
                    // Traces back through the final path
                    while (prev != source) {
                        if (prev == undefined) { return false; }
                        Animate.addFinalPathNode(prev.node);
                        prev = parentMap.get(prev);
                    }
                    return true;
                }

                // Loops all neighbors
                for (var i = 0; i < vertex.adjList.length; i++) {
                    var newVertex = vertex.adjList[i];
                    if (!visited.has(newVertex)) {
                        // If the new Distance is less than its current Distance
                        if (distanceMap.get(vertex) + 1 < distanceMap.get(newVertex)) {
                            // Animates
                            if (newVertex != destination) {
                                Animate.addSearchNode(newVertex.node);
                                lastPath.push(newVertex);
                            }
                            // Updates the Distance in the pq
                            pq.remove(newVertex);
                            distanceMap.set(newVertex, distanceMap.get(vertex) + 1);
                            pq.enqueue(newVertex, distanceMap.get(newVertex));
                            // Updates the parent
                            parentMap.set(newVertex, vertex);
                        }
                    }
                }
            }
            return false;
        }

        var setDetails = function() {
            var codePre = document.getElementById('example-code');
            codePre.innerText = exampleCode;
            codePre.classList.remove('prettyprinted');
            PR.prettyPrint();

            document.getElementById('details-rundown').innerHTML = rundown;
            document.getElementById('tc-worst').innerHTML = TimeComplexity.worst;
        }

        var rundown = "<strong>Dijkstra's</strong> algorithm is useful for finding the shortest path in a weighted graph. The algorithm can only use <u>positive weights</u> and is a greedy algorithm.\n\n<strong>Dijkstra's</strong> algorithm continuously calculates the lowest cost (shortest distance) of all possible nodes in the path, starting from the source node. The algorithm runs faster than the Bellman-Ford algorithm because it excludes nodes that may be of higher cost (longer distances). Although this behavior is greedy, the algorithm takes local optimal steps to produce a global optimal solution.";

        var TimeComplexity = {
            worst: 'O(|V|&#8226log(|V|) + |E|)',
        }

        var exampleCode = 
`
dijkstras()
{
    // Holds all Vertices in the Graph
    Vertex[] vertices = Graph.getAllVertices();

    // Priority Queue retrieves the next Vertex
    // with the lowest Cost
    Queue<Vertex> pq = new PriorityQueue<>(
        (v1, v2) -> Integer.compare(v1.Cost, v2.Cost)
    );

    // HashSet keeps track of the visited vertices
    HashSet<Vertex> visited = new HashSet<>();

    // HashMap (dictionary) keeps track of the
    // predecessors of the visited vertices
    HashMap<Vertex, Vertex> parentMap = new HashMap<>();

    // Initializes all Vertices' Cost to
    // INFINITY or MAX_VALUE
    for (int i = 0; i < vertices.length; i++)
    {
        if (vertices[i] != source) {
            vertices[i].Cost = Integer.MAX_VALUE;
        }
    }
    // the source's Cost should stay at 0
    source.Cost = 0;

    // adds the source as the start
    pq.add(source);
    parentMap.put(source, null);

    // loops until pq is empty
    while (!pq.isEmpty())
    {
        // dequeues / pops
        Vertex vertex = pq.remove();
        // adds the Vertex to the visited set
        visited.add(vertex);

        // reached the destination
        if (vertex == destination)
        {
            // NOTE: parentMap can be used to 
            // retrace the steps of finding the 
            // destination 
            retracePath(parentMap);
            return true;
        }

        // loops through all adjacent vertices
        int len = vertex.adjacencyList.length;
        for (int i = 0; i < len; i++)
        {
            Vertex adjV = vertex.adjacencyList[i].vertex;
            int weight = vertex.adjacencyList[i].weight;
            if (!visited.contains(adjV))
            {
                // checks if the new Cost to get
                // to this vertex is less than what
                // its current Cost is
                int newCost = vertex.Cost + weight;
                if (newCost < adjV.Cost)
                {
                    // updates the cost in pq
                    pq.remove(adjV);
                    adjV.Cost = newCost;
                    pq.add(adjV);
                    // updates the parent
                    parentMap.put(adjV, vertex);
                }
            }
        }
    }
    return true;
}

`;

        return {
            performDijkstras: performDijkstras,
            setDetails: setDetails
        };

    })();


    return {
        clearLastPath: clearLastPath,
        BreadthFirstSearch: BreadthFirstSearch,
        DepthFirstSearch: DepthFirstSearch,
        AStarSearch: AStarSearch,
        GreedyBestFirstSearch: GreedyBestFirstSearch,
        BellmanFord: BellmanFord,
        Dijkstras: Dijkstras
    };

})();
