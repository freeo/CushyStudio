import { observer } from 'mobx-react-lite'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { useSt } from '../../state/stateContext'
import { ThemePreviewUI } from './utils/ThemePreviewUI'

export const MenuConfigUI = observer(function MenuConfigUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown //
            startIcon={<span className='material-symbols-outlined text-purple-500'>settings</span>}
            title='Config'
            appearance='subtle'
        >
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Config', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>settings</span>}
                label='Config'
            />
            <MenuItem
                onClick={() => st.layout.FOCUS_OR_CREATE('Hosts', {})}
                icon={<span className='material-symbols-outlined text-purple-500'>cloud</span>}
                label='ComfyUI Hosts'
            />
            {st.themeMgr.themes.map((theme) => (
                <div
                    tw='cursor-pointer hover:bg-base-300 p-2'
                    key={theme}
                    // icon={<span className='text-orange-400 material-symbols-outlined'>sync</span>}
                    onClick={(ev) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        st.themeMgr.theme = theme
                    }}
                >
                    <ThemePreviewUI theme={theme} />
                </div>
            ))}
        </Dropdown>
    )
})
