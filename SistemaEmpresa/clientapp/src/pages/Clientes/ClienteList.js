import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const ClienteSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  // Adicione outras validações conforme necessário
});

const initialValues = {
  nome: '',
  // Adicione outros valores iniciais conforme necessário
};

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
  const [showCidadeModal, setShowCidadeModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/Cliente');
      setClientes(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Não foi possível carregar a lista de clientes. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (cliente) => {
    setClienteParaExcluir(cliente);
    setModalExclusao(true);
  };

  const cancelarExclusao = () => {
    setModalExclusao(false);
    setClienteParaExcluir(null);
  };

  const excluirCliente = async () => {
    try {
      await axios.delete(`/api/Cliente/${clienteParaExcluir.id}`);
      carregarClientes();
      setModalExclusao(false);
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      alert(`Erro ao excluir cliente: ${err.response?.data?.mensagem || 'Verifique se não há registros dependentes.'}`);
    }
  };

  if (loading && clientes.length === 0) {
    return (
      <Container className="d-flex justify-content-center p-5">
        <Spinner color="primary" />
      </Container>
    );
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    // Lógica para salvar o novo cliente ou editar um existente
    setSubmitting(false);
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={ClienteSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {(formikProps) => {
          // Salve a referência às propriedades do Formik
          const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue } = formikProps;
          
          // Agora a função salvarNovaCidade pode usar setFieldValue diretamente
          
          return (
            <Form onSubmit={handleSubmit}>
              {/* Resto do seu formulário */}
            </Form>
          );
        }}
      </Formik>
      
      {/* Modal para Nova Cidade */}
      <Modal isOpen={showCidadeModal} toggle={() => setShowCidadeModal(false)}>
        {/* ... conteúdo do modal ... */}
      </Modal>

      <Container fluid className="p-0">
        <Card className="border-0">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Clientes</h2>
            <Button 
              color="primary" 
              onClick={() => {
                console.log("Navegando para cadastro de novo cliente");
                navigate('/clientes/novo'); // Certifique-se que esta rota está correta
              }}
            >
              + Novo Cliente
            </Button>
          </div>

          {error && <Alert color="danger">{error}</Alert>}

          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF/CNPJ</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Cidade</th>
                  <th>Situação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">Nenhum cliente cadastrado.</td>
                  </tr>
                ) : (
                  clientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td>{cliente.nome}</td>
                      <td>{cliente.cpf || cliente.cnpj || '-'}</td>
                      <td>{cliente.telefone || '-'}</td>
                      <td>{cliente.email || '-'}</td>
                      <td>{cliente.cidade?.nome || '-'}</td>
                      <td>
                        {cliente.ativo ? (
                          <Badge color="success">Ativo</Badge>
                        ) : (
                          <Badge color="danger">Inativo</Badge>
                        )}
                      </td>
                      <td>
                        <Button 
                          color="info" 
                          size="sm" 
                          className="me-2"
                          onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                        >
                          Editar
                        </Button>
                        <Button 
                          color="danger" 
                          size="sm"
                          onClick={() => confirmarExclusao(cliente)}
                        >
                          Excluir
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>

        <Modal isOpen={modalExclusao} toggle={cancelarExclusao}>
          <ModalHeader toggle={cancelarExclusao}>
            Excluir Cliente
          </ModalHeader>
          <ModalBody>
            Tem certeza que deseja excluir o cliente "{clienteParaExcluir?.nome}"?
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={cancelarExclusao}>
              Cancelar
            </Button>
            <Button color="danger" onClick={excluirCliente}>
              Excluir
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default ClienteList;