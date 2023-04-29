import * as I from '@rsuite/icons'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useState } from 'react'
import { Button, IconButton, Panel, Progress } from 'rsuite'
import { ComfyNode } from '../core-shared/Node'
import { ComfyNodeSchema } from '../core-shared/Schema'
import { Graph } from '../core-shared/Graph'
import { Image } from './Image'
import { NodeRefUI } from './NodeRefUI'
import { useSt } from '../core-front/stContext'

// export const NodeListUI = observer(function NodeListUI_(p: { graph: Graph }) {
//     const graph = p.graph
//     if (graph == null) return <>no execution yet</>
//     const uiSt = useLocalObservable(() => ({ seeAll: false }))
//     const nodes = uiSt.seeAll ? graph.nodes : graph.nodes.filter((f) => f.isExecuting)
//     // const layout = graph.workspace.layout 🔴
//     return (
//         <div className='col gap'>
//             <div className='row space-between'>
//                 <div className='col gap'>
//                     {nodes.map((node) => (
//                         <ComfyNodeUI key={node.uid} node={node} />
//                     ))}
//                 </div>
//                 <div className='row gap'>
//                     <Button onClick={() => (uiSt.seeAll = !uiSt.seeAll)} className='self-start'>
//                         {uiSt.seeAll ? 'hide' : `+ ${graph.nodes.length} nodes`}
//                     </Button>
//                     <IconButton icon={<I.FileDownload />} />
//                 </div>
//             </div>
//             <div className='row wrap'>
//                 {/* {graph.allImages.map((img) => (
//                     <Image
//                         // onClick={() => layout.addImagePopup(img.url)}
//                         // onClick={() => (layout.galleryFocus = img)}
//                         alt='prompt output'
//                         src={img.comfyURL}
//                         key={img.uid}
//                         height={100}
//                         width={100}
//                     />
//                     // <img key={url} style={{ width: '5rem', height: '5rem' }} src={url} />
//                 ))} */}
//             </div>
//         </div>
//     )
// })

export const ComfyNodeUI = observer(function ComfyNodeUI_(p: {
    //
    node: ComfyNode<any>
    showArtifacts?: boolean
    // folded?: boolean
}) {
    const node = p.node
    const uid = node.uid
    const graph: Graph | undefined = node.graph
    if (graph == null) return <>no execution yet</>

    const curr: ComfyNode<any> = graph.nodesIndex.get(uid)!
    const name = curr.$schema.nameInComfy
    const schema: ComfyNodeSchema = curr.$schema
    // const [folded, setFolded] = useState(p.folded ?? false)
    return (
        <Panel
            style={{ position: 'relative' }}
            bordered
            shaded
            //
            key={uid}
            className='node'
            // style={{ width: 'fit-content', border: '1px solid lightgray' }}
        >
            {/* {node.progress || node.status === 'done' ? (
                <div
                    style={{
                        background: '#339433',
                        height: '0.4rem',
                        width:
                            node.status === 'done' //
                                ? '100%'
                                : `${(node.progress!.value / (node.progress!.max || 1)) * 100}%`,
                    }}
                ></div>
            ) : null} */}
            <div className='row'>
                <Progress.Line
                    vertical
                    strokeWidth={12}
                    style={{ maxWidth: '2rem' }}
                    status={node.status === 'done' ? 'success' : 'active'}
                    percent={node.status === 'done' ? 100 : ((node.progress?.value ?? 0) / (node.progress?.max || 1)) * 100}
                    // showInfo={false}
                />
                {/* {folded ? null : ( */}
                <div>
                    <div className='row gap darker pointer' style={{ padding: '0.2rem' }}>
                        <h4 className='row items-center gap'>
                            <NodeRefUI nodeUID={uid} graph={graph} />
                            {name}
                        </h4>
                    </div>
                    {schema.inputs.map((input) => {
                        let val = node.json.inputs[input.name]
                        if (Array.isArray(val)) val = <NodeRefUI nodeUID={val[0]} graph={graph} />
                        return (
                            <div key={input.name} className='prop row'>
                                <div className='propName'>{input.name}</div>
                                <div className='propValue'>{val}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* )} */}
            {p.showArtifacts ? (
                <div className='row wrap'>
                    {/* {curr.images.map((img) => (
                        <img //
                            key={img.uid}
                            style={{ width: '5rem', height: '5rem' }}
                            src={img.comfyURL}
                        />
                    ))} */}
                    {/* {curr?.allArtifactsImgs.map((url) => (
                    <div key={url}>
                        <img style={{ width: '5rem', height: '5rem' }} key={url} src={url} />
                    </div>
                ))} */}
                </div>
            ) : null}
        </Panel>
    )
})
