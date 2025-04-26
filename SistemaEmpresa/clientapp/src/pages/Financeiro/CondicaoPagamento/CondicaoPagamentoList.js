import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CondicaoPagamentoList = () => {
  const [condicoesPagamento, setCondicoesPagamento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [condicaoParaExcluir, setCondicaoParaExcluir] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    carregarCondicoesPagamento();
  }, []);

  const carregarCondicoesPagamento = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/CondicaoPagamento');
      setCondicoesPagamento(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar condições de pagamento:', err);
      setError('Não foi possível carregar a lista de condições de pagamento. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (condicao) => {
    setCondicaoParaExcluir(condicao);
    setModalExclusao(true);
  };

  const cancelarExclusao = () => {
    setModalExclusao(false);
    setCondicaoParaExcluir(null);
  };

  const excluirCondicaoPagamento = async () => {
    try {
      await axios.delete(`/api/CondicaoPagamento/${condicaoParaExcluir.id}`);
      carregarCondicoesPagamento();
      setModalExclusao(false);
    } catch (err) {
      console.error('Erro ao excluir condição de pagamento:', err);
      alert(`Erro ao excluir condição de pagamento: ${err.response?.data?.mensagem || 'Verifique se não há registros dependentes.'}`);
    }
  };

  if (loading && condicoesPagamento.length === 0) {
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
          <h2>Condições de Pagamento</h2>
          <Button color="primary" onClick={() => navigate('/financeiro/condicoes-pagamento/novo')}>
            + Nova Condição
          </Button>
        </div>

        {error && <Alert color="danger">{error}</Alert>}

        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>À Vista</th>
                <th>Juros (%)</th>
                <th>Multa (%)</th>
                <th>Desconto (%)</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {condicoesPagamento.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">Nenhuma condição de pagamento cadastrada.</td>
                </tr>
              ) : (
                condicoesPagamento.map(condicao => (
                  <tr key={condicao.id}>
                    <td>{condicao.codigo}</td>
                    <td>{condicao.descricao}</td>
                    <td>{condicao.aVista ? 'Sim' : 'Não'}</td>
                    <td>{condicao.percentualJuros}%</td>
                    <td>{condicao.percentualMulta}%</td>
                    <td>{condicao.percentualDesconto}%</td>
                    <td>
                      {condicao.ativo ? (
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
                        onClick={() => navigate(`/financeiro/condicoes-pagamento/editar/${condicao.id}`)}
                      >
                        Editar
                      </Button>
                      <Button 
                        color="danger" 
                        size="sm"
                        onClick={() => confirmarExclusao(condicao)}
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
          Excluir Condição de Pagamento
        </ModalHeader>
        <ModalBody>
          Tem certeza que deseja excluir a condição de pagamento "{condicaoParaExcluir?.descricao}"?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={cancelarExclusao}>
            Cancelar
          </Button>
          <Button color="danger" onClick={excluirCondicaoPagamento}>
            Excluir
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default CondicaoPagamentoList;