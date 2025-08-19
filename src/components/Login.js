// src/components/Login.js
import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { logSheet } from "../utils/sheetUtils";


export default function Login({ onLogin }) {
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const deviceId =
    localStorage.getItem("cmsDeviceId") || crypto.randomUUID();
    localStorage.setItem("cmsDeviceId", deviceId);

    try {
      const res = await fetch("https://txxszkt15g.execute-api.ap-south-1.amazonaws.com/initial/creatorlogins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, userId, password, deviceId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Login failed");

    
      await logSheet({
       CreatorName: fullName,
       CreatorUserName: userId,
       LoginTime: new Date().toISOString()
    });

      onLogin({ fullName: data.fullName || fullName });          // parent callback
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      
    <Form onSubmit={handleSubmit} 
    className="p-4 px-5 border rounded bg-white shadow"
    >
        <h3 className="mb-4 text-center">Creator Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Creator ID</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type={showPwd ? "text" : "password"}
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="outline-secondary"
              size="sm"
              className="ms-2"
              onClick={() => setShowPwd(!showPwd)}
            
             aria-label="Toggle password visibility"
             >
             {showPwd ? <EyeSlash size={18} /> : <Eye size={18} />}
            </Button>
          </div>
        </Form.Group>
        <Button type="submit" disabled={loading} variant="primary" className="w-100">
          {loading ? <Spinner size="sm" /> : "Login"}
        </Button>
      </Form>
    </div>
  );
}