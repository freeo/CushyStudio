import type { LiveTable } from './LiveTable'
import type { LiveInstance } from './LiveInstance'

export class LiveRefOpt<
    //
    Owner extends LiveInstance<any, any>,
    L extends LiveInstance<any, any>,
> {
    constructor(
        //
        public owner: LiveInstance<any, any>,
        public key: keyof Owner['data'],
        public table: () => LiveTable<any, L>,
    ) {}

    get id(): Maybe<L['data']['id']> {
        return this.owner.data[this.key]
    }

    /** unsafe version of item, that crashes if item not found */
    get itemOrCrash(): L {
        const db = this.owner.db
        if (this.id == null) throw new Error(`❌ LiveRefOpt.itemOrCrash: no id`)
        return this.table().getOrThrow(this.id)
    }

    get item(): Maybe<L> {
        const db = this.owner.db
        return this.table().get(this.id)
    }

    /** debug string for pretty printing */
    get debugStr() {
        return `LiveRefOpt: ${this.owner.table.name}->${this.table().name}(${this.id})`
    }
}
