import React, { useState, useRef } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import models from "../data/models.json";
import prompts from "../data/prompts.json";

export default function Cell({ isNew, isAlternate, cellIndex }) {
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [model, setModel] = useState(models[0].value);
  const [prompt, setPrompt] = useState(prompts[0].value);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [citations, setCitations] = useState([]);
  const timerRef = useRef(null);
  const outputRef = useRef(null);

  // const runAI = async () => {
  //   setLoading(true);
  //   setElapsed(0);

  //   timerRef.current = setInterval(() => {
  //     setElapsed((prev) => prev + 1);
  //   }, 1000);

  //   try {
  //     const res = await fetch("http://localhost:5000/api/generate", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ model, prompt, context }),
  //     });
  //     const data = await res.json();
  //     if (data.error) throw new Error(data.error);
  //     setCitations(data.citations || []);
  //     //setOutput(`${data.choices[0]?.message?.content || ''}\n\n**Citations**:\n${data.citations.map((citation => `- ${citation}`).join('\n'))},\n`);
  //      const content = data?.choices?.[0]?.message?.content || '';
  //      const cites   = Array.isArray(data.citations) ? data.citations.filter(Boolean) : [];
  //       setOutput(
  //       content +
  //       (cites.length ? `\n\n**Citations**:\n${cites.join('\n')}` : '')
  //     );

  //   } catch (err) {
  //     setOutput(`Error: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //     clearInterval(timerRef.current);
  //   }
  // };


  const runAI = async () => {
  setLoading(true);
  setElapsed(0);
  timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);

  try {
    const res = await fetch("http://localhost:5000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, context }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    // Pick correct text field (Perplexity / OpenAI)
    const content = data.choices?.[0]?.message?.content || data.content || '';
    const cites   = Array.isArray(data.citations) ? data.citations.filter(Boolean) : [];

    setOutput(
      content +
      (cites.length ? `\n\n**Citations**:\n${cites.join('\n')}` : '')
    );
  } catch (err) {
    setOutput(`Error: ${err.message}`);
  } finally {
    setLoading(false);
    clearInterval(timerRef.current);
  }
};
  const copyOutput = () => {
    if (outputRef.current) {
      navigator.clipboard.writeText(outputRef.current.value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 8000);
      });
    }
  };

  return (
    <div
      className={`p-3 mb-3 border rounded ${isNew ? "border border-danger" : "border border-secondary"}`}
      style={{
        borderColor: isNew ? "#ee4c0c" : "#070606ff",
        borderWidth: isNew ? 3 : 1,
        backgroundColor: isNew
          ? "#fff9db"
          : isAlternate
          ? "#f36506ff"
          : "white",
        transition: "background-color 0.5s ease",
      }}
    >
      <div className="mb-2 fw-bold text-muted small">Cell {cellIndex + 1}: ACTIVE</div>
      <Form.Group className="mb-2">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Paste context here..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </Form.Group>

      {/* Output with Copy button */}
      <Form.Group className="mb-3 position-relative">
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={copyOutput}
          className="position-absolute"
          style={{ top: 4, right: 4, zIndex: 2 }}
        >
          {copied ? "Copied" : "Copy"}
        </Button>

        <Form.Control
          ref={outputRef}
          as="textarea"
          rows={3}
          placeholder={loading ? `⏳ Generating… (${elapsed}s)` : "Output will appear here…"}
          value={output}
          readOnly
          disabled={loading}
        />
      </Form.Group>

      <Row className="align-items-center">
        <Col>
          {/* Model dropdown */}
          <Form.Select value={model} onChange={(e) => setModel(e.target.value)}>
            {models.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          {/* Prompt dropdown */}
          <div className="d-flex gap-2">
            <Form.Select
              value={isCustomPrompt ? '__CUSTOM__' : prompt}
              onChange={(e) => {
                if (e.target.value === '__CUSTOM__') {
                  setIsCustomPrompt(true);
                  setPrompt('');
                } else {
                  setIsCustomPrompt(false);
                  setPrompt(e.target.value);
                }
              }}
            >
              {prompts.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
              <option value="__CUSTOM__">+ Add prompt</option>
            </Form.Select>
            {isCustomPrompt && (
              <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Type your custom prompt…"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
            )}
          </div>
        </Col>
        <Col xs="auto">
          <Button variant="danger" onClick={runAI} disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                Loading…
              </>
            ) : (
              "Run"
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
}