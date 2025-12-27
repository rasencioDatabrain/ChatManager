
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from('usuarios')
        .select('id, correo')
        .eq('correo', email)
        .eq('clave', password) // Note: Storing plain text passwords is not secure.
        .single();

      if (queryError || !data) {
        throw new Error('Credenciales inválidas.');
      }

      // Store a mock session
      localStorage.setItem('mockSession', JSON.stringify({ user: data }));
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 bg-light d-flex justify-content-center align-items-center">
      <Col xxl={8} xl={9} lg={10}>
        <Card className="shadow-lg" style={{ overflow: 'hidden' }}>
          <Row g={0}>
            <Col md={6} className="d-flex flex-column justify-content-center">
              <Card.Body className="p-5">
                <Card.Title className="text-center mb-4 h2">Chat Manager</Card.Title>
                <p className="text-center mb-4">Inicia sesión con tu correo y contraseña.</p>
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ingrese su email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {error && <Alert variant="danger">{error}</Alert>}

                  <div className="d-grid">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          {' Ingresando...'}
                        </>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Col>
            <Col md={6} className="d-none d-md-block">
              <img src="/imagenLogin.jpg" alt="Login Visual" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
            </Col>
          </Row>
        </Card>
      </Col>
    </Container>
  );
};

export default LoginPage;
