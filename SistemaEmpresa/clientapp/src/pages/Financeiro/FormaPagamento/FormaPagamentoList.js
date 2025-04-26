import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FormaPagamentoList = () => {
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [formaPagamentoParaExcluir, setFormaPagamentoParaExcluir] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    carregarFormasPagamento();
  }, []);

  const carregarFormasPagamento = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/FormaPagamento');
      setFormasPagamento(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar formas de pagamento:', err);
      setError('Não foi possível carregar a lista de formas de pagamento. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (formaPagamento) => {
    setFormaPagamentoParaExcluir(formaPagamento);
    setModalExclusao(true);
  };

  const cancelarExclusao = () => {
    setModalExclusao(false);
    setFormaPagamentoParaExcluir(null);
  };

  const excluirFormaPagamento = async () => {
    try {
      await axios.delete(`/api/FormaPagamento/${formaPagamentoParaExcluir.id}`);
      carregarFormasPagamento();
      setModalExclusao(false);
    } catch (err) {
      console.error('Erro ao excluir forma de pagamento:', err);
      alert(`Erro ao excluir forma de pagamento: ${err.response?.data?.mensagem || 'Verifique se não há registros dependentes.'}`);
    }
  };

  if (loading && formasPagamento.length === 0) {
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
          <h2>Formas de Pagamento</h2>
          <Button color="primary" onClick={() => navigate('/financeiro/formas-pagamento/novo')}>
            + Nova Forma de Pagamento
          </Button>
        </div>

        {error && <Alert color="danger">{error}</Alert>}

        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {formasPagamento.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">Nenhuma forma de pagamento cadastrada.</td>
                </tr>
              ) : (
                formasPagamento.map(forma => (
                  <tr key={forma.id}>
                    <td>{forma.descricao}</td>
                    <td>
                      {forma.ativo ? (
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
                        onClick={() => navigate(`/financeiro/formas-pagamento/editar/${forma.id}`)}
                      >
                        Editar
                      </Button>
                      <Button 
                        color="danger" 
                        size="sm"
                        onClick={() => confirmarExclusao(forma)}
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
          Excluir Forma de Pagamento
        </ModalHeader>
        <ModalBody>
          Tem certeza que deseja excluir a forma de pagamento "{formaPagamentoParaExcluir?.descricao}"?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={cancelarExclusao}>
            Cancelar
          </Button>
          <Button color="danger" onClick={excluirFormaPagamento}>
            Excluir
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default FormaPagamentoList;