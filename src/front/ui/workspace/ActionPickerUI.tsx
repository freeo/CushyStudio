import { observer } from 'mobx-react-lite'
import { Fragment, useState } from 'react'
import { Button, IconButton, InputGroup, Message, Popover, SelectPicker, Tree, Whisper } from 'rsuite'
import { ComfyPromptJSON } from 'src/types/ComfyPrompt'
import { useSt } from '../../FrontStateCtx'
import { useProject } from '../../ProjectCtx'
import { TypescriptHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'
import { getIconForFilePath } from './filePathIcon'
import { asAbsolutePath } from '../../../utils/fs/pathUtils'
import { SectionTitleUI } from './SectionTitle'

export const ActionPickerUI = observer(function ToolPickerUI_(p: {}) {
    const st = useSt()
    return (
        <div
            //
            className='flex flex-col flex-grow'
            style={{ borderRight: '1px solid #2d2d2d' }}
        >
            <SectionTitleUI label='ACTIONS' className='bg-red-950'>
                <div onClick={() => st.toolbox.walk()} className='cursor-pointer'>
                    <span className='text-xs material-symbols-outlined'>sync</span>
                </div>
            </SectionTitleUI>
            <FileListUI />
        </div>
    )
})

export const FileListUI = observer(function FileListUI_(p: {}) {
    const st = useSt()
    const pj = useProject()
    return (
        <>
            <Tree
                value={pj.data.actionFile}
                defaultExpandItemValues={['CushyStudio']}
                tw='overflow-x-hidden overflow-y-auto flex-grow'
                key={st.toolbox.updatedAt}
                data={st.toolbox.treeData}
                renderTreeIcon={(x) => {
                    if (x.expand) return '▿'
                    return '▸'
                }}
                // renderMenu={(node) => null}
                // valueKey='label'
                renderTreeNode={(node) => {
                    // console.log(node)
                    return (
                        <div className='flex items-center'>
                            {node.children ? (
                                <span className='material-symbols-outlined'>folder</span>
                            ) : typeof node.value === 'string' ? (
                                getIconForFilePath(node.value)
                            ) : (
                                '❓'
                            )}{' '}
                            {node.label}
                            {/* <div tw='ml-auto'>ok</div> */}
                        </div>
                    )
                }}
                // renderTreeIcon={() => <>{'>'}</>}
                // value={value}
                onChange={async (_value: any) => {
                    if (typeof _value !== 'string') throw new Error('tree selection value is not a string')
                    const value = _value as string

                    // 1. focus paf
                    const paf = st.toolbox.filesMap.get(asAbsolutePath(value))
                    if (paf == null) throw new Error(`paf not found for ${value}`)
                    pj.focusActionFile(paf)

                    // 2. if paf has a tool, focus it
                    console.log(value, paf)
                    await paf.load({ logFailures: true })
                    const tool0 = paf.mainTool
                    if (tool0 == null) return null
                    pj.focusTool(tool0)
                    // console.log(res?.tools.length)

                    // setValue(value)
                }}
                // renderTreeNode={(nodeData) => {
                //     return <div>{nodeData.label}</div>
                // }}
                // draggable
                // onDrop={({ createUpdateDataFunction }, event) => setTreeData(createUpdateDataFunction(treeData))}
            />
            {/* <div className='flex-grow'></div> */}
            <Message showIcon className='m-2' type='info'>
                {/* <span className='material-symbols-outlined'>folder-</span> */}
                Add files to `actions` folder to create action
            </Message>
            {/* <FooBarUI /> */}
            {/* <PanelImport /> */}
        </>
    )
})

export const FooBarUI = observer(function FooBarUI_(p: {}) {
    const [a, set] = useState<Maybe<string>>(() => null)
    const st = useSt()
    return (
        <div>
            <input
                type='text'
                defaultValue={''}
                onChange={(e) => {
                    const val = e.target.value
                    const json = JSON.parse(val) as ComfyPromptJSON
                    const code = st.importer.convertPromptToCode(json, {
                        title: 'test',
                        author: 'test',
                        preserveId: true,
                        autoUI: true,
                    })
                    set(code)
                }}
            />
            {a && <TypescriptHighlightedCodeUI code={a} />}
        </div>
    )
})

// <div>
// {db.tools.map((tool) => {
//     const action = (
//         <div
//             className='p-1 hover:bg-gray-700 cursor-pointer text-ellipsis overflow-hidden'
//             key={tool.id}
//             onClick={() => pj.focusTool(tool)}
//             style={{
//                 overflow: 'hidden',
//                 whiteSpace: 'nowrap',
//                 background: pj.activeTool.id === tool.id ? '#343e8d' : 'transparent',
//             }}
//         >
//             {tool.data.owner} / {tool.name}
//         </div>
//     )
//     if (tool.data.owner != grup) {
//         grup = tool.data.owner
//         return (
//             <Fragment key={tool.id}>
//                 {/* <div
//                     //
//                     className='flex gap-1 mt-2'
//                     // style={{ borderTop: '1px solid #444444' }}
//                 >
//                     <span className='material-symbols-outlined'>person_outline</span>
//                     {grup}
//                 </div> */}
//                 {action}
//             </Fragment>
//         )
//     }
//     return action
// })}
// {st.tsFilesMap.failures.map((f) => (
//     <Whisper
//         key={f.filePath}
//         enterable
//         speaker={
//             <Popover>
//                 <Message type='error'>{f.error}</Message>
//             </Popover>
//         }
//     >
//         <div
//             style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
//             className='cursor-pointer text-ellipsis overflow-hidden text-red-400 p-1'
//         >
//             {/* <span className='material-symbols-outlined'>error_outline</span> */}
//             {f.filePath}
//         </div>
//     </Whisper>
// ))}
// </div>
