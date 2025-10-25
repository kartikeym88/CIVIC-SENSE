import React, { useState } from "react";
import { api } from "../api";

export default function Chatbot(){
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const send = async () => {
    if(!text) return;
    const userMsg = { from: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setText("");
    try {
      const res = await api.post("/ai/ask", { prompt: text });
      setMessages(prev => [...prev, { from: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { from: "bot", text: "AI error. Check server logs." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6">
      <div>
        <button onClick={()=>setOpen(!open)} className="bg-blue-600 text-white p-3 rounded-full shadow-lg">AI</button>
      </div>

      {open && (
        <div className="w-80 bg-white p-3 rounded-lg shadow-lg mt-2">
          <div className="h-48 overflow-auto border p-2">
            {messages.map((m,i)=> (
              <div key={i} className={`mb-2 ${m.from==="user"?"text-right":""}`}>
                <div className={`inline-block p-2 rounded ${m.from==="user"?"bg-blue-100":"bg-gray-100"}`}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border p-2 rounded" placeholder="Ask Civic-Sense..." />
            <button onClick={send} className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
