import type { NodeProgress, WsMsgExecutedData } from './ComfyAPI'
import type { ComfyGraph } from './ComfyGraph'
import type { ComfyNodeJSON } from './ComfyPrompt'

import { configure, extendObservable, makeAutoObservable } from 'mobx'
import { ComfyNodeOutput } from './ComfyNodeOutput'
import { ComfyNodeUID } from './ComfyNodeUID'
import { ComfyNodeSchema, NodeInputExt } from './ComfySchema'
import { exhaust } from './ComfyUtils'
import { CushyImage } from './CushyImage'
import { comfyColors } from './ComfyColors'

configure({ enforceActions: 'never' })

/** ComfyNode
 * - correspond to a signal in the graph
 * - belongs to a script
 */
export class ComfyNode<ComfyNode_input extends object> {
    artifacts: WsMsgExecutedData[] = []
    images: CushyImage[] = []
    progress: NodeProgress | null = null
    $schema: ComfyNodeSchema
    status: 'executing' | 'done' | 'error' | 'waiting' | null = null

    get isExecuting() { return this.status === 'executing' } // prettier-ignore
    get statusEmoji() {
        const s = this.status
        if (s === 'executing') return '🔥'
        if (s === 'done') return '✅'
        if (s === 'error') return '❌'
        if (s === 'waiting') return '⏳'
        if (s == null) return ''
        return exhaust(s)
    }

    get inputs(): ComfyNode_input {
        return this.json.inputs as any
    }

    json: ComfyNodeJSON

    /** update a node */
    set(p: Partial<ComfyNode_input>) {
        // const changes = {
        //     added: [] as { sourceUID: string; targetUID: string; input: string }[],
        //     removed: [] as string[],
        // }
        const cyto = this.graph.cyto
        for (const [key, value] of Object.entries(p)) {
            const next = this.serializeValue(key, value)
            const prev = this.json.inputs[key]
            if (next === prev) continue
            if (Array.isArray(next) && Array.isArray(prev)) {
                cyto?.removeEdge(`${prev[0]}-${key}->${this.uid}`)
                cyto?.addEdge({ sourceUID: next[0], targetUID: this.uid, input: key })
            }
            // edge.from}-${edge.inputName}->${node.uid
            this.json.inputs[key] = next
        }
        // 🔴 wrong resonsibility
        // console.log('CHANGES', changes)
    }

    get color(): string {
        return comfyColors[this.$schema.category]
    }

    $outputs: ComfyNodeOutput<any>[] = []
    constructor(
        //
        public graph: ComfyGraph,
        public uid: string = graph.getUID(),
        xxx: ComfyNodeJSON,
    ) {
        // console.log('CONSTRUCTING', xxx.class_type, uid)
        this.$schema = graph.schema.nodesByName[xxx.class_type]
        let ix = 0
        this.json = this._convertPromptExtToPrompt(xxx)
        this.graph.registerNode(this)
        makeAutoObservable(this)

        // dynamically add properties for every outputs
        const extensions: { [key: string]: any } = {}
        for (const x of this.$schema.outputs) {
            const output = new ComfyNodeOutput(this, ix++, x.name)
            extensions[x.name] = output
            this.$outputs.push(output)
            // console.log(`  - .${x.name} as ComfyNodeOutput(${ix})`)
        }
        extendObservable(this, extensions)
        // console.log(Object.keys(Object.getOwnPropertyDescriptors(this)).join(','))
        // makeObservable(this, { artifacts: observable })
    }

    _convertPromptExtToPrompt(promptExt: ComfyNodeJSON) {
        const inputsExt = Object.entries(promptExt.inputs)
        const inputs: { [inputName: string]: any } = {}
        for (const [name, value] of inputsExt) {
            inputs[name] = this.serializeValue(name, value)
        }
        return { class_type: this.$schema.name, inputs }
    }

    /** return the list of nodes piped into this node */
    _incomingNodes() {
        const incomingNodes: ComfyNodeUID[] = []
        for (const [_name, val] of Object.entries(this.inputs)) {
            if (val instanceof Array) {
                const [from, _slotIx] = val
                incomingNodes.push(from)
            }
        }
        return incomingNodes
    }
    _incomingEdges() {
        const incomingEdges: { from: ComfyNodeUID; inputName: string }[] = []
        for (const [inputName, val] of Object.entries(this.inputs)) {
            if (val instanceof Array) {
                const [from, _slotIx] = val
                incomingEdges.push({ from, inputName })
            }
        }
        return incomingEdges
    }

    get manager() { return this.graph.client } // prettier-ignore

    async get() {
        await this.graph.get()
    }

    serializeValue(field: string, value: unknown): unknown {
        if (value == null) throw new Error('🔴 null ??')
        if (value instanceof ComfyNodeOutput) return [value.node.uid, value.slotIx]
        if (value instanceof ComfyNode) {
            // console.log('🔴 Value is COmfyNodeç')
            const expectedType = this._getExpecteTypeForField(field)
            const output = value._getOutputForType(expectedType)
            return [value.uid, output.slotIx]
        }
        return value
    }

    private _getExpecteTypeForField(name: string): string {
        // console.log('>>name', name)
        const input = this.$schema.inputs.find((i: NodeInputExt) => i.name === name)
        // console.log('>>name', name, input)
        if (input == null) throw new Error('🔴 input not found asdf')
        return input.type
    }

    private _getOutputForType(type: string): ComfyNodeOutput<any> {
        const i: NodeInputExt = this.$schema.outputs.find((i: NodeInputExt) => i.type === type)!
        const val = (this as any)[i.name]
        // console.log(`this[i.name] = ${this.$schema.name}[${i.name}] = ${val}`)
        if (val instanceof ComfyNodeOutput) return val
        throw new Error(`Expected ${i.name} to be a NodeOutput`)
    }
}