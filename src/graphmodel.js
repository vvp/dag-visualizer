const dagre = require('dagre')

class Layout {
    _g
    items = []

    constructor() {
        this._g = new dagre.graphlib.Graph()
        this._g.setGraph({marginx: 50, marginy: 50, rankdir: 'TB', align: 'UL'})
        this._g.setDefaultEdgeLabel(() => {})
    }

    addNode(dagNode) {
        this.items.push(dagNode)
        dagNode.graphid = '#' + this.items.length
        dagNode.index = this.items.length
        this._g.setNode(dagNode.graphid, dagNode)
    }

    addEdge(source, target, edgeType) {
        this._g.setEdge(source.graphid, target.graphid, {edgeType: edgeType})
    }

    resizeNodes(size) {
        this._g.nodes().forEach(nodeId => {
            let node = this._g.node(nodeId)
            node.width = size
            node.height = size
        })
    }

    get nodes() {
        dagre.layout(this._g)
        return this._g.nodes().map(nodeId => {
            return this._g.node(nodeId).render()
        })
    }

    get edges() {
        return this._g.edges().map(edgeId => {
            let graphEdge = this._g.edge(edgeId)
            return {
                type: graphEdge.edgeType,
                points: graphEdge.points,
                ui: {
                    color: this._g.node(edgeId.w).ui.bg
                }
            }
        })
    }
}

module.exports = Layout