import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FuncionarioList = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/Funcionario');
      setFuncionarios(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
      setError('Não foi possível carregar a lista de funcionários. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const confirmarExclusao = (funcionario) => {
    setFuncionarioParaExcluir(funcionario);
    setModalExclusao(true);
  };

  const cancelarExclusao = () => {
    setModalExclusao(false);
    setFuncionarioParaExcluir(null);
  };

  const excluirFuncionario = async () => {
    try {
      await axios.delete(`/api/Funcionario/${funcionarioParaExcluir.id}`);
      carregarFuncionarios();
      setModalExclusao(false);
    } catch (err) {
      console.error('Erro ao excluir funcionário:', err);
      alert(`Erro ao excluir funcionário: ${err.response?.data?.mensagem || 'Verifique se não há registros dependentes.'}`);
    }
  };

  if (loading && funcionarios.length === 0) {
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
          <h2>Funcionários</h2>
          <Button color="primary" onClick={() => navigate('/funcionario/novo')}>
            + Novo Funcionário
          </Button>
        </div>

        {error && <Alert color="danger">{error}</Alert>}

        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Cargo</th>
                <th>Telefone</th>
                <th>Data Admissão</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">Nenhum funcionário cadastrado.</td>
                </tr>
              ) : (
                funcionarios.map(funcionario => (
                  <tr key={funcionario.id}>
                    <td>{funcionario.nome}</td>
                    <td>{funcionario.cpf || '-'}</td>
                    <td>{funcionario.cargo || '-'}</td>
                    <td>{funcionario.telefone || '-'}</td>
                    <td>{formatarData(funcionario.dataAdmissao)}</td>
                    <td>
                      {funcionario.ativo ? (
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
                        onClick={() => navigate(`/funcionarios/editar/${funcionario.id}`)}
                      >
                        Editar
                      </Button>
                      <Button 
                        color="danger" 
                        size="sm"
                        onClick={() => confirmarExclusao(funcionario)}
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
          Excluir Funcionário
        </ModalHeader>
        <ModalBody>
          Tem certeza que deseja excluir o funcionário "{funcionarioParaExcluir?.nome}"?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={cancelarExclusao}>
            Cancelar
          </Button>
          <Button color="danger" onClick={excluirFuncionario}>
            Excluir
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default FuncionarioList;