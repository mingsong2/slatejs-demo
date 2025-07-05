import React, { useState, useCallback, useMemo } from 'react'
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
  const [editor] = useState(() => witchSlateOt(withReact(createEditor())));
  window.editor = editor;
  console.log("editor", editor);
  console.log("window", window);
  const [count, setCount] = useState(0)
  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    }
  ]
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
