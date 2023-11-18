import { observer } from 'mobx-react-lite'
import React, { ReactNode } from 'react'
import { DropdownItem } from 'src/rsuite/shims'

export const MainNavEntryUI = observer(function UI_(p: {
    onClick: (ev: React.MouseEvent<HTMLElement, MouseEvent>) => void
    className?: string
    icon?: React.ReactElement
    label: ReactNode

    // size?: TypeAttributes['Size']
    // appearance?: TypeAttributes['Appearance']
    // soon?: boolean
    // tooltip?: ReactNode
}) {
    return (
        <DropdownItem //
            className={p.className}
            onClick={p.onClick}
            icon={p.icon}
        >
            {p.label}
        </DropdownItem>
    )
    // if (p.tooltip)
    //     return (
    //         <Whisper delay={0} delayClose={0} delayOpen={0} placement='bottomStart' speaker={<Tooltip>{p.tooltip}</Tooltip>}>
    //             {btn}
    //         </Whisper>
    //     )
    // return btn
})
