import React, { useState, useEffect } from 'react';
import { Container, Card, Form, FormGroup, Label, Input, Button, Alert, Spinner, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CidadeForm = () => {
  // Estado inicial do formulário
  const estadoInicial = {
    nome: '',
    codigoIBGE: '',
    estadoId: ''
  };

  // Estados
  const [cidade, setCidade] = useState(estadoInicial);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [titulo, setTitulo] = useState('Nova Cidade');
  const [sucessoMensagem, setSucessoMensagem] = useState(null);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = !!id;

  // Novos estados para os modais
  const [modalEstado, setModalEstado] = useState(false);
  const [modalPais, setModalPais] = useState(false);
  const [novoEstado, setNovoEstado] = useState({ nome: '', uf: '', paisId: '' });
  const [novoPais, setNovoPais] = useState({ nome: '', sigla: '', codigoTelefonico: '' });
  const [paises, setPaises] = useState([]);
  const [loadingEstado, setLoadingEstado] = useState(false);
  const [loadingPais, setLoadingPais] = useState(false);
  const [erroEstado, setErroEstado] = useState(null);
  const [erroPais, setErroPais] = useState(null);

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Carregar lista de estados
        const estadosResponse = await axios.get('/api/Estado');
        setEstados(estadosResponse.data);
        
        // Se for edição, carregar a cidade específica
        if (isEdicao) {
          const cidadeResponse = await axios.get(`/api/Cidade/${id}`);
          setCidade(cidadeResponse.data);
          setTitulo('Editar Cidade');
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Verifique sua conexão e tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id, isEdicao]);

  useEffect(() => {
    carregarEstados();
    // Outras chamadas existentes...
  }, []);

  // Função para carregar estados
  const carregarEstados = async () => {
    try {
      const response = await axios.get('/api/Estado');
      setEstados(response.data);
    } catch (err) {
      console.error('Erro ao carregar estados:', err);
      setError('Não foi possível carregar a lista de estados.');
    }
  };
  
  // Função para carregar países
  const carregarPaises = async () => {
    try {
      const response = await axios.get('/api/Pais');
      setPaises(response.data);
    } catch (err) {
      console.error('Erro ao carregar países:', err);
      setErroEstado('Não foi possível carregar a lista de países.');
    }
  };

  // Toggle dos modais
  const toggleModalEstado = () => setModalEstado(!modalEstado);
  const toggleModalPais = () => setModalPais(!modalPais);

  // Função para abrir modal de novo estado
  const abrirModalEstado = () => {
    carregarPaises(); // Carrega países para o dropdown
    setNovoEstado({ nome: '', uf: '', paisId: '' });
    setErroEstado(null);
    setModalEstado(true);
  };

  // Função para abrir modal de novo país
  const abrirModalPais = () => {
    setNovoPais({ nome: '', sigla: '', codigoTelefonico: '' });
    setErroPais(null);
    setModalPais(true);
  };

  // Handler para mudanças no formulário de estado
  const handleChangeEstado = (e) => {
    const { name, value } = e.target;
    setNovoEstado(prev => ({ ...prev, [name]: value }));
  };

  // Handler para mudanças no formulário de país
  const handleChangePais = (e) => {
    const { name, value } = e.target;
    setNovoPais(prev => ({ ...prev, [name]: value }));
  };

  // Função para salvar novo país
  const salvarPais = async (e) => {
    e.preventDefault();
    setLoadingPais(true);
    setErroPais(null);
    
    try {
      const response = await axios.post('/api/Pais', novoPais);
      
      // Atualizar a lista de países e selecionar o novo país
      await carregarPaises();
      setNovoEstado(prev => ({ ...prev, paisId: response.data.id.toString() }));
      
      // Fechar modal de país
      setModalPais(false);
    } catch (err) {
      console.error('Erro ao salvar país:', err);
      setErroPais(err.response?.data?.mensagem || 'Erro ao salvar o país. Tente novamente.');
    } finally {
      setLoadingPais(false);
    }
  };

  // Função para salvar novo estado
  const salvarEstado = async (e) => {
    e.preventDefault();
    setLoadingEstado(true);
    setErroEstado(null);
    
    try {
      const response = await axios.post('/api/Estado', novoEstado);
      
      // Atualizar a lista de estados e selecionar o novo estado
      await carregarEstados();
      setCidade(prev => ({ ...prev, estadoId: response.data.id.toString() }));
      
      // Fechar modal de estado
      setModalEstado(false);
    } catch (err) {
      console.error('Erro ao salvar estado:', err);
      setErroEstado(err.response?.data?.mensagem || 'Erro ao salvar o estado. Tente novamente.');
    } finally {
      setLoadingEstado(false);
    }
  };

  // Função para lidar com mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCidade(prevCidade => ({
      ...prevCidade,
      [name]: value
    }));
  };

  // Função para salvar a cidade - atualize a função handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null); // Limpa mensagens de erro anteriores
    
    try {
      if (isEdicao) {
        await axios.put(`/api/Cidade/${id}`, cidade);
        setSucessoMensagem(`A cidade ${cidade.nome} foi atualizada com sucesso.`);
      } else {
        await axios.post('/api/Cidade', cidade);
        setSucessoMensagem(`A cidade ${cidade.nome} foi cadastrada com sucesso.`);
      }
      
      // Aguarda um breve momento antes de redirecionar
      setTimeout(() => {
        navigate('/localizacao/cidades');
      }, 1500); // 1.5 segundos
    } catch (err) {
      console.error('Erro ao salvar cidade:', err);
      setError(`Erro ao ${isEdicao ? 'atualizar' : 'criar'} cidade: ${err.response?.data?.mensagem || err.message}`);
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
    <Container fluid className="p-0">
      {/* Modal para cadastro de país */}
      <Modal isOpen={modalPais} toggle={toggleModalPais}>
        <ModalHeader toggle={toggleModalPais}>Novo País</ModalHeader>
        <Form onSubmit={salvarPais}>
          <ModalBody>
            {erroPais && <Alert color="danger">{erroPais}</Alert>}
            
            <FormGroup>
              <Label for="nomePais">Nome *</Label>
              <Input
                type="text"
                id="nomePais"
                name="nome"
                value={novoPais.nome}
                onChange={handleChangePais}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="siglaPais">Sigla *</Label>
              <Input
                type="text"
                id="siglaPais"
                name="sigla"
                value={novoPais.sigla}
                onChange={handleChangePais}
                required
              />
            </FormGroup>

            {/* Adicionar este novo campo */}
            <FormGroup>
              <Label for="codigoTelefonicoPais">Código Telefônico</Label>
              <Input
                type="text"
                id="codigoTelefonicoPais"
                name="codigoTelefonico"
                placeholder="+XX"
                value={novoPais.codigoTelefonico || ''}
                onChange={handleChangePais}
              />
            </FormGroup>
          </ModalBody>
          
          <ModalFooter>
            <Button color="primary" type="submit" disabled={loadingPais}>
              {loadingPais ? <Spinner size="sm" /> : 'Salvar'}
            </Button>
            <Button color="secondary" onClick={toggleModalPais}>
              Cancelar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      
      {/* Modal para cadastro de estado */}
      <Modal isOpen={modalEstado} toggle={toggleModalEstado}>
        <ModalHeader toggle={toggleModalEstado}>Novo Estado</ModalHeader>
        <Form onSubmit={salvarEstado}>
          <ModalBody>
            {erroEstado && <Alert color="danger">{erroEstado}</Alert>}
            
            <FormGroup>
              <Label for="nomeEstado">Nome *</Label>
              <Input
                type="text"
                id="nomeEstado"
                name="nome"
                value={novoEstado.nome}
                onChange={handleChangeEstado}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="ufEstado">UF *</Label>
              <Input
                type="text"
                id="ufEstado"
                name="uf"
                value={novoEstado.uf}
                onChange={handleChangeEstado}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="paisId">País *</Label>
              <div className="d-flex align-items-center mb-2">
                <div className="flex-grow-1 me-2">
                  <Input
                    type="select"
                    id="paisId"
                    name="paisId"
                    value={novoEstado.paisId}
                    onChange={handleChangeEstado}
                    required
                  >
                    <option value="">Selecione um país</option>
                    {paises.map(pais => (
                      <option key={pais.id} value={pais.id}>
                        {pais.nome} - {pais.sigla}
                      </option>
                    ))}
                  </Input>
                </div>
                <Button 
                  color="success" 
                  className="text-white" 
                  onClick={abrirModalPais}
                >
                  + Novo País
                </Button>
              </div>
              <small className="form-text text-muted">
                Se o país não estiver na lista, clique em "Novo País" para adicioná-lo
              </small>
            </FormGroup>
          </ModalBody>
          
          <ModalFooter>
            <Button color="primary" type="submit" disabled={loadingEstado}>
              {loadingEstado ? <Spinner size="sm" /> : 'Salvar'}
            </Button>
            <Button color="secondary" onClick={toggleModalEstado}>
              Cancelar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* Conteúdo do formulário principal */}
      <Card className="border-0">
        <h2 className="mb-4">{titulo}</h2>
        
        {error && <Alert color="danger">{error}</Alert>}
        {sucessoMensagem && <Alert color="success">{sucessoMensagem}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="nome">Nome *</Label>
            <Input
              type="text"
              name="nome"
              id="nome"
              placeholder="Nome da cidade"
              value={cidade.nome}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label for="codigoIBGE">Código Geográfico de Município</Label>
            <Input
              type="text"
              name="codigoIBGE"
              id="codigoIBGE"
              placeholder="Código geográfico oficial do município"
              value={cidade.codigoIBGE || ''}
              onChange={handleChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label for="estadoId">Estado *</Label>
            <div className="d-flex align-items-center mb-2">
              <div className="flex-grow-1 me-2">
                <Input
                  type="select"
                  name="estadoId"
                  id="estadoId"
                  value={cidade.estadoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um estado</option>
                  {estados.map(estado => (
                    <option key={estado.id} value={estado.id}>
                      {estado.nome} - {estado.uf}
                    </option>
                  ))}
                </Input>
              </div>
              <Button 
                color="success" 
                className="text-white" 
                onClick={abrirModalEstado}
              >
                + Novo Estado
              </Button>
            </div>
            <small className="form-text text-muted">
              Se o estado não estiver na lista, clique em "Novo Estado" para adicioná-lo
            </small>
          </FormGroup>
          
          <div className="d-flex justify-content-end mt-4">
            <Button 
              type="submit" 
              color="primary" 
              className="me-2"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Salvar'}
            </Button>
            <Button 
              type="button" 
              color="secondary" 
              onClick={() => navigate('/localizacao/cidades')}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default CidadeForm;