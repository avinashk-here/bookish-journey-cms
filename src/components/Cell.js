// src/components/Cell.js
import React, { useState, useRef, useEffect } from "react";
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
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    const savedPromptsFromStorage = localStorage.getItem('savedPrompts');
    if (savedPromptsFromStorage) {
      setSavedPrompts(JSON.parse(savedPromptsFromStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  useEffect(() => {
    if (isCustomPrompt) {
      setShowSaveButton(true);
    } else {
      setShowSaveButton(false);
    }
  }, [isCustomPrompt]);

  const runAI = async () => {
    setLoading(true);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt, context }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const content = data.choices?.[0]?.message?.content || data.content || '';
      const cites = Array.isArray(data.citations) ? data.citations.filter(Boolean) : [];

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

  const handlePromptChange = (e) => {
    const value = e.target.value;
    if (value === '__CUSTOM__') {
      setIsCustomPrompt(true);
      setPrompt('');
      setShowSaveButton(false); // Hide the save button initially
    } else {
      setIsCustomPrompt(false);
      setPrompt(value);
      setShowSaveButton(false); // Hide the save button
    }
  };

  const handleCustomPromptChange = (e) => {
    setPrompt(e.target.value);
    if (e.target.value.trim()) {
      setShowSaveButton(true); // Show the save button if there's text
    } else {
      setShowSaveButton(false); // Hide the save button if no text
    }
  };

  const savePrompt = () => {
    if (isCustomPrompt && prompt.trim()) {
      setSavedPrompts([...savedPrompts, prompt]);
      setIsCustomPrompt(false); // Reset to use a predefined prompt
      setPrompt(''); // Clear the custom prompt input
      setShowSaveButton(false); // Hide the save button
    }
  };

  return (
    <div
      className={`p-3 mb-3 border rounded ${isNew ? "border border-danger" : "border border-secondary"}`}
      style={{
        borderColor: isNew ? "#BFC5F1" : "#070606ff",
        borderWidth: isNew ? 3 : 1,
        backgroundColor: isNew
          ? "#fff9db"
          : isAlternate
          ? "#BFC5F1"
          : "white",
        transition: "background-color 0.5s ease",
      }}
    >
      <div className="mb-2 fw-bold text-muted small" 
      style={{
          fontFamily: 'Spline Sans, sans-serif',
          color: '#000',         
          letterSpacing: '0.5px',   
          
        }}
        >Cell {cellIndex + 1}: ACTIVE</div>
      <Form.Group className="mb-2" 
           style={{
          fontFamily: 'Spline Sans, sans-serif',
          color: '#000',         
          letterSpacing: '0.5px',   
          
        }}
      
      >
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Context.."
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
        style={{
          fontFamily: 'Spline Sans, sans-serif',
          color: '#000',         
          letterSpacing: '0.5px',   
          
        }}
          ref={outputRef}
          as="textarea"
          rows={3}
          placeholder={loading ? `⏳ Generating… (${elapsed}s)` : "Output.."}
          value={output}
          readOnly
          disabled={loading}
        />
      </Form.Group>

      <Row className="align-items-center">
        <Col>
          {/* Model dropdown */}
          <Form.Select 
          style={{
          fontFamily: 'Spline Sans, sans-serif',
          color: '#000', 
          fontWeight:"bold",
          fontSize: "0.9rem",        
          letterSpacing: '0.9px',   
          
        }}
          value={model} onChange={(e) => setModel(e.target.value)}>
            {models.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          {/* Prompt dropdown */}
          <div className="d-flex gap-2" 
          
          style={{
          fontFamily: 'Spline Sans, sans-serif',
          color: '#000', 
          fontWeight:"bold",
          fontSize: "0.9rem",        
          letterSpacing: '0.9px',   
          
        }}
          >
            <Form.Select
              value={isCustomPrompt ? '__CUSTOM__' : prompt}
              onChange={handlePromptChange}
            >
              {prompts.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
              {savedPrompts.map((sp, index) => (
                <option key={index} value={sp}>
                  {sp}
                </option>
              ))}
              <option value="__CUSTOM__">+ Add prompt</option>
            </Form.Select>
            {isCustomPrompt && (
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="type.."
                value={prompt}
                onChange={handleCustomPromptChange}
              />
            )}
          </div>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={runAI} disabled={loading}  style={{ backgroundColor: '#4D4ACD', borderColor: '#4D4ACD' }}>
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
          {showSaveButton && (
            <Button variant="success" onClick={savePrompt}>
              Save
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
}
