var Graph = (function() {
    
    // Models a Vertex
    var Vertex = class {
        constructor(node) {
            this.node = node;
            this.adjList = [];

            //Used for A* Search
            this.GCost = 0;
            this.HCost = 0;
            this.FCost = function() { return this.GCost + this.HCost; }
        }
    }

    // Models an Edge
    var Edge = class {
        constructor(source, destination) {
            this.source = source;
            this.destination = destination;
        }
    }

    // A HashTable containing all Verticies from each Nod
    var vertexMap = new Map();

    // Adds a new Vertex to the Map with a Node as the Key
    var addVertex = function(key) {
        vertexMap.set(key, new Vertex(key));
    }

    // Creates an Edge using the source and destination Key
    var addEdge = function(sourceKey, destinationKey) {
        var source = vertexMap.get(sourceKey);
        var destination = vertexMap.get(destinationKey);
        if (destination == undefined) {
            destination = new Vertex(destination);
        }
        source.adjList.push(destination);
    }

    // Disconnects the given Vertex from all other Neighbors
    var disconnectVertex = function(vertex) {
        for (var i = 0; i < vertex.adjList.length; i++) {
            for (var j = 0; j < vertex.adjList[i].adjList.length; j++) {
                if (vertex.adjList[i].adjList[j] == vertex) {
                    vertex.adjList[i].adjList.splice(j, 1);
                }
            }
        }
    }

    // Reconnects the given Vertex to its Neighbors
    var reconnectVertex = function(vertex) {
        // Refreshes the AdjList of all Neighbors of Vertex
        var refreshAdjList = function(v) {
            var vx = v.node.posX;
            var vy = v.node.posY;
            v.adjList = [];
            if (vy-1 >= 0) {
                var n = NodeHandler.getNodeAt(vx, vy-1);
                if (n.nodeType != NODE_TYPES.WALL) {
                    v.adjList.push(getVertex(n));
                }
            }
            if (vx+1 < GRID_SIZE_X) {
                var n = NodeHandler.getNodeAt(vx+1, vy);
                if (n.nodeType != NODE_TYPES.WALL) {
                    v.adjList.push(getVertex(n));
                }
            }
            if (vy+1 < GRID_SIZE_Y) {
                var n = NodeHandler.getNodeAt(vx, vy+1);
                if (n.nodeType != NODE_TYPES.WALL) {
                    v.adjList.push(getVertex(n));
                }
            }
            if (vx-1 >= 0) {
                var n = NodeHandler.getNodeAt(vx-1, vy);
                if (n.nodeType != NODE_TYPES.WALL) {
                    v.adjList.push(getVertex(n));
                }
            }
        }
        // Updates all Neigbors of Vertex
        // And updates Vertex's adjlist
        var x = vertex.node.posX;
        var y = vertex.node.posY;
        vertex.adjList = [];
        if (y-1 >= 0) {
            var n = NodeHandler.getNodeAt(x, y-1);
            if (n.nodeType != NODE_TYPES.WALL) {
                vertex.adjList.push(getVertex(n));
            }
            refreshAdjList(getVertex(n));
        }
        if (x+1 < GRID_SIZE_X) {
            var n = NodeHandler.getNodeAt(x+1, y);
            if (n.nodeType != NODE_TYPES.WALL) {
                vertex.adjList.push(getVertex(n));
            }
            refreshAdjList(getVertex(n));
        }
        if (y+1 < GRID_SIZE_Y) {
            var n = NodeHandler.getNodeAt(x, y+1);
            if (n.nodeType != NODE_TYPES.WALL) {
                vertex.adjList.push(getVertex(n));
            }
            refreshAdjList(getVertex(n));
        }
        if (x-1 >= 0) {
            var n = NodeHandler.getNodeAt(x-1, y);
            if (n.nodeType != NODE_TYPES.WALL) {
                vertex.adjList.push(getVertex(n));
            }
            refreshAdjList(getVertex(n));
        }
    }
    
    // Resets the Graph
    var clearGraph = function() {
        vertexMap.clear();
    }

    // Returns the Vertex from the given Key
    var getVertex = function(key) {
        return vertexMap.get(key);
    }

    // Resets A* cost values
    var resetCostValues = function() {
        vertexMap.forEach(function(value, key, vertexMap) {
            value.GCost = 0;
            value.HCost = 0;
        });
    }

    // Returns all Vertices from the vertexMap
    var getAllVerticesIterator = function() {
        return vertexMap.values();
    }

    return {
        addVertex: addVertex,
        addEdge: addEdge,
        disconnectVertex: disconnectVertex,
        reconnectVertex: reconnectVertex,
        clearGraph: clearGraph,
        getVertex: getVertex,
        resetCostValues: resetCostValues,
        getAllVerticesIterator: getAllVerticesIterator
    };

})();
