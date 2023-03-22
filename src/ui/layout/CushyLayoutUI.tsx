import { Image } from '@fluentui/react-components'
import { makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import DockLayout, { LayoutData, PanelData } from 'rc-dock'
import { useMemo } from 'react'
import { TutorialUI } from '../../core/TutorialUI'
import { ArtifactsUI } from '../ArtifactsUI'
import { EditorPaneUI } from '../EditorPaneUI'
import { ExecutionUI } from '../ExecutionUI'
import { IdeInfosUI } from '../IdeInfosUI'
import { PGalleryUI } from '../pConnect/pGallery'
import { CushyLayoutContext } from './CushyLayoutCtx'

export class CushyLayout {
    layout = defaultLayout()

    gallerySize = 100
    dockLayout: DockLayout | null = null
    getRef = (r: DockLayout | null) => (this.dockLayout = r)

    constructor() {
        // this.spawnPopups()
        makeObservable(this, { gallerySize: observable })
    }

    // spawnPopups = () => {
    //     // setTimeout(() => {
    //     //     this.addPopup()
    //     // }, 5_000)
    // }

    addImagePopup = (url: string) => {
        if (this.dockLayout == null) return
        console.log('🟢 show image in popup')
        const uid = Math.random().toString(36).substr(2, 9)
        const newTab: PanelData = {
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            w: 800,
            h: 800,
            tabs: [
                {
                    closable: true,
                    minWidth: 180,
                    minHeight: 200,
                    id: 'ide-' + uid,
                    title: 'test',
                    content: <Image fit='contain' height={'100%'} alt='prompt output' src={url} key={url} />,
                },
            ],
        }
        this.dockLayout.dockMove(newTab, null, 'float')
    }

    addHelpPopup = () => {
        if (this.dockLayout == null) return
        console.log('🟢 addPopup')
        const uid = Math.random().toString(36).substr(2, 9)
        const newTab = {
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            w: 200,
            h: 200,
            tabs: [
                {
                    minWidth: 180,
                    minHeight: 200,
                    id: 'ide-' + uid,
                    title: 'test',
                    content: <TutorialUI />,
                },
            ],
        }
        this.dockLayout.dockMove(newTab, null, 'float')
    }
}

export const CushyLayoutUI = observer(function AppLayoutUI_() {
    const layout = useMemo(() => new CushyLayout(), [])
    return (
        <CushyLayoutContext.Provider value={layout}>
            <DockLayout
                groups={{ custom: {} }}
                ref={layout.getRef}
                defaultLayout={layout.layout}
                style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
            />
        </CushyLayoutContext.Provider>
    )
})

const defaultLayout = (): LayoutData => ({
    floatbox: {
        mode: 'float',
        children: [],
    },
    dockbox: {
        mode: 'horizontal',
        children: [
            {
                mode: 'vertical',
                minWidth: 300,
                children: [
                    {
                        tabs: [
                            {
                                minWidth: 300,
                                minHeight: 300,
                                id: 'ide',
                                title: 'CushyStudio',
                                content: <IdeInfosUI />,
                            },
                        ],
                    },
                ],
            },

            {
                mode: 'vertical',
                size: 9999,
                children: [
                    {
                        // mode: 'vertical',
                        size: 99999,
                        tabs: [
                            {
                                minWidth: 400,
                                id: 'node-list',
                                title: 'Control Pane',
                                content: <ExecutionUI />,
                            },
                            {
                                minWidth: 400,
                                minHeight: 280,
                                id: 'artifacts',
                                title: 'Images',
                                content: <ArtifactsUI />,
                            },
                        ],
                    },
                    // {
                    //     // mode: 'vertical',
                    //     tabs: [
                    //         // {
                    //         //     minHeight: 280,
                    //         //     id: 'Graph',
                    //         //     title: 'Graph',
                    //         //     content: <VisUI />,
                    //         // },
                    //     ],
                    // },
                ],
            },
            {
                mode: 'vertical',
                size: 99999,
                children: [
                    {
                        tabs: [
                            {
                                id: 'Editor1',
                                title: 'Project Code',
                                content: <EditorPaneUI />,
                            },
                            // {
                            //     minHeight: 280,
                            //     id: 'Graph',
                            //     title: 'Graph',
                            //     content: <VisUI />,
                            // },
                        ],
                    },
                    {
                        // mode: 'vertical',
                        tabs: [
                            {
                                minWidth: 280,
                                minHeight: 280,
                                id: 'artifacts',
                                title: 'Images',
                                content: <PGalleryUI />,
                            },
                        ],
                    },
                ],
            },
            // {
            //     // mode: 'vertical',
            //     tabs: [
            //         {
            //             minWidth: 280,
            //             minHeight: 280,
            //             id: 'artifacts',
            //             title: 'Images',
            //             content: <PGalleryUI />,
            //         },
            //     ],
            // },
            //         // {
            //         //     minWidth: 280,
            //         //     id: 'assets',
            //         //     title: 'Assets',
            //         //     content: (
            //         //         <>
            //         //             {/* <MainActionsUI />
            //         //                 <VersionPickerUI />
            //         //                 <NodeListUI /> */}
            //         //         </>
            //         //     ),
            //         // },
            //     ],

            //     // tabs: [{ id: 'tab3', title: 'tab1', content: <div>Hello World</div> }],
            // },
        ],
    },
})
