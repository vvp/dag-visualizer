const paper = require('paper')

class UI {
    _canvasId
    _labels
    _node
    _edges
    _layout

    size = 50
    labelMargin = 5

    constructor(canvasId, layout) {
        this._canvasId = canvasId
        this._layout = layout
        let canvas = document.getElementById(canvasId)
        paper.setup(canvas)

        this._edges = new paper.Layer()
        this._node = new paper.Layer()
        this._labels = new paper.Layer()
        this._highlight = new paper.Layer()

    }

    onClick(func) {
        this._onClick = func
    }

    drawLabel(graphItem, item) {
        this._labels.activate()
        let itempos = item.position

        let typeLabel = new paper.PointText({
            position: new paper.Point(itempos.x, itempos.y + 4.5),
            fontWeight: 'bold',
            justification: 'center',
            content: graphItem.type,
            fillColor: graphItem.fg,
            fontFamily: 'sans serif',
            fontSize: 14,
        })
        let nameLabel = new paper.PointText({
            position: new paper.Point(itempos.x, itempos.y - this.size / 2 - this.labelMargin),
            fontWeight: 'bold',
            justification: 'center',
            content: graphItem.name,
            fillColor: graphItem.fg,
            fontFamily: 'sans serif',
            fontSize: 14,
        })
        let labelBg = new paper.Path.Rectangle(nameLabel.strokeBounds)
        labelBg.fillColor = 'black'
        labelBg.opacity = '0.4'
        labelBg.insertBelow(nameLabel)
    }

    drawCircle(item, x, y) {
        this._node.activate()
        let c = new paper.Path.Circle(new paper.Point(x, y), this.size / 2)
        c.fillColor = item.bg

        this.drawLabel(item, c)
        return c
    }

    drawSquare(item, x, y) {
        this._node.activate()
        let rect = new paper.Rectangle()
        rect.size = new paper.Size(this.size, this.size)
        rect.center = new paper.Point(x, y)
        let square = new paper.Path.Rectangle(rect)
        square.fillColor = item.bg

        this.drawLabel(item, square)
        return square
    }

    drawNode(node) {
        switch (node.ui.shape) {
            case 'square':
                return this.drawSquare(node.ui, node.x, node.y)
            case 'circle':
                return this.drawCircle(node.ui, node.x, node.y)
            default:
                throw Error('Unsupported shape "' + node.ui.shape + "'")

        }
    }

    drawEdge(edge) {
        this._edges.activate()
        switch (edge.type) {
            case 'primary':
                return this.drawPrimaryEdge(edge)
            case 'secondary':
                return this.drawSecondaryEdge(edge)
            default:
                throw Error('Unsupported edge type "' + edge.type + "'")
        }
    }

    highlightDAG(node) {
        this._highlight.removeChildren()
        this._highlight.activate()

        this._layout.history(node).forEach(id => {
            let graphNode = this._layout.node(id)
            let clone = graphNode.ui.paperShape.copyTo(this._highlight)
            clone.opacity = '0.25'
            clone.blendMode = 'add'
            clone.fillColor = clone.fillColor.multiply(2.5)

        })
        paper.view.draw()
    }

    render() {
        this._layout.resizeNodes(this.size / 2)
        this._layout.nodes.forEach((node) => {
            let newShape = this.drawNode(node)
            newShape.data = {graphNodeId: node.graphid}
            node.ui.paperShape = newShape
            if (this._onClick !== undefined) {
                newShape.onClick = (mouseEvent) => {
                    let id = mouseEvent.currentTarget.data.graphNodeId
                    this._onClick(id)
                }
            }
        })

        this._layout.edges.forEach((edge) => {
            this.drawEdge(edge)
        })
        paper.view.draw()
    }

    drawSecondaryEdge(edge) {
        let path = this.drawPath(edge)
        path.strokeWidth = 5
        path.dashArray = [5, 3]
        return path
    }

    drawPath(edge) {
        let path = new paper.Path()
        path.strokeColor = edge.ui.color
        edge.points.forEach((point) => {
            path.add(new paper.Point(point.x, point.y))
        })
        return path
    }

    drawPrimaryEdge(edge) {
        let path = this.drawPath(edge)
        path.strokeWidth = 8
        return path
    }
}

module.exports = UI