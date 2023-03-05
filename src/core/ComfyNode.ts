import type { NodeProgress } from '../client/api'
import type { ComfyNodeJSON } from './ComfyNodeJSON'
import type { NodeInput } from './dsl.gen'

import { makeObservable, observable } from 'mobx'
import { sleep } from '../utils/sleep'
import { ComfyBase } from './ComfyBase'
import { getUID } from './ComfyNodeUID'
import { NodeOutput } from './NodeOutput'

export abstract class ComfyNode<ComfyNode_input extends object> {
    artifacts: { images: string[] }[] = []
    progress: NodeProgress | null = null

    get allArtifactsImgs(): string[] {
        return this.artifacts //
            .flatMap((a) => a.images)
            .map((i) => `http://${this.comfy.serverHost}/view/${i}`)
    }

    async get() {
        await this.comfy.get()
        await sleep(1000)
    }

    constructor(
        //
        public comfy: ComfyBase,
        public uid: string = getUID(),
        public inputs: ComfyNode_input,
    ) {
        this.comfy.nodes.set(this.uid.toString(), this)
        makeObservable(this, { artifacts: observable })
    }

    toJSON(): ComfyNodeJSON {
        const out: { [key: string]: any } = {}
        for (const [name, val] of Object.entries(this.inputs)) {
            out[name] = this.serializeValue(name, val)
        }
        return {
            inputs: out,
            class_type: this.constructor.name,
        }
    }

    getExpecteTypeForField(name: string): string {
        return (this.constructor as any).inputs.find((i: NodeInput) => i.name === name)!.type
    }

    getOutputForType(type: string): NodeOutput<any> {
        const i: NodeInput = (this.constructor as any).outputs.find((i: NodeInput) => i.type === type)!
        const val = (this as any)[i.name]
        if (val instanceof NodeOutput) return val
        throw new Error(`Expected ${i.name} to be a NodeOutput`)
    }

    private serializeValue(field: string, value: unknown): unknown {
        if (value instanceof NodeOutput) return [value.node.uid, value.slotIx]
        if (value instanceof ComfyNode) {
            const expectedType = this.getExpecteTypeForField(field)
            const output = value.getOutputForType(expectedType)
            return [value.uid, output.slotIx]
        }
        return value
    }
}

// const out: ApiPromptInput = {
//     client_id: 'dd78de15f4fb45d29166925ed85b44c0',
//     extra_data: { extra_pnginfo: { it: 'works' } },
//     prompt: this.comfy.toJSON(),
// }
// const res = await fetch('http://192.168.1.19:8188/prompt', {
//     method: 'POST',
//     body: JSON.stringify(out),
// })