import React, { useState, useCallback, useMemo, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createEditor, Editor, Transforms, Element, Node, path, range } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import CustomEditor from './CustomEditor'
import Tools from './components/tools';
import { witchSlateOt } from './slate-ot'
const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}

const Leaf = props => {
  let highlight = props.leaf.highlight;
  return (
    <span
      className={`${highlight ? 'highlight' : ''}`}
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

function App() {

  const [editor] = useState(() => witchSlateOt(withReact(createEditor()), setValue));



  window.editor = editor;
  const [count, setCount] = useState(0)
  const [value, setValue] = useState([])
  const initialValue = []
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])
  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])



  return (
    <div className='editor-wrap'>
      <Slate
        editor={editor}
        value={value}
        initialValue={initialValue}
      >
        <Tools editor={editor}></Tools>
        <div class="editor-body">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </div>
      </Slate>
    </div>
  )
}

export default App
