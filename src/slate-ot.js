import { slateType } from 'slate-ot';
import { v4 as uuid } from 'uuid';
import ReconnectingWebSocket from 'reconnecting-websocket';
import sharedb from 'sharedb/lib/client';
sharedb.types.register(slateType);

var socket = new ReconnectingWebSocket('ws://' + 'localhost:9527', [], {
    maxEnqueuedMessages: 0
});

var connection = new sharedb.Connection(socket);

const doc  = connection.get('111', '111');

const clientId = uuid();

export function witchSlateOt(editor) {
    const { onChange } = editor;

    editor.onChange = () => {
        onChange();
        editor.operations.forEach((o) => {
            if (o.type !== 'set_selection') {
                try{
                    o.origin !== 'remote' && doc.submitOp({ ...o, origin: 'remote' }, { source: clientId });
                }catch(e){
                    console.error(e)
                }
            }
        });
    }

    doc.subscribe((err) => {
        if (err) {
            throw err;
        }
      
        doc.on('op', (op, options) => {
            console.log("==op", op);
            if (options === clientId) return;
        
            const ops = Array.isArray(op) ? op : [op];
        
            for (const o of ops) {
                editor.apply(o);
            }
        });
        
        editor.apply({
            type: 'insert_node',
            path: [0],
            node: { children: [{ text: 'demo' }] },
            origin: 'remote'
        });

    });



    return editor;
}



