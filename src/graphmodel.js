
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

    history(source) {
        let set = new Set()
        this.collectHistory(set, [source])
        return set
    }

    collectHistory(set, graphIds) {
        if (graphIds.length == 0)
            return

        graphIds.forEach(graphId => set.add(graphId))
        graphIds
            .map(graphId => this._g.predecessors(graphId))
            .forEach((parents) => {
                this.collectHistory(set, parents)
            })
    }

    node(id) {
        return this._g.node(id)
    }

    get nodes() {
        if (this._renderedNodes === undefined) {
            dagre.layout(this._g)
            this._renderedNodes = this._g.nodes().map(nodeId => {
                return this._g.node(nodeId).render()
            })
        }
        return this._renderedNodes
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