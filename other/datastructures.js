var DataStructures = (function() {

    //Created by Kate Morley - http://code.iamkate.com/
    var Queue = function(){
        var queue  = [];
        var offset = 0;

        this.getLength = function(){
            return (queue.length - offset);
        }
        this.isEmpty = function(){
            return (queue.length == 0);
        }
        this.enqueue = function(item){
            queue.push(item);
        }
        this.dequeue = function(){
            if (queue.length == 0) return undefined;
            var item = queue[offset];
            if (++offset * 2 >= queue.length){
                queue  = queue.slice(offset);
                offset = 0;
            }
            return item;
        }
        this.peek = function(){
            return (queue.length > 0 ? queue[offset] : undefined);
        }
    }

    //Created by itzbrinth - http://sitepoint.com/
    var PriorityQueue = function(){
        var collection = [];
        this.enqueue = function(item, priority){
            element = [item, priority];
            if (this.isEmpty()){ 
                collection.push(element);
            } else {
                var added = false;
                for (var i=0; i<collection.length; i++){
                     if (element[1] < collection[i][1]){ //checking priorities
                        collection.splice(i,0,element);
                        added = true;
                        break;
                    }
                }
                if (!added){
                    collection.push(element);
                }
            }
        };
        this.dequeue = function() {
            var value = collection.shift();
            return value[0];
        };
        this.remove = function(item) {
            for (var i=0; i<collection.length; i++){
                if (collection[i][0] == item){
                    collection.splice(i, 1);
                    break;
                }
            }
        };
        this.front = function() {
            return collection[0];
        };
        this.size = function() {
            return collection.length; 
        };
        this.isEmpty = function() {
            return (collection.length === 0); 
        };
        this.has = function(item) {
            for (var i=0; i<collection.length; i++) {
                if (collection[i][0] == item) return true;
            }
            return false;
        };
    }

    var MaxPriorityQueue = function(){
        var collection = [];
        this.enqueue = function(item, priority){
            element = [item, priority];
            if (this.isEmpty()){ 
                collection.push(element);
            } else {
                var added = false;
                for (var i=0; i<collection.length; i++){
                     if (element[1] > collection[i][1]){ //checking priorities
                        collection.splice(i,0,element);
                        added = true;
                        break;
                    }
                }
                if (!added){
                    collection.push(element);
                }
            }
        };
        this.dequeue = function() {
            var value = collection.shift();
            return value[0];
        };
        this.remove = function(item) {
            for (var i=0; i<collection.length; i++){
                if (collection[i][0] == item){
                    collection.splice(i, 1);
                    break;
                }
            }
        };
        this.front = function() {
            return collection[0];
        };
        this.size = function() {
            return collection.length; 
        };
        this.isEmpty = function() {
            return (collection.length === 0); 
        };
        this.has = function(item) {
            for (var i=0; i<collection.length; i++) {
                if (collection[i][0] == item) return true;
            }
            return false;
        };
    }


    return {
        Queue: Queue,
        PriorityQueue: PriorityQueue,
        MaxPriorityQueue: MaxPriorityQueue
    };

})();
