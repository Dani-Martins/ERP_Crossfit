import React, { useState, useEffect } from 'react';
import { 
  Card, CardHeader, CardBody, Button, 
  Input, Row, Col, Alert, Table, Badge,
  InputGroup, UncontrolledDropdown, DropdownToggle, 
  DropdownMenu, DropdownItem 
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faEye, faSearch,
  faSort, faSortUp, faSortDown, faFilter, faFileExport
} from '@fortawesome/free-solid-svg-icons';
import apiClient from '../../api/client';

const ProdutoList = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('nome');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        // CORRIGIDO: removido dados mockados, agora usa API real
        const response = await apiClient.get('/api/Produto');
        console.log('Dados recebidos da API Produto:', response.data);
        setProdutos(response.data);
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Falha ao carregar os produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);
  
  const handleSorting = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };
  
  // Filtragem e ordenação dos produtos
  const filteredProdutos = produtos
    .filter(produto => 
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(produto => 
      filtroCategoria ? produto.categoria === filtroCategoria : true
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
  
  // Lista única de categorias para o filtro
  const categorias = [...new Set(produtos.map(produto => produto.categoria))];
  
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        // await ProdutoService.delete(id);
        setProdutos(produtos.filter(produto => produto.id !== id));
      } catch (err) {
        setError('Erro ao excluir produto: ' + err.message);
      }
    }
  };
  
  const getSortIcon = (field) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faSort} />;
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} /> 
      : <FontAwesomeIcon icon={faSortDown} />;
  };
  
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Produtos</h2>
        <Button 
          color="primary"
          onClick={() => navigate('/produtos/novo')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Novo Produto
        </Button>
      </div>
      
      <Card className="mb-4">
        <CardBody>
          <Row className="mb-3">
            <Col md={4}>
              <InputGroup>
                <Input
                  placeholder="Buscar por nome ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button color="secondary">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </InputGroup>
            </Col>
            <Col md={3}>
              <Input
                type="select"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {categorias.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </Input>
            </Col>
            <Col className="d-flex justify-content-end">
              <UncontrolledDropdown>
                <DropdownToggle color="light" caret>
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  Filtros
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setProdutos(produtos)}>Todos</DropdownItem>
                  <DropdownItem onClick={() => setProdutos(produtos.filter(p => p.ativo))}>Ativos</DropdownItem>
                  <DropdownItem onClick={() => setProdutos(produtos.filter(p => !p.ativo))}>Inativos</DropdownItem>
                  <DropdownItem onClick={() => setProdutos(produtos.filter(p => p.estoque <= 0))}>Sem estoque</DropdownItem>
                  <DropdownItem onClick={() => setProdutos(produtos.filter(p => p.estoque > 0 && p.estoque < 10))}>Estoque baixo</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              
              <Button color="success" className="ms-2">
                <FontAwesomeIcon icon={faFileExport} className="me-2" />
                Exportar
              </Button>
            </Col>
          </Row>
          
          {error && <Alert color="danger">{error}</Alert>}
          
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-3">Carregando produtos...</p>
            </div>
          ) : (
            <Table hover responsive striped>
              <thead>
                <tr>
                  <th onClick={() => handleSorting('codigo')} style={{cursor: 'pointer'}}>
                    Código {getSortIcon('codigo')}
                  </th>
                  <th onClick={() => handleSorting('nome')} style={{cursor: 'pointer'}}>
                    Nome {getSortIcon('nome')}
                  </th>
                  <th onClick={() => handleSorting('preco')} style={{cursor: 'pointer'}}>
                    Preço {getSortIcon('preco')}
                  </th>
                  <th onClick={() => handleSorting('estoque')} style={{cursor: 'pointer'}}>
                    Estoque {getSortIcon('estoque')}
                  </th>
                  <th onClick={() => handleSorting('categoria')} style={{cursor: 'pointer'}}>
                    Categoria {getSortIcon('categoria')}
                  </th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProdutos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                ) : (
                  filteredProdutos.map(produto => (
                    <tr key={produto.id}>
                      <td>{produto.codigo}</td>
                      <td>{produto.nome}</td>
                      <td>
                        {produto.preco.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </td>
                      <td>
                        <Badge color={produto.estoque <= 0 ? 'danger' : produto.estoque < 10 ? 'warning' : 'success'}>
                          {produto.estoque}
                        </Badge>
                      </td>
                      <td>{produto.categoria}</td>
                      <td>
                        <Badge color={produto.ativo ? 'success' : 'danger'}>
                          {produto.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            color="info" 
                            size="sm" 
                            onClick={() => navigate(`/produtos/${produto.id}`)}
                            title="Ver detalhes"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Button 
                            color="primary" 
                            size="sm"
                            onClick={() => navigate(`/produtos/editar/${produto.id}`)}
                            title="Editar"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button 
                            color="danger" 
                            size="sm"
                            onClick={() => handleDelete(produto.id)}
                            title="Excluir"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Exibindo {filteredProdutos.length} de {produtos.length} produtos
            </div>
            {/* Paginação pode ser adicionada aqui */}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default ProdutoList;