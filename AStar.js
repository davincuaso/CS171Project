var astar = (function () {

    function Node(parent, x, y, manhattenDistance) {
        this.parent = parent;

        this.x = x;
        this.y = y;

        this.g = parent ? parent.g + 1 : 0;
        this.h = manhattenDistance;
        this.f = this.g + this.h;
    }

    function checkForCollision(map, x, y) {
        var tile = map.getTile(x, y);
        return tile == 1; // TODO this requires "map knowledge"
    }

    function manhattenDistance(x, y, endPosition) {
        return Math.abs(x - endPosition.x) + Math.abs(y - endPosition.y);
    }

    function getAdjacentSquares(map, startPosition, endPosition) {
        let nodes = [];

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const posX = startPosition.x + x;
                const posY = startPosition.y + y;

                if ((x == 0 && y == 0) || (x != 0 && y != 0)) {
                    continue;
                } else if (posX < map.cols && posY < map.rows && posX >= 0 && posY >= 0 && !checkForCollision(map, posX, posY)) {
                    nodes.push(new Node(startPosition, posX, posY, manhattenDistance(posX, posY, endPosition)));
                }
            }
        }

        return nodes;
    }

    function nodeWithLowestFScore(nodes) {
        let lowestScore;

        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];

            if (!lowestScore) {
                lowestScore = node;
            }

            lowestScore = lowestScore.f < node.f ? lowestScore : node;
        }

        return lowestScore;
    }

    function doesListContainNode(node, closedList) {
        for (let i = 0; i < closedList.length; i++) {
            let item = closedList[i];
            if (item.x == node.x && item.y == node.y) {
                return true;
            }
        }

        return false;
    }

    function updateNode(node, nodes) {
        for (let i = 0; i < nodes.length; i++) {
            let item = nodes[i];
            if (item.x == nodes.x && item.y == nodes.y) {
                item.parent = node;
                item.h = node.h;
            }
        }
    }

    function flattenGraph(nodes) {

        var flattenedNodes = [];

        var currentNode = nodes;
        while (currentNode != null) {
            flattenedNodes.push(currentNode)
            currentNode = currentNode.parent;
        }

        return flattenedNodes;
    }

    function search(map, startPos, endPos) {
        let closedList = [];
        let openList = [];

        let endPosition = new Node(null, endPos.x, endPos.y, 0);
        let startPosition = new Node(null, startPos.x, startPos.y, manhattenDistance(startPos.x, startPos.y,
            endPosition));

        closedList.push(startPosition);
        openList = getAdjacentSquares(map, startPosition, endPosition);
        let node = null;
        while (openList.length > 0) {
            node = nodeWithLowestFScore(openList);

            // found it!
            if (node.h === 0) {
                return flattenGraph(node).reverse();
            }

            var index = openList.indexOf(node);
            if (index == -1) {
                alert("que?");
            }

            openList.splice(index, 1);
            closedList.push(node);

            let neighbours = getAdjacentSquares(map, node, endPosition);
            for (var i = 0; i < neighbours.length; i++) {
                let neighbour = neighbours[i];

                if (doesListContainNode(neighbour, closedList)) {
                    continue;
                }

                if (!doesListContainNode(neighbour, openList)) {
                    openList.push(neighbour);
                } else if (neighbour.f < node.f) {
                    // update the parent and h score of the node in the open list
                    updateNode(neighbour, openList);
                }
            }
        }
    }

    return {
        search: search
    }
})();