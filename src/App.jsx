import React, { useState, useCallback, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createEditor, Editor, Transforms, Element, Node, path } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import CustomEditor from './CustomEditor'
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
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

function App() {
  const [editor] = useState(() => withReact(createEditor()));
  window.editor = editor;
  console.log("editor", editor);
  console.log("window", window);
  const [count, setCount] = useState(0)
  const initialValue = useMemo(
    () =>
      [
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
      ],
    []
  )
  const renderElement = useCallback(props => {
    console.log('props.leaf', props.leaf)
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])
  const renderLeaf = useCallback(props => {
    console.log('props.leaf', props.leaf)
    return <Leaf {...props} />
  }, [])
  return (
    <div className='editor-wrap'>
      <Slate 
        editor={editor} 
        initialValue={initialValue}
        onChange={value => {
          const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
          )
          console.log("isAstChange", isAstChange)
          if (isAstChange) {
            // Save the value to Local Storage.
            const content = JSON.stringify(value)
            localStorage.setItem('content', content)
          }
        }}
      >
        <div>
          <button
            onMouseDown={event => {
              event.preventDefault()
              CustomEditor.toggleBoldMark(editor)
            }}
          >
            Bold
          </button>
          <button
            onMouseDown={event => {
              event.preventDefault()
              CustomEditor.toggleCodeBlock(editor)
            }}
          >
            Code Block
          </button>
          <button
            onMouseDown={event => {
              event.preventDefault()
              Transforms.insertFragment(editor, [{ text: 'insert fragment' }])
            }}
          >
            InsertFragment
          </button>
          <button
            onMouseDown={event => {
              event.preventDefault()
              Transforms.insertNodes(editor, [{ text: 'insert nodes' }])
            }}
          >
            InsertNodes
          </button>
          <button
            onMouseDown={event => {
              event.preventDefault()
              Transforms.mergeNodes(editor, {at: { path: [1,0], offset: 0 } })
            }}
          >
            mergeNodes
          </button>
          <button
            onMouseDown={event => {
              event.preventDefault()
              Transforms.splitNodes(editor, {at: { path: [0,0], offset: 6 } })
            }}
          >
            splitNodes
          </button>
          <button
            onMouseDown={event => {
              event.preventDefault()
              console.log(Node.string(editor.children[0]))
            }}
          >
            printNodes
          </button>
        </div>
        <Editable 
          decorate={([node, path]) => {
            // return ranges,通过增加hightlight属性用于搜索高亮
            console.log("decorate", node, path);
            let ranges = [];
            let range = {
              anchor: { path, offset: 0 },
              focus: { path, offset: Node.string(node).length - 2 },
              highlight: 'hight'
            };
            ranges.push(range);
            return ranges;
          }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
            if (!event.ctrlKey) {
              return
            }
  
            // Replace the `onKeyDown` logic with our new commands.
            switch (event.key) {
              case '`': {
                event.preventDefault()
                CustomEditor.toggleCodeBlock(editor)
                break
              }
  
              case 'b': {
                event.preventDefault()
                CustomEditor.toggleBoldMark(editor)
                break
              }
            }
          }}
        />
      </Slate>
    </div>
  )
}

export default App
