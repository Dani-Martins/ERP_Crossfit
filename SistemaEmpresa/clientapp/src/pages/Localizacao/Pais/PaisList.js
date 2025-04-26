import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Table, Alert } from 'reactstrap';
import PaisService from '../../../api/services/paisService';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import axios from 'axios';

const PaisList = () => {
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [paisParaExcluir, setPaisParaExcluir] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await PaisService.getAll();
      setPaises(data);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar países:', error);
      setError('Falha ao carregar os países. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Usa o país armazenado na variável de estado para mostrar o nome em caso de erro
      const paisNome = paisParaExcluir?.nome;
      
      await PaisService.delete(id);
      await fetchData();
      setModalOpen(false);
      setPaisParaExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir país:', error);
      
      let mensagemErro = "Não foi possível excluir o país.";
      
      // Verificar se é erro de restrição de chave estrangeira
      if (error.response && error.response.data && 
          typeof error.response.data === 'string' &&
          error.response.data.includes('foreign key constraint fails')) {
        mensagemErro = `Não é possível excluir o país "${paisParaExcluir.nome}" porque existem estados associados a ele.`;
      }
      
      setModalOpen(false);
      setPaisParaExcluir(null);
      setError(mensagemErro);
    }
  };

  const openDeleteModal = (pais) => {
    setPaisParaExcluir(pais);
    setModalOpen(true);
  };

  if (loading) {
    return <div className="text-center my-5">Carregando...</div>;
  }

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Países</h3>
          <Link to="/localizacao/paises/novo">
            <Button color="primary">
              + Novo País
            </Button>
          </Link>
        </div>

        {error && <Alert color="danger">{error}</Alert>}

        <Table responsive striped>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Sigla</th>
              <th>Código</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paises.length > 0 ? (
              paises.map(pais => (
                <tr key={pais.id}>
                  <td>{pais.nome}</td>
                  <td>{pais.sigla}</td>
                  <td>{pais.codigo ? `+${pais.codigo}` : ''}</td>
                  <td>
                    <Link to={`/localizacao/paises/editar/${pais.id}`} className="btn btn-sm btn-info me-2">
                      Editar
                    </Link>
                    <Button color="danger" size="sm" onClick={() => openDeleteModal(pais)}>
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Nenhum país cadastrado.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>

      <DeleteConfirmationModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        onDelete={() => handleDelete(paisParaExcluir?.id)}
        title="Excluir País"
        message={`Tem certeza que deseja excluir o país "${paisParaExcluir?.nome}"?`}
      />
    </Card>
  );
};

export default PaisList;