import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button, Table, Alert, Form, FormGroup, Label, Input } from 'reactstrap';
// import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Remove esta linha se não tiver react-icons
import EstadoService from '../../../api/services/estadoService';
import PaisService from '../../../api/services/paisService';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';

const EstadoList = () => {
  const [estados, setEstados] = useState([]);
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [estadoParaExcluir, setEstadoParaExcluir] = useState(null);
  const [paisFiltro, setPaisFiltro] = useState(null);

  // Definindo fetchData fora do useEffect para poder reutilizá-la
  const fetchData = async () => {
    try {
      setLoading(true);
      // Usar o paisId como parâmetro opcional, ou null para todos
      const data = await EstadoService.getAll(null); // Buscar todos os estados
      setEstados(data);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      setError('Falha ao carregar os estados. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Executar fetchData quando o componente montar
  useEffect(() => {
    fetchData();
    
    // Adicionar listener para eventos de navegação
    const handleNavigation = () => {
      // Recarregar dados quando a página for visitada
      fetchData();
    };
    
    // Registrar listener
    window.addEventListener('focus', handleNavigation);
    
    // Cleanup
    return () => {
      window.removeEventListener('focus', handleNavigation);
    };
  }, []);

  // No useEffect, carregar também a lista de países
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [estadosData, paisesData] = await Promise.all([
          EstadoService.getAll(paisFiltro),
          PaisService.getAll()
        ]);
        
        setEstados(estadosData);
        setPaises(paisesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Falha ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [paisFiltro]); // Recarregar quando o filtro mudar

  const handleDelete = async (id) => {
    try {
      await EstadoService.delete(id);
      await fetchData(); // Agora fetchData está acessível aqui
      setModalOpen(false);
      setEstadoParaExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir estado:', error);
      setError('Não foi possível excluir o estado. Tente novamente.');
    }
  };

  const openDeleteModal = (estado) => {
    setEstadoParaExcluir(estado);
    setModalOpen(true);
  };

  if (loading) {
    return <div className="text-center my-5">Carregando...</div>;
  }

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Estados</h3>
          <Link to="/localizacao/estados/novo">
            <Button color="primary">
              {/* Substituir FaPlus por texto se não tiver react-icons */}
              + Novo Estado
            </Button>
          </Link>
        </div>

        {error && <Alert color="danger">{error}</Alert>}

        {/* Adicionar o filtro na interface, antes da tabela */}
        <div className="mb-3">
          <Form inline>
            <FormGroup className="me-2">
              <Label for="paisFiltro" className="me-2">Filtrar por País:</Label>
              <Input 
                type="select" 
                id="paisFiltro"
                value={paisFiltro || ''}
                onChange={e => setPaisFiltro(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Todos os Países</option>
                {paises.map(pais => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nome}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Form>
        </div>

        <Table responsive striped>
          <thead>
            <tr>
              <th>Nome</th>
              <th>UF</th>
              <th>País</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {estados && estados.length > 0 ? (
              estados.map((estado) => (
                <tr key={estado.id}>
                  <td>{estado.nome}</td>
                  <td>{estado.uf}</td>
                  <td>{estado.paisNome}</td>
                  <td>
                    <Link 
                      to={`/localizacao/estados/editar/${estado.id}`} 
                      className="btn btn-sm btn-info me-2"
                    >
                      Editar
                    </Link>
                    <Button color="danger" size="sm" onClick={() => openDeleteModal(estado)}>
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Nenhum estado cadastrado.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>

      <DeleteConfirmationModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        onDelete={() => handleDelete(estadoParaExcluir?.id)}
        title="Excluir Estado"
        message={`Tem certeza que deseja excluir o estado "${estadoParaExcluir?.nome}"?`}
      />
    </Card>
  );
};

export default EstadoList;