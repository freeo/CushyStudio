import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { _formatPreviewDate } from '../utils/formatters/_formatPreviewDate'
import { OutputPreviewUI, OutputUI } from './OutputUI'
import { FoldIconUI } from 'src/cards/FoldIconUI'

export const StepOutputsV1UI = observer(function StepOutputsV1UI_(p: { step: StepL }) {
    const step = p.step
    const isExpanded = step.expanded
    if (!isExpanded) return <StepOutputsHeaderV1UI className='py-2' step={step} />
    if (isExpanded)
        return (
            <div>
                <StepOutputsHeaderV1UI className='py-2' step={step} />
                <StepOutputsBodyV1UI step={step} />
            </div>
        )
})

export const StepOutputsHeaderV1UI = observer(function StepOutputsV1HeaderUI_(p: { step: StepL; className?: string }) {
    const step = p.step
    return (
        <div
            tw={[
                //
                'bg-base-200',
                'flex items-center',
                'cursor-pointer justify-between text-xs text-opacity-50 hover:bg-base-200',
                p.className,
            ]}
            onClick={() => (step.expanded = !step.expanded)}
            style={{ borderTop: '1px solid #2d2d2d' }}
        >
            <FoldIconUI val={step.expanded} />
            <b>{step.name ?? step.appFile?.name ?? 'no name'}</b>
            <div className='text-xs opacity-50'>{_formatPreviewDate(new Date(step.createdAt))}</div>
        </div>
    )
})

export const StepOutputsBodyV1UI = observer(function StepBodyUI_(p: { step: StepL }) {
    const step = p.step
    return (
        <div className='flex flex-wrap gap-1'>
            {step.outputs?.map((output, ix) => (
                <OutputPreviewUI key={ix} step={step} output={output} />
            ))}
        </div>
    )
})