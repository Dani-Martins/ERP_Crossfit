import React, { useState, useEffect } from 'react';
import { Container, Card, Form, FormGroup, Label, Input, Button, Alert, Spinner, FormFeedback } from 'reactstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const FormaPagamentoForm = () => {
  // Estado inicial do formulário
  const estadoInicial = {
    descricao: '',
    ativo: true
  };

  // Estados
  const [formaPagamento, setFormaPagamento] = useState(estadoInicial);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState('Nova Forma de Pagamento');
  const [sucessoMensagem, setSucessoMensagem] = useState(null);
  const [validacao, setValidacao] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = !!id;

  useEffect(() => {
    if (isEdicao) {
      setTitulo('Editar Forma de Pagamento');
      carregarFormaPagamento(id);
    }
  }, [id]);

  const carregarFormaPagamento = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/FormaPagamento/${id}`);
      setFormaPagamento(response.data);
    } catch (err) {
      console.error('Erro ao carregar forma de pagamento:', err);
      setError('Não foi possível carregar os dados da forma de pagamento.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormaPagamento({
      ...formaPagamento,
      [name]: type === 'checkbox' ? checked : value
    });

    // Limpa erros de validação ao editar
    if (validacao[name]) {
      setValidacao({
        ...validacao,
        [name]: null
      });
    }
  };

  const validarFormulario = () => {
    const erros = {};

    if (!formaPagamento.descricao) {
      erros.descricao = 'Descrição é obrigatória';
    }

    setValidacao(erros);
    return Object.keys(erros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEdicao) {
        await axios.put(`/api/FormaPagamento/${id}`, formaPagamento);
      } else {
        await axios.post('/api/FormaPagamento', formaPagamento);
      }

      setSucessoMensagem('Forma de pagamento salva com sucesso!');

      // Redirecionar após 1 segundo
      setTimeout(() => {
        navigate('/financeiro/formas-pagamento');
      }, 1000);
    } catch (err) {
      console.error('Erro ao salvar forma de pagamento:', err);
      setError(`Erro ao salvar: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center p-5">
        <Spinner color="primary" />
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="d-flex mb-4">
        <Link to="/financeiro/formas-pagamento" className="btn btn-light">
          Voltar
        </Link>
        <h2 className="ms-3">{titulo}</h2>
      </div>

      <Card className="p-4">
        {error && <Alert color="danger">{error}</Alert>}
        {sucessoMensagem && <Alert color="success">{sucessoMensagem}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="descricao">Descrição</Label>
            <Input
              type="text"
              id="descricao"
              name="descricao"
              value={formaPagamento.descricao}
              onChange={handleInputChange}
              invalid={!!validacao.descricao}
              placeholder="Ex: Cartão de Crédito"
            />
            <FormFeedback>{validacao.descricao}</FormFeedback>
          </FormGroup>

          <FormGroup className="mt-3">
            <div className="d-flex align-items-center">
              <Label className="me-3">Situação</Label>
              <div className="form-switch">
                <Input
                  type="checkbox"
                  className="form-check-input"
                  id="ativo"
                  name="ativo"
                  checked={formaPagamento.ativo}
                  onChange={handleInputChange}
                />
                <Label className="form-check-label" for="ativo">
                  {formaPagamento.ativo ? "Habilitado" : "Desabilitado"}
                </Label>
              </div>
            </div>
          </FormGroup>

          <div className="d-flex justify-content-end mt-4">
            <Button
              type="button"
              color="secondary"
              className="me-2"
              onClick={() => navigate('/financeiro/formas-pagamento')}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={saving}
            >
              {saving ? <Spinner size="sm" /> : 'Salvar'}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default FormaPagamentoForm;