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
  faMapMarkerAlt, faPhone, faUser, faMoneyBill, faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// Schema de validação
const FuncionarioSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  cpf: Yup.string()
    .required('CPF é obrigatório')
    .matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 'CPF inválido'),
  cargo: Yup.string()
    .required('Cargo é obrigatório'),
  departamento: Yup.string()
    .required('Departamento é obrigatório'),
  dataNascimento: Yup.date()
    .required('Data de nascimento é obrigatória')
    .max(new Date(), 'Data de nascimento não pode ser no futuro'),
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
  dadosBancarios: Yup.object().shape({
    banco: Yup.string(),
    agencia: Yup.string(),
    conta: Yup.string(),
    tipoConta: Yup.string()
  }),
  acesso: Yup.object().shape({
    usuario: Yup.string().required('Nome de usuário é obrigatório'),
    senha: Yup.string(),
    confirmacaoSenha: Yup.string()
      .oneOf([Yup.ref('senha'), null], 'As senhas devem corresponder'),
    nivel: Yup.string().required('Nível de acesso é obrigatório')
  })
});

const FuncionarioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [initialValues, setInitialValues] = useState({
    nome: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    genero: '',
    estadoCivil: '',
    cargo: '',
    departamento: '',
    dataAdmissao: '',
    salario: '',
    email: '',
    telefone: '',
    celular: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: ''
    },
    dadosBancarios: {
      banco: '',
      agencia: '',
      conta: '',
      tipoConta: 'corrente'
    },
    acesso: {
      usuario: '',
      senha: '',
      confirmacaoSenha: '',
      nivel: 'usuario',
      permissoes: {
        vendas: false,
        financeiro: false,
        estoque: false,
        relatorios: false,
        cadastros: false,
        configuracoes: false
      }
    },
    observacoes: '',
    ativo: true
  });
  const [error, setError] = useState(null);
  
  // Opções para os campos de seleção
  const generoOptions = ['Masculino', 'Feminino', 'Outro', 'Prefiro não informar'];
  const estadoCivilOptions = ['Solteiro(a)', 'Casado(a)', 'União Estável', 'Divorciado(a)', 'Viúvo(a)'];
  const departamentoOptions = ['Comercial', 'Financeiro', 'Administrativo', 'RH', 'TI', 'Operacional', 'Logística'];
  const nivelAcessoOptions = ['administrador', 'gerente', 'usuario', 'visualizador'];
  
  useEffect(() => {
    // Carregar dados do funcionário para edição
    const fetchFuncionario = async () => {
      if (id) {
        try {
          setLoading(true);
          
          // Substituir o código de simulação por uma chamada real à API
          const response = await axios.get(`/api/Funcionario/${id}`);
          const funcionarioData = response.data;
          
          // Adaptar os dados recebidos da API para o formato do formulário
          setInitialValues({
            nome: funcionarioData.nome || '',
            cpf: funcionarioData.cpf || '',
            rg: funcionarioData.rg || '',
            dataNascimento: funcionarioData.dataNascimento ? funcionarioData.dataNascimento.substr(0, 10) : '',
            genero: funcionarioData.genero || '',
            estadoCivil: funcionarioData.estadoCivil || '',
            cargo: funcionarioData.cargo || '',
            departamento: funcionarioData.departamento || '',
            dataAdmissao: funcionarioData.dataAdmissao ? funcionarioData.dataAdmissao.substr(0, 10) : '',
            salario: funcionarioData.salario || '',
            email: funcionarioData.email || '',
            telefone: funcionarioData.telefone || '',
            celular: funcionarioData.celular || '',
            endereco: {
              logradouro: funcionarioData.endereco?.logradouro || '',
              numero: funcionarioData.endereco?.numero || '',
              complemento: funcionarioData.endereco?.complemento || '',
              bairro: funcionarioData.endereco?.bairro || '',
              cidade: funcionarioData.endereco?.cidade || '',
              uf: funcionarioData.endereco?.uf || '',
              cep: funcionarioData.endereco?.cep || ''
            },
            dadosBancarios: {
              banco: funcionarioData.dadosBancarios?.banco || '',
              agencia: funcionarioData.dadosBancarios?.agencia || '',
              conta: funcionarioData.dadosBancarios?.conta || '',
              tipoConta: funcionarioData.dadosBancarios?.tipoConta || 'corrente'
            },
            acesso: {
              usuario: funcionarioData.acesso?.usuario || '',
              senha: '',
              confirmacaoSenha: '',
              nivel: funcionarioData.acesso?.nivel || 'usuario',
              permissoes: funcionarioData.acesso?.permissoes || {
                vendas: false,
                financeiro: false,
                estoque: false,
                relatorios: false,
                cadastros: false,
                configuracoes: false
              }
            },
            observacoes: funcionarioData.observacoes || '',
            ativo: funcionarioData.ativo !== false // true por padrão se não for explicitamente false
          });
          
        } catch (err) {
          console.error('Erro ao carregar funcionário:', err);
          setError('Erro ao carregar dados do funcionário: ' + (err.response?.data?.message || err.message));
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchFuncionario();
  }, [id]);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      
      if (id) {
        // await FuncionarioService.update(id, values);
        console.log('Atualizando funcionário:', values);
      } else {
        // await FuncionarioService.create(values);
        console.log('Criando funcionário:', values);
      }
      
      navigate('/funcionarios');
    } catch (err) {
      setError('Erro ao salvar funcionário: ' + err.message);
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
        <p className="mt-3">Carregando dados do funcionário...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="page-header">
        <h2>{id ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
        <Button 
          color="secondary" 
          onClick={() => navigate('/funcionarios')}
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
            validationSchema={FuncionarioSchema}
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
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Dados Pessoais
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === '2' ? 'active' : ''}
                      onClick={() => toggle('2')}
                    >
                      <FontAwesomeIcon icon={faIdCard} className="me-2" />
                      Dados Profissionais
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === '3' ? 'active' : ''}
                      onClick={() => toggle('3')}
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                      Endereço
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === '4' ? 'active' : ''}
                      onClick={() => toggle('4')}
                    >
                      <FontAwesomeIcon icon={faMoneyBill} className="me-2" />
                      Dados Bancários
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === '5' ? 'active' : ''}
                      onClick={() => toggle('5')}
                    >
                      <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                      Acesso ao Sistema
                    </NavLink>
                  </NavItem>
                </Nav>
                
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Col md={8}>
                        <FormGroup>
                          <Label for="nome">Nome Completo*</Label>
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
                          <Label for="dataNascimento">Data de Nascimento*</Label>
                          <Input
                            type="date"
                            name="dataNascimento"
                            id="dataNascimento"
                            value={values.dataNascimento}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.dataNascimento && !!errors.dataNascimento}
                          />
                          {touched.dataNascimento && errors.dataNascimento && (
                            <div className="text-danger">{errors.dataNascimento}</div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="cpf">CPF*</Label>
                          <Input
                            type="text"
                            name="cpf"
                            id="cpf"
                            maxLength={14}
                            value={values.cpf}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.cpf && !!errors.cpf}
                          />
                          {touched.cpf && errors.cpf && (
                            <div className="text-danger">{errors.cpf}</div>
                          )}
                        </FormGroup>
                      </Col>
                      
                      <Col md={4}>
                        <FormGroup>
                          <Label for="rg">RG</Label>
                          <Input
                            type="text"
                            name="rg"
                            id="rg"
                            value={values.rg}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                      
                      <Col md={4}>
                        <FormGroup>
                          <Label for="genero">Gênero</Label>
                          <Input
                            type="select"
                            name="genero"
                            id="genero"
                            value={values.genero}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="">Selecione...</option>
                            {generoOptions.map((genero, index) => (
                              <option key={index} value={genero}>
                                {genero}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="estadoCivil">Estado Civil</Label>
                          <Input
                            type="select"
                            name="estadoCivil"
                            id="estadoCivil"
                            value={values.estadoCivil}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="">Selecione...</option>
                            {estadoCivilOptions.map((estadoCivil, index) => (
                              <option key={index} value={estadoCivil}>
                                {estadoCivil}
                              </option>
                            ))}
                          </Input>
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
                          <Label for="celular">Celular</Label>
                          <Input
                            type="text"
                            name="celular"
                            id="celular"
                            value={values.celular}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    
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
                  </TabPane>
                  
                  <TabPane tabId="2">
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="cargo">Cargo*</Label>
                          <Input
                            type="text"
                            name="cargo"
                            id="cargo"
                            value={values.cargo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.cargo && !!errors.cargo}
                          />
                          {touched.cargo && errors.cargo && (
                            <div className="text-danger">{errors.cargo}</div>
                          )}
                        </FormGroup>
                      </Col>
                      
                      <Col md={6}>
                        <FormGroup>
                          <Label for="departamento">Departamento*</Label>
                          <Input
                            type="select"
                            name="departamento"
                            id="departamento"
                            value={values.departamento}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.departamento && !!errors.departamento}
                          >
                            <option value="">Selecione...</option>
                            {departamentoOptions.map((departamento, index) => (
                              <option key={index} value={departamento}>
                                {departamento}
                              </option>
                            ))}
                          </Input>
                          {touched.departamento && errors.departamento && (
                            <div className="text-danger">{errors.departamento}</div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="dataAdmissao">Data de Admissão</Label>
                          <Input
                            type="date"
                            name="dataAdmissao"
                            id="dataAdmissao"
                            value={values.dataAdmissao}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                      
                      <Col md={6}>
                        <FormGroup>
                          <Label for="salario">Salário</Label>
                          <Input
                            type="number"
                            name="salario"
                            id="salario"
                            step="0.01"
                            min="0"
                            value={values.salario}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    
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
                          Funcionário ativo
                        </Label>
                      </FormGroup>
                    )}
                  </TabPane>
                  
                  <TabPane tabId="3">
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
                  
                  <TabPane tabId="4">
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="dadosBancarios.banco">Banco</Label>
                          <Input
                            type="text"
                            name="dadosBancarios.banco"
                            id="dadosBancarios.banco"
                            value={values.dadosBancarios.banco}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                      
                      <Col md={3}>
                        <FormGroup>
                          <Label for="dadosBancarios.agencia">Agência</Label>
                          <Input
                            type="text"
                            name="dadosBancarios.agencia"
                            id="dadosBancarios.agencia"
                            value={values.dadosBancarios.agencia}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                      
                      <Col md={3}>
                        <FormGroup>
                          <Label for="dadosBancarios.conta">Conta</Label>
                          <Input
                            type="text"
                            name="dadosBancarios.conta"
                            id="dadosBancarios.conta"
                            value={values.dadosBancarios.conta}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <FormGroup>
                      <Label for="dadosBancarios.tipoConta">Tipo de Conta</Label>
                      <div>
                        <FormGroup check inline>
                          <Label check>
                            <Input
                              type="radio"
                              name="dadosBancarios.tipoConta"
                              value="corrente"
                              checked={values.dadosBancarios.tipoConta === 'corrente'}
                              onChange={handleChange}
                            />{' '}
                            Conta Corrente
                          </Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Label check>
                            <Input
                              type="radio"
                              name="dadosBancarios.tipoConta"
                              value="poupanca"
                              checked={values.dadosBancarios.tipoConta === 'poupanca'}
                              onChange={handleChange}
                            />{' '}
                            Conta Poupança
                          </Label>
                        </FormGroup>
                      </div>
                    </FormGroup>
                  </TabPane>
                  
                  <TabPane tabId="5">
                    <Alert color="info">
                      {id ? 'Altere os dados de acesso do funcionário ao sistema.' 
                      : 'Configure o acesso do funcionário ao sistema.'}
                    </Alert>
                    
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="acesso.usuario">Nome de Usuário*</Label>
                          <Input
                            type="text"
                            name="acesso.usuario"
                            id="acesso.usuario"
                            value={values.acesso.usuario}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.acesso?.usuario && !!errors.acesso?.usuario}
                          />
                          {touched.acesso?.usuario && errors.acesso?.usuario && (
                            <div className="text-danger">{errors.acesso.usuario}</div>
                          )}
                        </FormGroup>
                      </Col>
                      
                      <Col md={6}>
                        <FormGroup>
                          <Label for="acesso.nivel">Nível de Acesso*</Label>
                          <Input
                            type="select"
                            name="acesso.nivel"
                            id="acesso.nivel"
                            value={values.acesso.nivel}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.acesso?.nivel && !!errors.acesso?.nivel}
                          >
                            <option value="">Selecione...</option>
                            {nivelAcessoOptions.map((nivel, index) => (
                              <option key={index} value={nivel}>
                                {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                              </option>
                            ))}
                          </Input>
                          {touched.acesso?.nivel && errors.acesso?.nivel && (
                            <div className="text-danger">{errors.acesso.nivel}</div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="acesso.senha">
                            {id ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha*'}
                          </Label>
                          <Input
                            type="password"
                            name="acesso.senha"
                            id="acesso.senha"
                            value={values.acesso.senha}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.acesso?.senha && !!errors.acesso?.senha}
                          />
                          {touched.acesso?.senha && errors.acesso?.senha && (
                            <div className="text-danger">{errors.acesso.senha}</div>
                          )}
                        </FormGroup>
                      </Col>
                      
                      <Col md={6}>
                        <FormGroup>
                          <Label for="acesso.confirmacaoSenha">
                            Confirmar Senha
                          </Label>
                          <Input
                            type="password"
                            name="acesso.confirmacaoSenha"
                            id="acesso.confirmacaoSenha"
                            value={values.acesso.confirmacaoSenha}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.acesso?.confirmacaoSenha && !!errors.acesso?.confirmacaoSenha}
                          />
                          {touched.acesso?.confirmacaoSenha && errors.acesso?.confirmacaoSenha && (
                            <div className="text-danger">{errors.acesso.confirmacaoSenha}</div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <FormGroup>
                      <Label>Permissões</Label>
                      <div>
                        <Row>
                          <Col md={4}>
                            <FormGroup check>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="acesso.permissoes.vendas"
                                  checked={values.acesso.permissoes.vendas}
                                  onChange={handleChange}
                                />{' '}
                                Vendas
                              </Label>
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup check>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="acesso.permissoes.financeiro"
                                  checked={values.acesso.permissoes.financeiro}
                                  onChange={handleChange}
                                />{' '}
                                Financeiro
                              </Label>
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup check>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="acesso.permissoes.estoque"
                                  checked={values.acesso.permissoes.estoque}
                                  onChange={handleChange}
                                />{' '}
                                Estoque
                              </Label>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col md={4}>
                            <FormGroup check>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="acesso.permissoes.relatorios"
                                  checked={values.acesso.permissoes.relatorios}
                                  onChange={handleChange}
                                />{' '}
                                Relatórios
                              </Label>
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup check>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="acesso.permissoes.cadastros"
                                  checked={values.acesso.permissoes.cadastros}
                                  onChange={handleChange}
                                />{' '}
                                Cadastros
                              </Label>
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup check>
                              <Label check>
                                <Input
                                  type="checkbox"
                                  name="acesso.permissoes.configuracoes"
                                  checked={values.acesso.permissoes.configuracoes}
                                  onChange={handleChange}
                                />{' '}
                                Configurações
                              </Label>
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
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
                    onClick={() => navigate('/funcionarios')}
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

export default FuncionarioForm;