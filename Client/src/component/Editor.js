import React, { useEffect } from 'react'
import { useRef } from 'react';// Import the codemirror module
import 'codemirror/mode/javascript/javascript';     // Code mirror mode for javascript
import "../App.css";
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import "codemirror/lib/codemirror.css"; // Code mirror css
import CodeMirror from "codemirror";
import { Socket } from 'socket.io-client';
import Form from 'react-bootstrap/Form';
import { IoSend } from "react-icons/io5";



// code editor

function Editor({ socketRef, lang, roomId, onCodeChange }) {
  const editorRef = useRef(null);


  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realTimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current = editor;
      editor.setSize(null, "100%");

      editor.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue' && socketRef.current) {
          socketRef.current.emit("code-change", {
            roomId,
            code,
          });
        }
      });
    };

    init();
  }, []);

  useEffect(() => {
    const output = document.getElementById("Output");
    const run = document.getElementById("runCode");

    const runCode = async () => {
      const code = {
        code: editorRef.current.getValue(),
        input: "",
        lang: lang,
      };

      const oData = await fetch("http://localhost:5000/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(code),
      });

      const d = await oData.json();
      output.value = d.output;
    };

    if (run) {
      run.addEventListener("click", runCode);
    }

    return () => {
      if (run) {
        run.removeEventListener("click", runCode);
      }
    };
  }, [lang]); // Add lang as a dependency if it changes

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("code-change", ({ code }) => {
        if (code != null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off("code-change");
    };
  }, [socketRef.current]);


  return (
    <>
      {/* Code Section */}
      <div style={{ height: "400px" }}>
        <textarea id="realTimeEditor" spellCheck="false"></textarea>
      </div>

      {/* Output Section */}
      <div className='bg-dark' style={{ height: "auto" }}>

        <div className='w-full mb-2 px-2 d-flex justify-content-between mt-2'>
          <h4 className='text-sm'>Output</h4>
          <div className='mx-3 text-success' style={{ cursor: "pointer" }}>
            <button type="button" id="runCode" className='btn btn-primary' data-toggle="tooltip" data-placement="top" title="Run Code">
              <IoSend size={"25px"} />
            </button>
          </div>
        </div>

        <Form.Group className="mb-3 text-white">
          <Form.Control as="textarea" id="Output" className='text-warning rounded-top-4 px-4 py-3' rows={7} style={{ border: "none", outline: "none", resize: "none", background: "#282A36", paddingLeft:"5px", fontSize:"20px" }} placeholder="Your output here ..." disabled />
        </Form.Group>


        <style>
          {` 
                    ::placeholder { 
                        color: #198754 !important; 
                        font-size: 19px;
                    }`

                    
          }
        </style>
      </div>
    </>
  )
}


export default Editor