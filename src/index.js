const paper = require('paper')
const dagre = require('dagre')


let dag = (canvasId) => {
    let canvas = document.getElementById(canvasId)
    paper.setup(canvas)

    let edges = new paper.Layer()
    let node = new paper.Layer()
    let labels = new paper.Layer()

    let g = new dagre.graphlib.Graph();
    g.setGraph({marginx: 50, marginy:50, rankdir: 'TB', align: 'UL'})
    g.setDefaultEdgeLabel(function() { return {}; })

    let items = []
    let size = 50
    let labelMargin = 5
    let _drawLabel = (graphItem, item) => {
        labels.activate()
        let itempos = item.position

        let typeLabel = new paper.PointText({
            position: new paper.Point(itempos.x, itempos.y+4.5),
            fontWeight: 'bold',
            justification: 'center',
            content: graphItem.type,
            fillColor: graphItem.fg,
            fontFamily: 'sans serif',
            fontSize: 14
        })
        let nameLabel = new paper.PointText({
            position: new paper.Point(itempos.x, itempos.y-size/2-labelMargin),
            fontWeight: 'bold',
            justification: 'center',
            content: graphItem.name,
            fillColor: graphItem.fg,
            fontFamily: 'sans serif',
            fontSize: 14
        })
        let labelBg = new paper.Path.Rectangle(nameLabel.strokeBounds)
        labelBg.fillColor = 'black'
        labelBg.opacity = '0.4'
        labelBg.insertBelow(nameLabel)
    }
    let _drawCircle = (item, x, y) => {
        node.activate()
        let c = new paper.Path.Circle(new paper.Point(x,y), size/2)
        c.fillColor = item.bg

        _drawLabel(item, c)
        return c
    }
    let _drawSquare = (item, x, y) => {
        node.activate()
        let rect = new paper.Rectangle()
        rect.size = new paper.Size(size, size)
        rect.center = new paper.Point(x, y)
        let square = new paper.Path.Rectangle(rect);
        square.fillColor = item.bg;

        _drawLabel(item, square)
        return square
    }
    let _render = () => {
        dagre.layout(g)

        g.nodes().forEach((nodeId) => {
            let itemIndex = Number(nodeId.substring(1))
            let item = items[itemIndex]
            let node = g.node(nodeId)
            switch( item.shape ) {
                case "circle":
                    _drawCircle(item, node.x, node.y)
                    break
                case "square":
                    _drawSquare(item, node.x, node.y)
                    break
            }
        })

        edges.activate()
        g.edges().forEach((edge) => {
            let first = items[Number(edge.v.substring(1))]
            let second = items[Number(edge.w.substring(1))]

            let graphEdge = g.edge(edge)
            let points = graphEdge.points
            let ref = new paper.Path();
            ref.strokeColor = second.bg
            if (graphEdge.edgeType === 'dotted') {
                ref.strokeWidth = '5'
                ref.dashArray = [5,3]
            }
            else {
                ref.strokeWidth = '8'
            }
            points.forEach((point) => {
                ref.add(new paper.Point(point.x, point.y))
            })
        })
        // Draw the view now:
        paper.view.draw()
    }
    return {
        render: _render,
        coloredSubdag: (bg, fg) => {

            let _square = (name, type) => {
                let item = {id: "#" + items.length.toString(),
                    shape: "square",
                    fg: fg, bg: bg, name: name, type: type}
                items.push(item)
                g.setNode(item.id, {label: item.name, width: size/2, height: size/2})
                return item
            }
            let _circle = (name, type) => {
                let item = {id: "#" + items.length.toString(), shape: "circle",
                    fg: fg, bg: bg, name: name, type: type}
                items.push(item)
                g.setNode(item.id, {label: item.name, width: size/2, height: size/2})
                return item
            }
            let _connect = (first, second, ...more) => {
                g.setEdge(first.id, second.id, {edgeType: 'solid'})
                let previous = second.id;
                more.forEach((item) => {
                    let id = item.id
                    g.setEdge(previous, id, {edgeType: 'solid'})
                    previous = id
                })
            }
            let _ref = (first, second) => {
                g.setEdge(first.id, second.id, {edgeType: 'dotted'})
            }


            return {
                square: _square,
                circle: _circle,
                connect: _connect,
                ref: _ref
            }
        }
    }
}

module.exports = {
    dag: dag
}