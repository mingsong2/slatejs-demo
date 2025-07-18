import { slateType } from 'slate-ot';
import { v4 as uuid } from 'uuid';
import ReconnectingWebSocket from 'reconnecting-websocket';
import sharedb from 'sharedb/lib/client';
import { Transforms } from 'slate';
sharedb.types.register(slateType);

var socket = new ReconnectingWebSocket('ws://' + 'localhost:9527', [], {
    maxEnqueuedMessages: 0
});

var connection = new sharedb.Connection(socket);

const doc  = connection.get('example', 'richText');

const clientId = uuid();

export function witchSlateOt(editor, setValue) {
    const { onChange } = editor;

    editor.onChange = (item) => {
        onChange();
        if (item.operation?.type !== 'set_selection') {
            try{
                doc.submitOp(editor.operations, { source: clientId });
            }catch(e){
                console.error(e)
            }
        }
    }

    doc.subscribe((err) => {
        if (err) {
            throw err;
        }
        
        editor.children = doc.data.children;

        editor.onChange();

        doc.on('op', (op, options) => {
            console.log("==op", op);
            if (options === clientId) return;
        
            const ops = Array.isArray(op) ? op : [op];
        
            for (const o of ops) {
                Transforms.transform(o);
            }

            setValue(editor.children);
        });
    });



    return editor;
}



