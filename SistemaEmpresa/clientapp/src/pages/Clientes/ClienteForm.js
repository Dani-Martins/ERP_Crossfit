import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, 
  Alert, Spinner, Badge, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ClienteService } from '../../api/services';
import axios from 'axios';

// Atualize o esquema de validação para incluir cidadeId e estadoId
const ClienteSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  documento: Yup.string()
    .required('CPF/CNPJ é obrigatório')
    .min(11, 'Documento inválido'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  telefone: Yup.string()
    .required('Telefone é obrigatório'),
  endereco: Yup.object().shape({
    logradouro: Yup.string().required('Logradouro é obrigatório'),
    numero: Yup.string().required('Número é obrigatório'),
    bairro: Yup.string().required('Bairro é obrigatório'),
    cidadeId: Yup.string().required('Cidade é obrigatória'),
    estadoId: Yup.string().required('Estado é obrigatório'),
    cep: Yup.string().required('CEP é obrigatório')
  })
});

// Início do componente ClienteForm
const ClienteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [error, setError] = useState(null);
  
  // Estados para o modal de cidade
  const [showCidadeModal, setShowCidadeModal] = useState(false);
  const [estadosModal, setEstadosModal] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [errorModal, setErrorModal] = useState(null);
  const [formikProps, setFormikProps] = useState(null);
  const [novaCidade, setNovaCidade] = useState({
    nome: '',
    codigoIBGE: '',
    estadoId: ''
  });
  
  const [initialValues, setInitialValues] = useState({
    nome: '',
    documento: '',
    email: '',
    telefone: '',
    observacoes: '',
    ativo: true,
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidadeId: '',
      estadoId: '',
      cep: ''
    }
  });

  // Função para carregar estados para o modal
  const carregarEstadosModal = async () => {
    try {
      const response = await axios.get('/api/Estado');
      setEstadosModal(response.data);
    } catch (err) {
      console.error('Erro ao carregar estados:', err);
      setErrorModal('Não foi possível carregar os estados.');
    }
  };

  // Função para abrir o modal
  const abrirModalCidade = () => {
    if (estadosModal.length === 0) {
      carregarEstadosModal();
    }
    
    setNovaCidade(prev => ({
      ...prev,
      estadoId: estadoSelecionado || ''
    }));
    
    setShowCidadeModal(true);
  };

  // Função para lidar com mudanças no formulário da nova cidade
  const handleNovaCidadeChange = (e) => {
    const { name, value } = e.target;
    setNovaCidade(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para salvar a nova cidade
  const salvarNovaCidade = async () => {
    if (!novaCidade.nome || !novaCidade.estadoId) {
      setErrorModal('Nome da cidade e Estado são obrigatórios.');
      return;
    }

    setLoadingModal(true);
    setErrorModal(null);
    
    try {
      const response = await axios.post('/api/Cidade', novaCidade);
      const cidadeAdicionada = response.data;
      
      // Atualizar a lista de cidades
      setCidades(prev => [...prev, cidadeAdicionada]);
      
      // Se estamos dentro do contexto de um formulário Formik
      if (formikProps && formikProps.setFieldValue) {
        formikProps.setFieldValue('endereco.cidadeId', cidadeAdicionada.id.toString());
      }
      
      // Fechar o modal
      setShowCidadeModal(false);
      setNovaCidade({
        nome: '',
        codigoIBGE: '',
        estadoId: ''
      });
      
    } catch (err) {
      console.error('Erro ao salvar cidade:', err);
      setErrorModal('Erro ao salvar cidade: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingModal(false);
    }
  };

  // 2. Substitua o useEffect com uma versão que carrega os estados
  useEffect(() => {
    const carregarEstados = async () => {
      try {
        const response = await axios.get('/api/Estado');
        setEstados(response.data);
      } catch (err) {
        console.error('Erro ao carregar estados:', err);
      }
    };

    carregarEstados();
    
    // Se estiver em modo de edição, carrega os dados do cliente
    if (id) {
      carregarCliente(id);
    }
  }, [id]);
  
  // 3. Adicione esta função para carregar cidades quando um estado for selecionado
  const handleEstadoChange = async (e, setFieldValue) => {
    const estadoId = e.target.value;
    setEstadoSelecionado(estadoId);
    
    if (estadoId) {
      try {
        const response = await axios.get(`/api/Cidade/Estado/${estadoId}`);
        setCidades(response.data);
        // Limpar a cidade selecionada quando mudar de estado
        setFieldValue('endereco.cidadeId', '');
      } catch (err) {
        console.error('Erro ao carregar cidades:', err);
      }
    } else {
      setCidades([]);
      setFieldValue('endereco.cidadeId', '');
    }
  };
  
  // Agora as funções existentes deverão funcionar corretamente

  // Carregar dados do cliente para edição
  // Modificar a função carregarCliente para mapear corretamente os dados de endereço
  const carregarCliente = async (clienteId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/Cliente/${clienteId}`);
      const clienteData = response.data;
      
      console.log('Dados do cliente recebidos:', JSON.stringify(clienteData, null, 2));
      
      // Se o cliente tem cidade, vamos carregar as cidades do estado
      if (clienteData.cidadeId && clienteData.cidade?.estadoId) {
        setEstadoSelecionado(clienteData.cidade.estadoId);
        const cidadesResponse = await axios.get(`/api/Cidade/Estado/${clienteData.cidade.estadoId}`);
        setCidades(cidadesResponse.data);
      }
      
      // Mapeia todos os campos corretamente
      const clienteFormatado = {
        id: clienteData.id,
        nome: clienteData.nome || '',
        
        // Dados pessoais/empresariais
        tipoPessoa: clienteData.tipoPessoa || 'F',
        documento: clienteData.cpf || clienteData.cnpj || '',
        cpf: clienteData.cpf || '',
        cnpj: clienteData.cnpj || '',
        rg: clienteData.rg || '',
        inscricaoEstadual: clienteData.inscricaoEstadual || '',
        
        // Contato
        email: clienteData.email || '',
        telefone: clienteData.telefone || '',
        celular: clienteData.celular || '',
        
        // Endereço - agora com cidadeId
        endereco: {
          logradouro: clienteData.endereco || '',
          numero: clienteData.numero || '',
          complemento: clienteData.complemento || '',
          bairro: clienteData.bairro || '',
          cep: clienteData.cep || '',
          cidadeId: clienteData.cidadeId || '', // Armazenamos o ID da cidade
          cidade: clienteData.cidade?.nome || '',
          uf: clienteData.cidade?.estado?.uf || '',
          estadoId: clienteData.cidade?.estadoId || ''
        },
        
        // Outros campos
        dataNascimento: clienteData.dataNascimento ? 
          new Date(clienteData.dataNascimento).toISOString().split('T')[0] : '',
        limiteCredito: clienteData.limiteCredito || 0,
        observacoes: clienteData.observacoes || '',
        ativo: clienteData.ativo !== false
      };
      
      console.log('Dados formatados para o formulário:', clienteFormatado);
      
      // Define os valores iniciais para o formulário
      setInitialValues(clienteFormatado);
      setCliente(clienteFormatado);
      
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar cliente:', err);
      setError('Não foi possível carregar os dados do cliente: ' + 
              (err.response?.data?.mensagem || err.message));
      setLoading(false);
    }
  };
  
  // 5. Modifique o handleSubmit para realmente enviar os dados
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      
      // Preparar os dados para envio
      const dadosParaSalvar = {
        nome: values.nome,
        cpf: values.tipoPessoa === 'F' ? values.documento : '',
        cnpj: values.tipoPessoa === 'J' ? values.documento : '',
        email: values.email,
        telefone: values.telefone,
        endereco: values.endereco.logradouro,
        numero: values.endereco.numero,
        complemento: values.endereco.complemento,
        bairro: values.endereco.bairro,
        cep: values.endereco.cep,
        cidadeId: parseInt(values.endereco.cidadeId),
        observacoes: values.observacoes,
        ativo: values.ativo
      };
      
      console.log('Dados para salvar:', dadosParaSalvar);
      
      if (id) {
        // Atualizar cliente existente
        await axios.put(`/api/Cliente/${id}`, dadosParaSalvar);
      } else {
        // Criar novo cliente
        await axios.post('/api/Cliente', dadosParaSalvar);
      }
      
      // Redirecionar após o salvamento
      navigate('/clientes');
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      setError('Erro ao salvar cliente: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
        <p className="mt-3">Carregando dados do cliente...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="page-header">
        <h2>{id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        <Button 
          color="secondary" 
          onClick={() => navigate('/clientes')}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Voltar
        </Button>
      </div>
      
      {error && <Alert color="danger">{error}</Alert>}
      
      <Card>
        <CardBody>
          <Formik
            initialValues={initialValues}
            validationSchema={ClienteSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {(props) => {
              // Salva a referência às propriedades do Formik para uso global
              const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue } = props;
              // Importante: salve a referência para acessar fora do escopo do Formik
              setFormikProps(props);
              
              return (
                <Form onSubmit={handleSubmit}>
                  <h4 className="mb-3">Dados Gerais</h4>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="nome">Nome*</Label>
                        <Input
                          type="text"
                          name="nome"
                          id="nome"
                          value={values.nome}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.nome && !!errors.nome}
                        />
                        {touched.nome && errors.nome && (
                          <div className="text-danger">{errors.nome}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="documento">CPF/CNPJ*</Label>
                        <Input
                          type="text"
                          name="documento"
                          id="documento"
                          value={values.documento}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.documento && !!errors.documento}
                        />
                        {touched.documento && errors.documento && (
                          <div className="text-danger">{errors.documento}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          placeholder="Email do cliente"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="telefone">Telefone*</Label>
                        <Input
                          type="text"
                          name="telefone"
                          id="telefone"
                          value={values.telefone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.telefone && !!errors.telefone}
                        />
                        {touched.telefone && errors.telefone && (
                          <div className="text-danger">{errors.telefone}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <h4 className="mb-3 mt-4">Endereço</h4>
                  <Row>
                    <Col md={8}>
                      <FormGroup>
                        <Label for="logradouro">Logradouro</Label>
                        <Input
                          type="text"
                          id="endereco.logradouro"
                          name="endereco.logradouro"
                          value={values.endereco.logradouro}
                          onChange={handleChange}
                          placeholder="Rua, Avenida, etc."
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="endereco.numero">Número*</Label>
                        <Input
                          type="text"
                          name="endereco.numero"
                          id="endereco.numero"
                          value={values.endereco.numero}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.endereco?.numero && !!errors.endereco?.numero}
                        />
                        {touched.endereco?.numero && errors.endereco?.numero && (
                          <div className="text-danger">{errors.endereco.numero}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="endereco.complemento">Complemento</Label>
                        <Input
                          type="text"
                          name="endereco.complemento"
                          id="endereco.complemento"
                          value={values.endereco.complemento}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="endereco.bairro">Bairro*</Label>
                        <Input
                          type="text"
                          name="endereco.bairro"
                          id="endereco.bairro"
                          value={values.endereco.bairro}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.endereco?.bairro && !!errors.endereco?.bairro}
                        />
                        {touched.endereco?.bairro && errors.endereco?.bairro && (
                          <div className="text-danger">{errors.endereco.bairro}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="endereco.cep">CEP*</Label>
                        <Input
                          type="text"
                          name="endereco.cep"
                          id="endereco.cep"
                          value={values.endereco.cep}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.endereco?.cep && !!errors.endereco?.cep}
                        />
                        {touched.endereco?.cep && errors.endereco?.cep && (
                          <div className="text-danger">{errors.endereco.cep}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* Campos de estado e cidade */}
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="endereco.estadoId">Estado*</Label>
                        <Input
                          type="select"
                          name="endereco.estadoId"
                          id="endereco.estadoId"
                          value={values.endereco.estadoId || estadoSelecionado || ''}
                          onChange={(e) => {
                            handleEstadoChange(e, setFieldValue);
                            handleBlur(e);
                          }}
                          invalid={touched.endereco?.estadoId && !!errors.endereco?.estadoId}
                        >
                          <option value="">Selecione um estado...</option>
                          {estados.map(estado => (
                            <option key={estado.id} value={estado.id}>
                              {estado.nome} ({estado.uf})
                            </option>
                          ))}
                        </Input>
                        <FormFeedback>{errors.endereco?.estadoId}</FormFeedback>
                      </FormGroup>
                    </Col>
                    
                    <Col md={8}>
                      <FormGroup>
                        <Label for="endereco.cidadeId">Cidade*</Label>
                        <div className="d-flex">
                          <Input
                            type="select"
                            name="endereco.cidadeId"
                            id="endereco.cidadeId"
                            value={values.endereco.cidadeId || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={!estadoSelecionado && cidades.length === 0}
                            invalid={touched.endereco?.cidadeId && !!errors.endereco?.cidadeId}
                            className="me-2 flex-grow-1"
                          >
                            <option value="">Selecione uma cidade...</option>
                            {cidades.map(cidade => (
                              <option key={cidade.id} value={cidade.id}>
                                {cidade.nome}
                              </option>
                            ))}
                          </Input>
                          <Button 
                            color="secondary"
                            onClick={abrirModalCidade}
                            disabled={!estadoSelecionado}
                            title={!estadoSelecionado ? "Selecione um estado primeiro" : "Adicionar nova cidade"}
                          >
                            + Nova Cidade
                          </Button>
                        </div>
                        {touched.endereco?.cidadeId && errors.endereco?.cidadeId && (
                          <div className="text-danger">{errors.endereco.cidadeId}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <h4 className="mb-3 mt-4">Observações</h4>
                  <FormGroup>
                    <Input
                      type="textarea"
                      name="observacoes"
                      id="observacoes"
                      rows={4}
                      value={values.observacoes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                  
                  {id && (
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="ativo"
                          checked={values.ativo}
                          onChange={handleChange}
                        />{' '}
                        Cliente ativo
                      </Label>
                    </FormGroup>
                  )}
                  
                  <div className="d-flex gap-2 mt-4">
                    <Button 
                      type="submit" 
                      color="primary" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Salvar
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      color="secondary" 
                      onClick={() => navigate('/clientes')}
                    >
                      <FontAwesomeIcon icon={faTimes} className="me-2" />
                      Cancelar
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>

      {/* Modal para Adicionar Nova Cidade */}
      <Modal isOpen={showCidadeModal} toggle={() => setShowCidadeModal(false)}>
        <ModalHeader toggle={() => setShowCidadeModal(false)}>
          Adicionar Nova Cidade
        </ModalHeader>
        <ModalBody>
          {errorModal && <Alert color="danger">{errorModal}</Alert>}
          
          <FormGroup>
            <Label for="nome">Nome da Cidade*</Label>
            <Input
              type="text"
              name="nome"
              id="nome"
              value={novaCidade.nome}
              onChange={handleNovaCidadeChange}
              placeholder="Nome da cidade"
            />
          </FormGroup>
          
          <FormGroup>
            <Label for="estadoId">Estado*</Label>
            <Input
              type="select"
              name="estadoId"
              id="estadoId"
              value={novaCidade.estadoId}
              onChange={handleNovaCidadeChange}
            >
              <option value="">Selecione um estado...</option>
              {estadosModal.map(estado => (
                <option key={estado.id} value={estado.id}>
                  {estado.nome} ({estado.uf})
                </option>
              ))}
            </Input>
          </FormGroup>
          
          <FormGroup>
            <Label for="codigoIBGE">Código IBGE</Label>
            <Input
              type="text"
              name="codigoIBGE"
              id="codigoIBGE"
              value={novaCidade.codigoIBGE}
              onChange={handleNovaCidadeChange}
              placeholder="Código IBGE (opcional)"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowCidadeModal(false)}>
            Cancelar
          </Button>
          <Button 
            color="primary" 
            onClick={salvarNovaCidade}
            disabled={loadingModal}
          >
            {loadingModal ? <Spinner size="sm" /> : 'Salvar'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ClienteForm;