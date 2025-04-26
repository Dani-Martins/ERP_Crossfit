import React, { useState, useEffect } from 'react';
import { 
  Container, Card, Form, FormGroup, Label, Input, Button, Alert, 
  Spinner, Row, Col, Table, CustomInput, InputGroup, InputGroupAddon, 
  InputGroupText, FormFeedback
} from 'reactstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CondicaoPagamentoForm = () => {
  // Estado inicial do formulário
  const estadoInicial = {
    descricao: '',
    tipo: 'Parcelado',
    ativo: true,
    percentualJuros: 0,
    percentualMulta: 0,
    percentualDesconto: 0,
    parcelas: []
  };

  // Estados
  const [condicao, setCondicao] = useState(estadoInicial);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState('Nova Condição de Pagamento');
  const [sucessoMensagem, setSucessoMensagem] = useState(null);
  const [validacao, setValidacao] = useState({});
  
  // Estado para nova parcela
  const [novaParcela, setNovaParcela] = useState({
    numero: 1,
    dias: '',
    percentual: '',
    formaPagamentoId: ''
  });
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = !!id;
  
  useEffect(() => {
    carregarFormasPagamento();
    
    if (isEdicao) {
      setTitulo('Editar Condição de Pagamento');
      carregarCondicao(id);
    }
  }, [id]);
  
  const carregarFormasPagamento = async () => {
    try {
      const response = await axios.get('/api/FormaPagamento');
      setFormasPagamento(response.data);
    } catch (err) {
      console.error('Erro ao carregar formas de pagamento:', err);
      setError('Não foi possível carregar as formas de pagamento.');
    }
  };
  
  const carregarCondicao = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/CondicaoPagamento/${id}`);
      const condicaoData = response.data;
      
      // Obter as parcelas
      const parcelasResponse = await axios.get(`/api/ParcelaCondicaoPagamento/CondicaoPagamento/${id}`);
      
      setCondicao({
        ...condicaoData,
        parcelas: parcelasResponse.data || []
      });
    } catch (err) {
      console.error('Erro ao carregar condição de pagamento:', err);
      setError('Não foi possível carregar os dados da condição de pagamento.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCondicao({
      ...condicao,
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
  
  const handleParcelaChange = (e) => {
    const { name, value } = e.target;
    setNovaParcela({
      ...novaParcela,
      [name]: value
    });
  };
  
  const adicionarParcela = () => {
    // Validação básica
    if (!novaParcela.dias || !novaParcela.percentual) {
      setValidacao({
        ...validacao,
        parcela: 'Dias e Percentual são obrigatórios'
      });
      return;
    }
    
    // Adiciona a nova parcela à lista
    const proximoNumero = condicao.parcelas.length + 1;
    const parcela = {
      ...novaParcela,
      numero: proximoNumero
    };
    
    setCondicao({
      ...condicao,
      parcelas: [...condicao.parcelas, parcela]
    });
    
    // Limpa o formulário de nova parcela
    setNovaParcela({
      numero: proximoNumero + 1,
      dias: '',
      percentual: '',
      formaPagamentoId: ''
    });
    
    setValidacao({
      ...validacao,
      parcela: null
    });
  };
  
  const removerParcela = (index) => {
    const novasParcelas = [...condicao.parcelas];
    novasParcelas.splice(index, 1);
    
    // Reajustar os números
    const parcelasAtualizadas = novasParcelas.map((p, idx) => ({
      ...p,
      numero: idx + 1
    }));
    
    setCondicao({
      ...condicao,
      parcelas: parcelasAtualizadas
    });
    
    setNovaParcela({
      ...novaParcela,
      numero: parcelasAtualizadas.length + 1
    });
  };
  
  const validarFormulario = () => {
    const erros = {};
    
    if (!condicao.descricao) {
      erros.descricao = 'Descrição é obrigatória';
    }
    
    if (condicao.parcelas.length === 0) {
      erros.parcelas = 'É necessário adicionar pelo menos uma parcela';
    }
    
    // Verificar se o total de percentuais é 100%
    const totalPercentual = condicao.parcelas.reduce(
      (soma, parcela) => soma + parseFloat(parcela.percentual || 0), 0
    );
    
    if (totalPercentual !== 100) {
      erros.percentualTotal = `O total dos percentuais deve ser 100%. Atual: ${totalPercentual}%`;
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
      let response;
      
      // Dados para enviar à API
      const condicaoData = {
        descricao: condicao.descricao,
        tipo: condicao.tipo,
        ativo: condicao.ativo,
        percentualJuros: parseFloat(condicao.percentualJuros),
        percentualMulta: parseFloat(condicao.percentualMulta),
        percentualDesconto: parseFloat(condicao.percentualDesconto)
      };
      
      if (isEdicao) {
        // Atualizar condição existente
        response = await axios.put(`/api/CondicaoPagamento/${id}`, condicaoData);
        
        // Remover todas as parcelas atuais
        await axios.delete(`/api/ParcelaCondicaoPagamento/CondicaoPagamento/${id}`);
      } else {
        // Criar nova condição
        response = await axios.post('/api/CondicaoPagamento', condicaoData);
      }
      
      // ID da condição de pagamento criada/atualizada
      const condicaoId = response.data.id || id;
      
      // Criar parcelas
      for (const parcela of condicao.parcelas) {
        const parcelaData = {
          numero: parcela.numero,
          dias: parseInt(parcela.dias),
          percentual: parseFloat(parcela.percentual),
          formaPagamentoId: parcela.formaPagamentoId ? parseInt(parcela.formaPagamentoId) : null
        };
        
        await axios.post(`/api/ParcelaCondicaoPagamento/CondicaoPagamento/${condicaoId}`, parcelaData);
      }
      
      setSucessoMensagem('Condição de pagamento salva com sucesso!');
      
      // Redirecionar após 1 segundo
      setTimeout(() => {
        navigate('/financeiro/condicoes-pagamento');
      }, 1000);
    } catch (err) {
      console.error('Erro ao salvar condição de pagamento:', err);
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
        <Link to="/financeiro/condicoes-pagamento" className="btn btn-light">
          Voltar
        </Link>
        <h2 className="ms-3">{titulo}</h2>
      </div>
      
      <Card className="p-4">
        {error && <Alert color="danger">{error}</Alert>}
        {sucessoMensagem && <Alert color="success">{sucessoMensagem}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="tipo">Tipo</Label>
                <Input
                  type="select"
                  id="tipo"
                  name="tipo"
                  value={condicao.tipo}
                  onChange={handleInputChange}
                >
                  <option value="À Vista">À Vista</option>
                  <option value="Parcelado">Parcelado</option>
                </Input>
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label for="descricao">Descrição</Label>
                <Input
                  type="text"
                  id="descricao"
                  name="descricao"
                  value={condicao.descricao}
                  onChange={handleInputChange}
                  invalid={!!validacao.descricao}
                  placeholder="Ex: 30/60/90"
                />
                <FormFeedback>{validacao.descricao}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
          
          <Row className="mt-3">
            <Col md={3}>
              <FormGroup className="d-flex align-items-center">
                <Label className="me-3">Situação</Label>
                <div className="form-switch">
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    id="ativo"
                    name="ativo"
                    checked={condicao.ativo}
                    onChange={handleInputChange}
                  />
                  <Label className="form-check-label" for="ativo">
                    {condicao.ativo ? "Habilitado" : "Desabilitado"}
                  </Label>
                </div>
              </FormGroup>
            </Col>
          </Row>
          
          <Row className="mt-3">
            <Col md={4}>
              <FormGroup>
                <Label for="percentualJuros">Juros (%)</Label>
                <InputGroup>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    id="percentualJuros"
                    name="percentualJuros"
                    value={condicao.percentualJuros}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="percentualMulta">Multa (%)</Label>
                <InputGroup>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    id="percentualMulta"
                    name="percentualMulta"
                    value={condicao.percentualMulta}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="percentualDesconto">Desconto (%)</Label>
                <InputGroup>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    id="percentualDesconto"
                    name="percentualDesconto"
                    value={condicao.percentualDesconto}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          
          <div className="mt-4">
            <h5 className="d-flex justify-content-between align-items-center">
              <span>Parcelas</span>
              <Button 
                type="button" 
                color="secondary" 
                size="sm" 
                onClick={adicionarParcela}
                className="me-2"
              >
                Adicionar Parcela
              </Button>
            </h5>
            
            {validacao.parcelas && (
              <Alert color="danger" className="py-2">{validacao.parcelas}</Alert>
            )}
            
            {validacao.percentualTotal && (
              <Alert color="danger" className="py-2">{validacao.percentualTotal}</Alert>
            )}
            
            <div className="table-responsive">
              <Table>
                <thead>
                  <tr>
                    <th>Dias</th>
                    <th>Percentual (%)</th>
                    <th>Forma de Pagamento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {condicao.parcelas.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">Nenhuma parcela adicionada</td>
                    </tr>
                  ) : (
                    condicao.parcelas.map((parcela, index) => (
                      <tr key={index}>
                        <td>{parcela.dias}</td>
                        <td>{parcela.percentual}%</td>
                        <td>
                          {parcela.formaPagamentoId ? 
                            formasPagamento.find(f => f.id === parseInt(parcela.formaPagamentoId))?.descricao || 'N/A'
                            : 'N/A'}
                        </td>
                        <td>
                          <Button
                            type="button"
                            color="danger"
                            size="sm"
                            onClick={() => removerParcela(index)}
                          >
                            Remover
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td>
                      <Input
                        type="number"
                        name="dias"
                        placeholder="Dias"
                        value={novaParcela.dias}
                        onChange={handleParcelaChange}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        step="0.01"
                        name="percentual"
                        placeholder="Percentual"
                        value={novaParcela.percentual}
                        onChange={handleParcelaChange}
                      />
                    </td>
                    <td>
                      <Input
                        type="select"
                        name="formaPagamentoId"
                        value={novaParcela.formaPagamentoId}
                        onChange={handleParcelaChange}
                      >
                        <option value="">Selecione uma forma de pagamento</option>
                        {formasPagamento.map(forma => (
                          <option key={forma.id} value={forma.id}>
                            {forma.descricao}
                          </option>
                        ))}
                      </Input>
                    </td>
                    <td>
                      <Button
                        type="button"
                        color="danger"
                        size="sm"
                        disabled
                      >
                        Remover
                      </Button>
                    </td>
                  </tr>
                  {validacao.parcela && (
                    <tr>
                      <td colSpan="4" className="text-danger">
                        {validacao.parcela}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </Table>
            </div>
          </div>
          
          <div className="d-flex justify-content-end mt-4">
            <Button
              type="button"
              color="secondary"
              className="me-2"
              onClick={() => navigate('/financeiro/condicoes-pagamento')}
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

export default CondicaoPagamentoForm;