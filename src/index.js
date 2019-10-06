const UI = require('./drawing-ui.js')
const Layout = require('./graphmodel.js')


class Main {
    _groups = []

    constructor(canvasId) {
        this._layout = new Layout()
        this._drawingUI = new UI(canvasId, this._layout)

    }

    group() {
        let group = new Group(this._layout)
        this._groups.push(group)
        return group
    }

    render() {
        this._drawingUI.render()
    }

}

class Group {
    _layout
    _rendererFunc

    constructor(layout) {
        this._layout = layout
    }

    node(type, name, ...refs) {
        let dagNode = new DagNode(type, name, this)
        this._layout.addNode(dagNode)
        refs.forEach(ref => dagNode.addPrimaryEdge(ref))
        return dagNode
    }

    render(rendererFunc) {
        this._rendererFunc = rendererFunc;
    }
}

class DagNode {
    type
    name

    constructor(type, name, group) {
        this.type = type
        this.name = name
        this.group = group
    }

    addPrimaryEdge(dagNode) {
        this.group._layout.addEdge(dagNode, this, 'primary')
    }

    addSecondaryEdge(dagNode) {
        this.group._layout.addEdge(dagNode, this, 'secondary')
    }


    link(...refs) {
        refs.forEach(ref => this.addSecondaryEdge(ref))
    }

    render() {
        this.ui = {
            name: this.name,
            type: this.type,
        }
        Object.assign(this.ui, this.group._rendererFunc(this))
        return this
    }

}


module.exports = Main