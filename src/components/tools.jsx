import React from 'react'
import { createEditor, Editor, Transforms, Element, Node, path, range } from 'slate'
import CustomEditor from '../CustomEditor'
import './tools.css';
const tool = ({ editor }) => {
  return (
    <div class="tools-wrap">
      <i
        onMouseDown={event => {
          event.preventDefault()
          CustomEditor.toggleBoldMark(editor)
        }}
        class="iconfont icon-bold"
      ></i>
      <i
        onMouseDown={event => {
          event.preventDefault()
          CustomEditor.toggleCodeBlock(editor)
        }}
        class="iconfont icon-code-view"
      ></i>
      <i
        onMouseDown={event => {
          event.preventDefault()
          Transforms.insertFragment(editor, [{ text: 'insert fragment' }])
        }}
      >
        插入片段
      </i>
      <i
        onMouseDown={event => {
          event.preventDefault()
          Transforms.insertNodes(editor, [{ text: 'insert nodes' }])
        }}
      >
        插入节点
      </i>
      <i
        onMouseDown={event => {
          event.preventDefault()
          Transforms.mergeNodes(editor, { at: { path: [1, 0], offset: 0 } })
        }}
      >
        合并节点
      </i>
      <i
        onMouseDown={event => {
          event.preventDefault()
          Transforms.splitNodes(editor, { at: { path: [0, 0], offset: 6 } })
        }}
      >
        拆分节点
      </i>
      <i
        onMouseDown={event => {
          event.preventDefault()
          console.log(Node.string(editor.children[0]))
        }}
      >
        打印节点
      </i>
      <i
        onMouseDown={event => {
          event.preventDefault()
          Transforms.select(editor, {
            anchor: Editor.start(editor, []),
            focus: Editor.end(editor, []),
          })
        }}
      >
        全选
      </i>
    </div>
  )
}

export default tool