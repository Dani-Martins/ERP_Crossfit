import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardHeader, CardBody, Form, FormGroup, Label, Input, 
  Button, Row, Col, Alert, Spinner, InputGroup, InputGroupText 
} from 'reactstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faTimes, faBarcode } from '@fortawesome/free-solid-svg-icons';
import { ProdutoService } from '../../api/services';

// Schema de validação
const ProdutoSchema = Yup.object().shape({
  codigo: Yup.string()
    .required('Código é obrigatório'),
  nome: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  descricao: Yup.string(),
  preco: Yup.number()
    .required('Preço é obrigatório')
    .positive('Preço deve ser positivo'),
  estoque: Yup.number()
    .required('Quantidade em estoque é obrigatória')
    .min(0, 'Estoque não pode ser negativo'),
  categoriaId: Yup.number()
    .required('Categoria é obrigatória'),
  fornecedorId: Yup.number()
    .required('Fornecedor é obrigatório')
});

const ProdutoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    categoriaId: '',
    fornecedorId: '',
    unidadeMedida: '',
    pesoLiquido: '',
    pesoBruto: '',
    dimensoes: {
      altura: '',
      largura: '',
      profundidade: ''
    },
    codigoBarras: '',
    ativo: true
  });
  const [categorias, setCategorias] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [error, setError] = useState(null);
  
  // Carregar dados do produto e listas auxiliares
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simular categorias
        setCategorias([
          { id: 1, nome: 'Eletrônicos' },
          { id: 2, nome: 'Móveis' },
          { id: 3, nome: 'Roupas' },
          { id: 4, nome: 'Alimentos' }
        ]);
        
        // Simular fornecedores
        setFornecedores([
          { id: 1, nome: 'Fornecedor A' },
          { id: 2, nome: 'Fornecedor B' },
          { id: 3, nome: 'Fornecedor C' }
        ]);
        
        // Se for edição, carrega o produto
        if (id) {
          // Simular produto para desenvolvimento
          setTimeout(() => {
            setInitialValues({
              codigo: 'PROD-001',
              nome: 'Smartphone XYZ',
              descricao: 'Smartphone de última geração com câmera de alta resolução',
              preco: '1299.90',
              estoque: '50',
              categoriaId: 1,
              fornecedorId: 2,
              unidadeMedida: 'UN',
              pesoLiquido: '0.18',
              pesoBruto: '0.25',
              dimensoes: {
                altura: '15',
                largura: '7.5',
                profundidade: '0.8'
              },
              codigoBarras: '7891234567890',
              ativo: true
            });
            setLoading(false);
          }, 1000);
          
          // Descomente quando a API estiver pronta:
          // const data = await ProdutoService.getById(id);
          // setInitialValues(data);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError('Erro ao carregar dados: ' + err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      
      if (id) {
        // await ProdutoService.update(id, values);
        console.log('Atualizando produto:', values);
      } else {
        // await ProdutoService.create(values);
        console.log('Criando produto:', values);
      }
      
      navigate('/produtos');
    } catch (err) {
      setError('Erro ao salvar produto: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
        <p className="mt-3">Carregando dados do produto...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="page-header">
        <h2>{id ? 'Editar Produto' : 'Novo Produto'}</h2>
        <Button 
          color="secondary" 
          onClick={() => navigate('/produtos')}
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
            validationSchema={ProdutoSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <h4 className="mb-3">Informações Básicas</h4>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="codigo">Código*</Label>
                      <Input
                        type="text"
                        name="codigo"
                        id="codigo"
                        value={values.codigo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.codigo && !!errors.codigo}
                      />
                      {touched.codigo && errors.codigo && (
                        <div className="text-danger">{errors.codigo}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={8}>
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
                </Row>
                
                <FormGroup>
                  <Label for="descricao">Descrição</Label>
                  <Input
                    type="textarea"
                    name="descricao"
                    id="descricao"
                    rows={3}
                    value={values.descricao}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormGroup>
                
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="categoriaId">Categoria*</Label>
                      <Input
                        type="select"
                        name="categoriaId"
                        id="categoriaId"
                        value={values.categoriaId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.categoriaId && !!errors.categoriaId}
                      >
                        <option value="">Selecione...</option>
                        {categorias.map(categoria => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                          </option>
                        ))}
                      </Input>
                      {touched.categoriaId && errors.categoriaId && (
                        <div className="text-danger">{errors.categoriaId}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="fornecedorId">Fornecedor*</Label>
                      <Input
                        type="select"
                        name="fornecedorId"
                        id="fornecedorId"
                        value={values.fornecedorId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.fornecedorId && !!errors.fornecedorId}
                      >
                        <option value="">Selecione...</option>
                        {fornecedores.map(fornecedor => (
                          <option key={fornecedor.id} value={fornecedor.id}>
                            {fornecedor.nome}
                          </option>
                        ))}
                      </Input>
                      {touched.fornecedorId && errors.fornecedorId && (
                        <div className="text-danger">{errors.fornecedorId}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="unidadeMedida">Unidade de Medida</Label>
                      <Input
                        type="select"
                        name="unidadeMedida"
                        id="unidadeMedida"
                        value={values.unidadeMedida}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="">Selecione...</option>
                        <option value="UN">Unidade</option>
                        <option value="KG">Quilograma</option>
                        <option value="MT">Metro</option>
                        <option value="LT">Litro</option>
                        <option value="CX">Caixa</option>
                        <option value="PC">Pacote</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                
                <h4 className="mb-3 mt-4">Preço e Estoque</h4>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="preco">Preço (R$)*</Label>
                      <InputGroup>
                        <InputGroupText>R$</InputGroupText>
                        <Input
                          type="number"
                          step="0.01"
                          name="preco"
                          id="preco"
                          value={values.preco}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.preco && !!errors.preco}
                        />
                      </InputGroup>
                      {touched.preco && errors.preco && (
                        <div className="text-danger">{errors.preco}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="estoque">Estoque*</Label>
                      <Input
                        type="number"
                        name="estoque"
                        id="estoque"
                        value={values.estoque}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.estoque && !!errors.estoque}
                      />
                      {touched.estoque && errors.estoque && (
                        <div className="text-danger">{errors.estoque}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="codigoBarras">Código de Barras</Label>
                      <InputGroup>
                        <Input
                          type="text"
                          name="codigoBarras"
                          id="codigoBarras"
                          value={values.codigoBarras}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Button color="secondary">
                          <FontAwesomeIcon icon={faBarcode} />
                        </Button>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
                
                <h4 className="mb-3 mt-4">Informações Adicionais</h4>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="pesoLiquido">Peso Líquido (kg)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        name="pesoLiquido"
                        id="pesoLiquido"
                        value={values.pesoLiquido}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="pesoBruto">Peso Bruto (kg)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        name="pesoBruto"
                        id="pesoBruto"
                        value={values.pesoBruto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="dimensoes.altura">Altura (cm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        name="dimensoes.altura"
                        id="dimensoes.altura"
                        value={values.dimensoes.altura}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="dimensoes.largura">Largura (cm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        name="dimensoes.largura"
                        id="dimensoes.largura"
                        value={values.dimensoes.largura}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="dimensoes.profundidade">Profundidade (cm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        name="dimensoes.profundidade"
                        id="dimensoes.profundidade"
                        value={values.dimensoes.profundidade}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                
                {id && (
                  <FormGroup check className="mt-3">
                    <Label check>
                      <Input
                        type="checkbox"
                        name="ativo"
                        checked={values.ativo}
                        onChange={handleChange}
                      />{' '}
                      Produto ativo
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
                    onClick={() => navigate('/produtos')}
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

export default ProdutoForm;