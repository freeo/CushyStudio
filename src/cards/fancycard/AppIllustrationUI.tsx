import { observer } from 'mobx-react-lite'
import { LibraryFile } from '../CardFile'

export const AppIllustrationUI = observer(function AppIllustrationUI_(p: {
    className?: string
    onClick?: () => void
    app: Maybe<LibraryFile>
    size: string
}) {
    const app = p.app
    if (app == null)
        return (
            <div
                //
                tw='bg-error text-error-content'
                style={{ height: p.size }}
            >
                ERROR
            </div>
        )
    const x = app.illustrationPathWithFileProtocol
    // return null
    if (x.startsWith('<svg'))
        return (
            <div
                //
                style={{ height: p.size }}
                dangerouslySetInnerHTML={{ __html: x }}
            ></div>
        )

    return (
        <img
            className={p.className}
            loading='lazy'
            tw={[
                //
                'rounded',
                p.onClick ? 'cursor-pointer' : null,
            ]}
            style={{ width: p.size, height: p.size, objectFit: 'contain', imageRendering: 'pixelated' }}
            src={app.illustrationPathWithFileProtocol}
            alt='card illustration'
            onClick={p.onClick}
        />
    )
})
