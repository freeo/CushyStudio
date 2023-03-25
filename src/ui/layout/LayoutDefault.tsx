import { LayoutData } from 'rc-dock'
import { ArtifactsUI } from '../ArtifactsUI'
import { CivitaiUI } from '../civitai/CIvitaiUI'
import { EditorPaneUI, MainPanelUI } from '../EditorPaneUI'
import { ExecutionUI } from '../ExecutionUI'
import { CSMenuUI } from '../menu/CSMenuUI'
import { PaintUI } from '../paint/PaintUI'
import { PGalleryUI } from '../panels/pGallery'
import { PGalleryFocusUI } from '../panels/pGalleryFocus'
import { PUploadUI } from '../panels/pUpload'

export const defaultLayout = (): LayoutData => ({
    floatbox: {
        mode: 'float',
        children: [],
    },
    dockbox: {
        mode: 'horizontal',
        children: [
            {
                mode: 'vertical',
                size: 3,
                minWidth: 250,
                children: [
                    {
                        tabs: [
                            {
                                minWidth: 250,
                                minHeight: 300,
                                id: 'CSMenuUI',
                                title: 'CushyStudio',
                                content: <CSMenuUI />,
                            },
                        ],
                    },
                ],
            },

            {
                mode: 'vertical',
                size: 10,
                children: [
                    {
                        tabs: [
                            {
                                id: 'Editor1',
                                title: 'Project Code',
                                content: <MainPanelUI />,
                            },
                            {
                                minHeight: 280,
                                id: 'PaintUI',
                                title: 'Paint',
                                content: <PaintUI />,
                            },
                            // {
                            //     minHeight: 280,
                            //     id: 'Graph',
                            //     title: 'Graph',
                            //     content: <VisUI />,
                            // },
                        ],
                    },
                ],
            },
            {
                mode: 'vertical',
                size: 6,
                children: [
                    {
                        // mode: 'vertical',
                        tabs: [
                            {
                                // minWidth: 10,
                                id: 'ExecutionUI',
                                title: 'Control Pane',
                                content: <ExecutionUI />,
                            },
                            {
                                minWidth: 300,
                                minHeight: 300,
                                id: 'CivitaiUI',
                                title: 'Civitai',
                                content: <CivitaiUI />,
                            },
                            {
                                minWidth: 300,
                                minHeight: 300,
                                id: 'TestingArea',
                                title: 'Testing',
                                content: <PUploadUI />,
                            },
                            // {
                            //     // minWidth: 10,
                            //     minHeight: 280,
                            //     id: 'ArtifactsUI',
                            //     title: 'Images',
                            //     content: <ArtifactsUI />,
                            // },
                        ],
                    },
                    {
                        mode: 'horizontal',
                        children: [
                            {
                                size: 3,
                                tabs: [
                                    {
                                        minWidth: 230,
                                        // minHeight: 280,
                                        id: 'artifacts',
                                        title: 'Images',
                                        content: <PGalleryUI />,
                                    },
                                ],
                            },
                            {
                                size: 7,
                                tabs: [
                                    {
                                        minWidth: 100,
                                        minHeight: 100,
                                        id: 'artifacts',
                                        title: 'Images',
                                        content: <PGalleryFocusUI />,
                                    },
                                ],
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
