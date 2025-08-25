// src/components/Cell.js
import React, { useRef } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import models from "../data/models.json";
import prompts from "../data/prompts.json";

export default function Cell({
  data,
  onChange,
  isAlternate,
  cellIndex,
}) {
  /* Destructure controlled state */
  const {
    context,
    output,
    model,
    prompt,
    loading,
    isCustomPrompt,
    savedPrompts,
  } = data;

  /* Utility setters */
  const setContext = (v) => onChange({ context: v });
  const setOutput  = (v) => onChange({ output: v });
  const setModel   = (v) => onChange({ model: v });
  const setPrompt  = (v) => onChange({ prompt: v });
  const setLoading = (v) => onChange({ loading: v });
  const set        = (patch) => onChange(patch);

  const outputRef = useRef();

  /* API call */
  const runAI = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://cms-api-6ihr.onrender.com/api/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, prompt, context }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const content = data.choices?.[0]?.message?.content || data.content || "";
      const cites = Array.isArray(data.citations) ? data.citations.filter(Boolean) : [];
      setOutput(content + (cites.length ? `\n\n**Citations**:\n${cites.join("\n")}` : ""));
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* Prompt helpers */
  const handlePromptChange = (e) => {
    const val = e.target.value;
    if (val === "__CUSTOM__") {
      set({ prompt: "", isCustomPrompt: true });
    } else {
      set({ prompt: val, isCustomPrompt: false });
    }
  };

  const handleCustomPromptChange = (e) => set({ prompt: e.target.value });

  const savePrompt = () => {
    const trimmed = prompt.trim();
    if (!trimmed || savedPrompts.includes(trimmed)) return;
    const next = [...savedPrompts, trimmed];
    localStorage.setItem("savedPrompts", JSON.stringify(next));
    set({ savedPrompts: next, isCustomPrompt: false });
  };

  /* Render */
  return (
    <div
      className="p-3 mb-3 border rounded"
      style={{
        borderWidth: 1,
        backgroundColor: isAlternate ? "#BFC5F1" : "white",
        transition: "background-color 0.5s ease",
      }}
    >
      <div className="mb-2 fw-bold small">
        Cell {cellIndex + 1}: ACTIVE
      </div>

      <Form.Group className="mb-2">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Context.."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3 position-relative">
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => navigator.clipboard.writeText(output)}
          className="position-absolute"
          style={{ top: 4, right: 4, zIndex: 2 }}
        >
          Copy
        </Button>
        <Form.Control
          ref={outputRef}
          as="textarea"
          rows={3}
          placeholder={loading ? "⏳ Generating…" : "Output.."}
          value={output}
          readOnly
          disabled={loading}
        />
      </Form.Group>

      <Row className="align-items-center">
        <Col>
          <Form.Select value={model} onChange={(e) => setModel(e.target.value)}>
            {models.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col>
          <div className="d-flex gap-2">
            <Form.Select
              value={isCustomPrompt ? "__CUSTOM__" : prompt}
              onChange={handlePromptChange}
            >
              {prompts.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
              {savedPrompts.map((sp, idx) => (
                <option key={idx} value={sp}>
                  {sp}
                </option>
              ))}
              <option value="__CUSTOM__">+ Custom prompt</option>
            </Form.Select>

            {isCustomPrompt && (
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="Type custom prompt…"
                value={prompt}
                onChange={handleCustomPromptChange}
              />
            )}
          </div>
        </Col>

        <Col xs="auto" className="d-flex gap-2">
          <Button
            variant="success"
            onClick={runAI}
            disabled={loading}
            style={{ backgroundColor: "#4D4ACD", borderColor: "#4D4ACD" }}
          >
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

          {isCustomPrompt && prompt.trim() && (
            <Button variant="outline-secondary" onClick={savePrompt}>
              Save
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
}