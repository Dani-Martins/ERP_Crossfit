import React, { useState, useEffect } from 'react';
import { 
  Container, Button, Table, Spinner, Alert, Input, 
  Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody
} from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CidadeList = () => {
  const [cidades, setCidades] = useState([]);
  const [estados, setEstados] = useState([]);
  const [filtroEstadoId, setFiltroEstadoId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [cidadeParaExcluir, setCidadeParaExcluir] = useState(null);
  const [usarExclusaoForcada, setUsarExclusaoForcada] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    carregarEstados();
    carregarCidades();
  }, []);

  // Carregar dados quando mudar o filtro
  useEffect(() => {
    carregarCidades();
  }, [filtroEstadoId]);

  // Função para carregar estados
  const carregarEstados = async () => {
    try {
      const response = await axios.get('/api/Estado');
      setEstados(response.data);
    } catch (err) {
      console.error('Erro ao carregar estados:', err);
      setError('Não foi possível carregar a lista de estados.');
    }
  };

  // Modifique a função carregarCidades para melhor tratamento de erros
  const carregarCidades = async () => {
    setLoading(true);
    setError(null); // Limpar erro anterior
    
    try {
      let url = '/api/Cidade';
      
      // Se filtroEstadoId for um valor válido (não vazio, não nulo)
      if (filtroEstadoId) {
        console.log(`Aplicando filtro por Estado ID: ${filtroEstadoId}`);
        url = `/api/Cidade/PorEstado/${filtroEstadoId}`;
      } else {
        console.log('Carregando todas as cidades (sem filtro)');
      }
      
      console.log(`Chamando API: ${url}`);
      const response = await axios.get(url);
      
      console.log(`Resposta recebida: ${response.data.length} cidades`);
      setCidades(response.data);
    } catch (err) {
      console.error('Erro ao carregar cidades:', err);
      
      let mensagemErro = 'Não foi possível carregar a lista de cidades.';
      
      // Tentar extrair mensagem de erro mais específica
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          mensagemErro = err.response.data;
        } else if (err.response.data.mensagem) {
          mensagemErro = err.response.data.mensagem;
        }
      }
      
      setError(mensagemErro);
      setCidades([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para confirmar exclusão
  const confirmarExclusao = (cidade) => {
    setCidadeParaExcluir(cidade);
    setModalExcluir(true);
  };

  // Atualize a função excluirCidade para usar o endpoint POST alternativo
  const excluirCidade = async () => {
    try {
      console.log(`Tentando excluir cidade com ID: ${cidadeParaExcluir.id}`);
      
      // Primeiro tenta a exclusão normal
      try {
        await axios.delete(`/api/Cidade/${cidadeParaExcluir.id}`);
      } catch (normalError) {
        console.log('Exclusão normal falhou, tentando exclusão forçada:', normalError);
        
        // Se a exclusão normal falhar, tente a exclusão forçada
        await axios.post(`/api/Cidade/ExcluirForcado/${cidadeParaExcluir.id}`);
      }
      
      setModalExcluir(false);
      setCidadeParaExcluir(null);
      setError(null);
      await carregarCidades();
    } catch (err) {
      console.error('Erro ao excluir cidade:', err);
      
      let mensagemErro = "Não foi possível excluir a cidade.";
      
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          mensagemErro = err.response.data;
        } else if (err.response.data.mensagem) {
          mensagemErro = err.response.data.mensagem;
        }
      }
      
      setError(mensagemErro);
      setModalExcluir(false);
    }
  };

  const excluirCidadeAlternativo = async () => {
    try {
      // Chamar um endpoint alternativo que funciona igual ao Swagger
      await axios.post(`/api/Cidade/Excluir/${cidadeParaExcluir.id}`);
      
      setModalExcluir(false);
      setCidadeParaExcluir(null);
      setError(null);
      await carregarCidades();
    } catch (err) {
      // Tratamento de erro como antes
      console.error('Erro ao excluir cidade (método alternativo):', err);
      
      let mensagem = "Não foi possível excluir a cidade.";
      
      if (err.response) {
        mensagem = err.response.data?.mensagem || mensagem;
      }
      
      setError(mensagem);
      setModalExcluir(false);
    }
  };

  const excluirCidadeForcado = async () => {
    try {
      console.log(`Tentando exclusão forçada da cidade com ID: ${cidadeParaExcluir.id}`);
      await axios.post(`/api/Cidade/ExcluirForcado/${cidadeParaExcluir.id}`);
      
      setModalExcluir(false);
      setCidadeParaExcluir(null);
      setError(null);
      await carregarCidades();
    } catch (err) {
      console.error('Erro ao excluir cidade (forçado):', err);
      
      let mensagemErro = "Não foi possível excluir a cidade, mesmo no modo forçado.";
      
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          mensagemErro = err.response.data;
        } else if (err.response.data.mensagem) {
          mensagemErro = err.response.data.mensagem;
        }
      }
      
      setError(mensagemErro);
      setModalExcluir(false);
    }
  };

  // Toggle do modal
  const toggleModal = () => {
    setModalExcluir(!modalExcluir);
    if (!modalExcluir) {
      setCidadeParaExcluir(null);
    }
  };

  return (
    <>
      {/* Modal de exclusão usando o componente Modal do Reactstrap */}
      <Modal isOpen={modalExcluir} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Excluir Cidade
        </ModalHeader>
        <ModalBody>
          <p>Tem certeza que deseja excluir a cidade "{cidadeParaExcluir?.nome}"?</p>
          {usarExclusaoForcada && (
            <div className="alert alert-warning">
              <strong>Atenção!</strong> A exclusão forçada pode causar inconsistências no banco de dados.
              Use apenas se souber o que está fazendo.
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {!usarExclusaoForcada ? (
            <>
              <Button color="danger" onClick={excluirCidade}>
                Excluir
              </Button>
              <Button color="secondary" onClick={() => setUsarExclusaoForcada(true)}>
                Tentar Exclusão Forçada
              </Button>
              <Button color="light" onClick={toggleModal}>
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button color="danger" onClick={excluirCidadeForcado}>
                Confirmar Exclusão Forçada
              </Button>
              <Button color="secondary" onClick={() => setUsarExclusaoForcada(false)}>
                Voltar
              </Button>
              <Button color="light" onClick={toggleModal}>
                Cancelar
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>

      {/* Conteúdo principal */}
      <Card className="border shadow-sm">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Cidades</h2>
            <Link to="/localizacao/cidades/novo">
              <Button color="primary">+ Nova Cidade</Button>
            </Link>
          </div>

          <div className="mb-4">
            <label htmlFor="filtroEstado" className="form-label">Filtrar por Estado:</label>
            <Input
              type="select"
              id="filtroEstado"
              value={filtroEstadoId}
              onChange={(e) => {
                const valor = e.target.value;
                console.log(`Filtro alterado para: ${valor}`);
                setFiltroEstadoId(valor);
              }}
              className="form-select"
            >
              <option value="">Todos os Estados</option>
              {estados.map(estado => (
                <option key={estado.id} value={estado.id}>
                  {estado.nome}
                </option>
              ))}
            </Input>
          </div>

          {error && (
            <Alert 
              color="danger" 
              toggle={() => setError(null)} 
              transition={{ timeout: 150 }} // Adicione esta linha
              fade={true} // Use fade sem timeout
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center p-5">
              <Spinner color="primary" />
            </div>
          ) : (
            <Table hover striped bordered className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nome</th>
                  <th>Código Geográfico de Município</th>
                  <th>Estado</th>
                  <th style={{ width: "200px" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cidades.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Nenhuma cidade encontrada.
                    </td>
                  </tr>
                ) : (
                  cidades.map(cidade => (
                    <tr key={cidade.id}>
                      <td>{cidade.nome}</td>
                      <td>{cidade.codigoIBGE || '-'}</td>
                      <td>{cidade.estado?.nome || '-'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link to={`/localizacao/cidades/editar/${cidade.id}`}>
                            <Button color="info" size="sm">
                              Editar
                            </Button>
                          </Link>
                          <Button 
                            color="danger" 
                            size="sm" 
                            onClick={() => confirmarExclusao(cidade)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default CidadeList;