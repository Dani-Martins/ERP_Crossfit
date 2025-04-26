import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardBody, Form, FormGroup, Label, Input, 
  Button, Alert, Spinner, Row, Col, Nav, NavItem, NavLink,
  TabContent, TabPane
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, faArrowLeft, faTimes, faIdCard, 
  faMapMarkerAlt, faPhone, faDollarSign
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// Schema de validação
const FornecedorSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  cnpj: Yup.string()
    .required('CNPJ é obrigatório')
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, 'CNPJ inválido'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  telefone: Yup.string()
    .required('Telefone é obrigatório'),
  endereco: Yup.object().shape({
    logradouro: Yup.string().required('Logradouro é obrigatório'),
    numero: Yup.string().required('Número é obrigatório'),
    bairro: Yup.string().required('Bairro é obrigatório'),
    cidade: Yup.string().required('Cidade é obrigatória'),
    uf: Yup.string().required('UF é obrigatória').length(2, 'UF deve ter 2 caracteres'),
    cep: Yup.string().required('CEP é obrigatório').length(8, 'CEP deve ter 8 dígitos')
  }),
  contato: Yup.object().shape({
    nome: Yup.string().required('Nome do contato é obrigatório'),
    email: Yup.string().email('Email inválido'),
    telefone: Yup.string()
  }),
  financeiro: Yup.object().shape({
    banco: Yup.string(),
    agencia: Yup.string(),
    conta: Yup.string(),
    pix: Yup.string()
  })
});

const FornecedorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [initialValues, setInitialValues] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    site: '',
    inscricaoEstadual: '',
    observacoes: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: ''
    },
    contato: {
      nome: '',
      cargo: '',
      email: '',
      telefone: ''
    },
    financeiro: {
      banco: '',
      agencia: '',
      conta: '',
      pix: ''
    },
    ativo: true
  });
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Carregar dados do fornecedor para edição
    const fetchFornecedor = async () => {
      if (id) {
        try {
          setLoading(true);
          
          // Código similar para buscar dados reais de fornecedores
          const response = await axios.get(`/api/Fornecedor/${id}`);
          const fornecedorData = response.data;
          
          setInitialValues({
            razaoSocial: fornecedorData.razaoSocial || '',
            nomeFantasia: fornecedorData.nomeFantasia || '',
            cnpj: fornecedorData.cnpj || '',
            inscricaoEstadual: fornecedorData.inscricaoEstadual || '',
            email: fornecedorData.email || '',
            telefone: fornecedorData.telefone || '',
            endereco: {
              logradouro: fornecedorData.endereco?.logradouro || '',
              numero: fornecedorData.endereco?.numero || '',
              complemento: fornecedorData.endereco?.complemento || '',
              bairro: fornecedorData.endereco?.bairro || '',
              cidadeId: fornecedorData.endereco?.cidadeId || '',
              cep: fornecedorData.endereco?.cep || ''
            },
            contato: {
              nome: fornecedorData.contato?.nome || '',
              email: fornecedorData.contato?.email || '',
              telefone: fornecedorData.contato?.telefone || '',
              cargo: fornecedorData.contato?.cargo || ''
            },
            ativo: fornecedorData.ativo !== false
          });
          
        } catch (err) {
          console.error('Erro ao carregar fornecedor:', err);
          setError('Erro ao carregar dados do fornecedor: ' + (err.response?.data?.message || err.message));
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchFornecedor();
  }, [id]);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      
      if (id) {
        // await FornecedorService.update(id, values);
        console.log('Atualizando fornecedor:', values);
      } else {
        // await FornecedorService.create(values);
        console.log('Criando fornecedor:', values);
      }
      
      navigate('/fornecedores');
    } catch (err) {
      setError('Erro ao salvar fornecedor: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }
  
  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
        <p className="mt-3">Carregando dados do fornecedor...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="page-header">
        <h2>{id ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
        <Button 
          color="secondary" 
          onClick={() => navigate('/fornecedores')}
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
            validationSchema={FornecedorSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Nav tabs className="mb-4">
                  <NavItem>
                    <NavLink
                      className={activeTab === '1' ? 'active' : ''}
                      onClick={() => toggle('1')}
                    >
                      <FontAwesomeIcon icon={faIdCard} className="me-2" />
                      Dados Gerais
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === '2' ? 'active' : ''}
                      onClick={() => toggle('2')}
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                      Endereço
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === '3' ? 'active' : ''}
                      onClick={() => toggle('3')}
                    >
                      <FontAwesomeIcon icon={faPhone} className="me-2" />
                      Contato
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === '4' ? 'active' : ''}
                      onClick={() => toggle('4')}
                    >
                      <FontAwesomeIcon icon={faDollarSign} className="me-2" />
                      Dados Financeiros
                    </NavLink>
                  </NavItem>
                </Nav>
                
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Col md={8}>
                        <FormGroup>
                          <Label for="nome">Nome/Razão Social*</Label>
                          <Input
                            type="text"
                            name="nome"
                            id="nome"
                            maxLength={100}
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
                      
                      <Col md={4}>
                        <FormGroup>
                          <Label for="cnpj">CNPJ*</Label>
                          <Input
                            type="text"
                            name="cnpj"
                            id="cnpj"
                            maxLength={18}
                            value={values.cnpj}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.cnpj && !!errors.cnpj}
                          />
                          {touched.cnpj && errors.cnpj && (
                            <div className="text-danger">{errors.cnpj}</div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="inscricaoEstadual">Inscrição Estadual</Label>
                          <Input
                            type="text"
                            name="inscricaoEstadual"
                            id="inscricaoEstadual"
                            value={values.inscricaoEstadual}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                      
                      <Col md={4}>
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
                      
                      <Col md={4}>
                        <FormGroup>
                          <Label for="email">Email*</Label>
                          <Input
                            type="email"
                            name="email"
                            id="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.email && !!errors.email}
                          />
                          {touched.email && errors.email && (
                            <div className="text-danger">{errors.email}</div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <FormGroup>
                      <Label for="site">Website</Label>
                      <Input
                        type="text"
                        name="site"
                        id="site"
                        value={values.site}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label for="observacoes">Observações</Label>
                      <Input
                        type="textarea"
                        name="observacoes"
                        id="observacoes"
                        rows={3}
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
                          Fornecedor ativo
                        </Label>
                      </FormGroup>
                    )}
                  </TabPane>
                  
                  <TabPane tabId="2">
                    <Row>
                      <Col md={8}>
                        <FormGroup>
                          <Label for="endereco.logradouro">Logradouro*</Label>
                          <Input
                            type="text"
                            name="endereco.logradouro"
                            id="endereco.logradouro"
                            value={values.endereco.logradouro}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.endereco?.logradouro && !!errors.endereco?.logradouro}
                          />
                          {touched.endereco?.logradouro && errors.endereco?.logradouro && (
                            <div className="text-danger">{errors.endereco.logradouro}</div>
                          )}
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
                      
                      <Col md={8}>
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
                    </Row>
                    
                    <Row>
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
                      
                      <Col md={6}>
                        <FormGroup>
                          <Label for="endereco.cidade">Cidade*</Label>
                          <Input
                            type="text"
                            name="endereco.cidade"
                            id="endereco.cidade"
                            value={values.endereco.cidade}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.endereco?.cidade && !!errors.endereco?.cidade}
                          />
                          {touched.endereco?.cidade && errors.endereco?.cidade && (
                            <div className="text-danger">{errors.endereco.cidade}</div>
                          )}
                        </FormGroup>
                      </Col>
                      
                      <Col md={2}>
                        <FormGroup>
                          <Label for="endereco.uf">UF*</Label>
                          <Input
                            type="select"
                            name="endereco.uf"
                            id="endereco.uf"
                            value={values.endereco.uf}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.endereco?.uf && !!errors.endereco?.uf}
                          >
                            <option value="">UF</option>
                            <option value="AC">AC</option>
                            <option value="AL">AL</option>
                            <option value="AP">AP</option>
                            <option value="AM">AM</option>
                            <option value="BA">BA</option>
                            <option value="CE">CE</option>
                            <option value="DF">DF</option>
                            <option value="ES">ES</option>
                            <option value="GO">GO</option>
                            <option value="MA">MA</option>
                            <option value="MT">MT</option>
                            <option value="MS">MS</option>
                            <option value="MG">MG</option>
                            <option value="PA">PA</option>
                            <option value="PB">PB</option>
                            <option value="PR">PR</option>
                            <option value="PE">PE</option>
                            <option value="PI">PI</option>
                            <option value="RJ">RJ</option>
                            <option value="RN">RN</option>
                            <option value="RS">RS</option>
                            <option value="RO">RO</option>
                            <option value="RR">RR</option>
                            <option value="SC">SC</option>
                            <option value="SP">SP</option>
                            <option value="SE">SE</option>
                            <option value="TO">TO</option>
                          </Input>
                          {touched.endereco?.uf && errors.endereco?.uf && (
                            <div className="text-danger">{errors.endereco.uf}</div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                  </TabPane>
                  
                  <TabPane tabId="3">
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="contato.nome">Nome do Contato*</Label>
                          <Input
                            type="text"
                            name="contato.nome"
                            id="contato.nome"
                            value={values.contato.nome}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.contato?.nome && !!errors.contato?.nome}
                          />
                          {touched.contato?.nome && errors.contato?.nome && (
                            <div className="text-danger">{errors.contato.nome}</div>
                          )}
                        </FormGroup>
                      </Col>
                      
                      <Col md={6}>
                        <FormGroup>
                          <Label for="contato.cargo">Cargo</Label>
                          <Input
                            type="text"
                            name="contato.cargo"
                            id="contato.cargo"
                            value={values.contato.cargo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="contato.email">Email</Label>
                          <Input
                            type="email"
                            name="contato.email"
                            id="contato.email"
                            value={values.contato.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.contato?.email && !!errors.contato?.email}
                          />
                          {touched.contato?.email && errors.contato?.email && (
                            <div className="text-danger">{errors.contato.email}</div>
                          )}
                        </FormGroup>
                      </Col>
                      
                      <Col md={6}>
                        <FormGroup>
                          <Label for="contato.telefone">Telefone</Label>
                          <Input
                            type="text"
                            name="contato.telefone"
                            id="contato.telefone"
                            value={values.contato.telefone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </TabPane>
                  
                  <TabPane tabId="4">
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="financeiro.banco">Banco</Label>
                          <Input
                            type="text"
                            name="financeiro.banco"
                            id="financeiro.banco"
                            value={values.financeiro.banco}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                      
                      <Col md={4}>
                        <FormGroup>
                          <Label for="financeiro.agencia">Agência</Label>
                          <Input
                            type="text"
                            name="financeiro.agencia"
                            id="financeiro.agencia"
                            value={values.financeiro.agencia}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                      
                      <Col md={4}>
                        <FormGroup>
                          <Label for="financeiro.conta">Conta</Label>
                          <Input
                            type="text"
                            name="financeiro.conta"
                            id="financeiro.conta"
                            value={values.financeiro.conta}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <FormGroup>
                      <Label for="financeiro.pix">Chave PIX</Label>
                      <Input
                        type="text"
                        name="financeiro.pix"
                        id="financeiro.pix"
                        value={values.financeiro.pix}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </TabPane>
                </TabContent>
                
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
                    onClick={() => navigate('/fornecedores')}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    Cancelar
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </div>
  );
};

export default FornecedorForm;