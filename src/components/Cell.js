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
  // Destructure controlled state from parent
  const { context, output, model, prompt, loading } = data;

  // Helper setters that notify the parent
  const setContext = (v) => onChange({ context: v });
  const setOutput  = (v) => onChange({ output: v });
  const setModel   = (v) => onChange({ model: v });
  const setPrompt  = (v) => onChange({ prompt: v });
  const setLoading = (v) => onChange({ loading: v });

  const outputRef = useRef(null);

  /* ---------- API call ---------- */
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

  /* ---------- Copy ---------- */
  const copyOutput = () => {
    if (outputRef.current) {
      navigator.clipboard.writeText(outputRef.current.value);
    }
  };

  /* ---------- Prompt dropdown ---------- */
  const handlePromptChange = (e) => {
    const val = e.target.value;
    if (val === "__CUSTOM__") {
      setPrompt("");
    } else {
      setPrompt(val);
    }
  };

  return (
    <div
      className="p-3 mb-3 border rounded"
      style={{
        borderColor: "#070606ff",
        borderWidth: 1,
        backgroundColor: isAlternate ? "#BFC5F1" : "white",
        transition: "background-color 0.5s ease",
      }}
    >
      <div
        className="mb-2 fw-bold small"
        style={{ fontFamily: "Spline Sans", color: "#000", letterSpacing: "0.5px" }}
      >
        Cell {cellIndex + 1}: ACTIVE
      </div>

      {/* Context */}
      <Form.Group className="mb-2">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Context.."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </Form.Group>

      {/* Output */}
      <Form.Group className="mb-3 position-relative">
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={copyOutput}
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
          <Form.Select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{ fontFamily: "Spline Sans", fontWeight: "bold" }}
          >
            {models.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col>
          <Form.Select
            value={prompt}
            onChange={handlePromptChange}
            style={{ fontFamily: "Spline Sans", fontWeight: "bold" }}
          >
            {prompts.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col xs="auto">
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
        </Col>
      </Row>
    </div>
  );
}
