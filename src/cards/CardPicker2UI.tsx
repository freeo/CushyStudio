import type { LibraryFile } from 'src/cards/CardFile'
import type { Package } from './Pkg'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useSt } from '../state/stateContext'
import { PkgHeaderUI } from './PkgHeaderUI'
import { AppIllustrationUI } from './fancycard/AppIllustrationUI'
import { RevealUI } from 'src/rsuite/RevealUI'
import { DraftL } from 'src/models/Draft'
import { SQLITE_false, SQLITE_true } from 'src/db/SQLITE_boolean'
import { AppEntryStyle } from './AppListStyles'

export const PkgUI = observer(function ActionPackUI_(p: { deck: Package }) {
    const pkg: Package = p.deck

    return (
        <div tw='flex-grow' key={pkg.folderRel}>
            <PkgHeaderUI pkg={pkg} />
            {pkg.folded ? null : (
                <div tw='flex flex-col gap-0.5'>
                    {pkg.apps.map((af) => (
                        <AppEntryUI key={af.relPath} app={af} />
                    ))}
                </div>
            )}
        </div>
    )
})

export const AppEntryInvalidUI = observer(function AppEntryInvalidUI_(p: { appPath: AppPath }) {
    const st = useSt()
    return (
        <div tw={[AppEntryStyle, 'flex gap-2 cursor-pointer']}>
            <div tw='pl-3'>
                <span
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        st.library.removeFavoriteByPath(p.appPath)
                        // app.setFavorite(false)
                    }}
                    //
                    // style={{ fontSize: p.size }}
                    className='material-symbols-outlined text-red-500'
                >
                    star
                </span>
            </div>
            <RevealUI>
                <div tw='overflow-hidden italic opacity-50 hover:opacity-100 text-red-500 whitespace-nowrap overflow-ellipsis'>
                    {p.appPath}
                </div>
                <div>App not found</div>
            </RevealUI>
        </div>
    )
})
export const AppEntryUI = observer(function AppEntryUI_(p: { app: LibraryFile }) {
    const st = useSt()
    const app = p.app
    return (
        <div
            tw={[AppEntryStyle, 'flex gap-2 cursor-pointer']}
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                const actionPath = app.relPath
                st.layout.openAppInMainPanel(actionPath)
                // st.layout.openAppInNewPanel(actionPath)
            }}
        >
            <div tw='pl-1'>
                <AppFavoriteBtnUI app={app} size='1.3rem' />
            </div>
            <AppIllustrationUI app={app} size='1.5rem' />
            <div tw='text-base-content single-line-ellipsis'>{app.displayName}</div>
        </div>
    )
})

export const AppFavoriteBtnUI = observer(function AppFavoriteBtnUI_(p: {
    //
    size?: string
    app: LibraryFile
}) {
    return (
        <AppFavoriteBtnCustomUI //
            get={() => p.app.isFavorite}
            set={(v) => p.app.setFavorite(v)}
            size={p.size}
        />
    )
})

export const DraftFavoriteBtnUI = observer(function DraftFavoriteBtnUI_(p: {
    //
    size?: string
    draft: DraftL
}) {
    return (
        <AppFavoriteBtnCustomUI //
            get={() => Boolean(p.draft.data.isOpened)}
            set={(v) => p.draft.update({ isOpened: v ? SQLITE_true : SQLITE_false })}
            size={p.size}
        />
    )
})

export const AppFavoriteBtnCustomUI = observer(function AppFavoriteBtnCustomUI_(p: {
    //
    size?: string
    get: () => boolean
    set: (v: boolean) => void
}) {
    const size = p.size ?? '1.3rem'
    const isFavorite = p.get()
    if (isFavorite)
        return (
            <span
                style={{ fontSize: size }}
                tw={[
                    //
                    'material-symbols-outlined',
                    'cursor-pointer',
                    'text-yellow-500 hover:text-red-500',
                ]}
                onClick={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    p.set(false)
                }}
                //
            >
                star
            </span>
        )
    return (
        <span
            tw={[
                //
                'material-symbols-outlined',
                'cursor-pointer',
                'hover:text-yellow-500 text-gray-500',
            ]}
            style={{ fontSize: size }}
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                p.set(true)
            }}
        >
            star
        </span>
    )
})
