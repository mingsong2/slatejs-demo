import React, { useState, useCallback, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createEditor, Editor, Transforms, Element, Node, path, range } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import CustomEditor from './CustomEditor'
import Tools from './components/tools';
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
        {
          type: 'code',
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

  const setRange = (path, anchorOffset, focusOffset) => {
    return {
      anchor: { path, offset: anchorOffset },
      focus: { path, offset: focusOffset },
      highlight: 'highlight'
    }
  }
  const decorate = ([node, path]) => {
    // return ranges,通过增加highlightlight属性用于搜索高亮
    console.log("decorate", node, path);
    // var searchText = 'text';
    var contentStr = Node.string(editor.children[0]);
    var contentArr = contentStr.split(searchText);
    let ranges = [];
    const nodeLen = Node.string(node).length;
    let startNum = 0;
    let endNum = 0;

    if (Node.string(node).length == 0) {
      return [];
    }
    for (let k = 0; k < path[1]; k++) {
      startNum = Node.string(editor.children[k].length);
    }
    endNum = startNum + nodeLen;

    let searchStartNum = 0;
    let searchEndNum = 0;
    for (let i = 0; i < contentArr.length; i++) {
      searchStartNum = searchEndNum + contentArr[i].length;
      searchEndNum = searchStartNum + searchText.length;

      if (endNum < searchStartNum) {
        return ranges;
      }
      if (startNum >= searchStartNum && endNum <= searchEndNum) {
        ranges = [setRange(path, 0, nodeLen)];
        return ranges;
      }
      if (searchStartNum < startNum && searchEndNum > startNum && searchEndNum <= endNum) {
        ranges.push(setRange(path, 0, (searchEndNum - startNum)))
      }
      if (searchStartNum >= startNum && searchEndNum <= endNum) {
        ranges.push(setRange(path, (searchStartNum - startNum), (searchEndNum - startNum)));
      }
      if (searchEndNum > endNum && searchStartNum < endNum) {
        ranges.push(setRange(path, (searchStartNum - startNum), nodeLen))
      }
    }
    return ranges;
  }
  return (
    <div className='editor-wrap'>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={value => {
          console.log("editor.operations", editor.operations)
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
        <Tools editor={editor}></Tools>
        <div class="editor-body">
          <Editable
            // decorate={decorate}
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
        </div>
      </Slate>
    </div>
  )
}

export default App
