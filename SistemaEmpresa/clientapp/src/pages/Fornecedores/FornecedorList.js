import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FornecedorList = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [fornecedorParaExcluir, setFornecedorParaExcluir] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/Fornecedor');
      setFornecedores(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar fornecedores:', err);
      setError('Não foi possível carregar a lista de fornecedores. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (fornecedor) => {
    setFornecedorParaExcluir(fornecedor);
    setModalExclusao(true);
  };

  const cancelarExclusao = () => {
    setModalExclusao(false);
    setFornecedorParaExcluir(null);
  };

  const excluirFornecedor = async () => {
    try {
      await axios.delete(`/api/Fornecedor/${fornecedorParaExcluir.id}`);
      carregarFornecedores();
      setModalExclusao(false);
    } catch (err) {
      console.error('Erro ao excluir fornecedor:', err);
      alert(`Erro ao excluir fornecedor: ${err.response?.data?.mensagem || 'Verifique se não há registros dependentes.'}`);
    }
  };

  if (loading && fornecedores.length === 0) {
    return (
      <Container className="d-flex justify-content-center p-5">
        <Spinner color="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      <Card className="border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Fornecedores</h2>
          <Button color="primary" onClick={() => navigate('/fornecedor/novo')}>
            + Novo Fornecedor
          </Button>
        </div>

        {error && <Alert color="danger">{error}</Alert>}

        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>Razão Social</th>
                <th>CNPJ</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Cidade</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">Nenhum fornecedor cadastrado.</td>
                </tr>
              ) : (
                fornecedores.map(fornecedor => (
                  <tr key={fornecedor.id}>
                    <td>{fornecedor.razaoSocial}</td>
                    <td>{fornecedor.cnpj || '-'}</td>
                    <td>{fornecedor.telefone || '-'}</td>
                    <td>{fornecedor.email || '-'}</td>
                    <td>{fornecedor.cidade?.nome || '-'}</td>
                    <td>
                      {fornecedor.ativo ? (
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
                        onClick={() => navigate(`/fornecedores/editar/${fornecedor.id}`)}
                      >
                        Editar
                      </Button>
                      <Button 
                        color="danger" 
                        size="sm"
                        onClick={() => confirmarExclusao(fornecedor)}
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
          Excluir Fornecedor
        </ModalHeader>
        <ModalBody>
          Tem certeza que deseja excluir o fornecedor "{fornecedorParaExcluir?.razaoSocial}"?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={cancelarExclusao}>
            Cancelar
          </Button>
          <Button color="danger" onClick={excluirFornecedor}>
            Excluir
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default FornecedorList;