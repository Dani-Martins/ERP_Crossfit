import React, { useState, useEffect } from 'react';
import { 
  Card, CardBody, Button, 
  Alert, Table, Input, InputGroup, InputGroupText, Badge 
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faTruck } from '@fortawesome/free-solid-svg-icons';

const TransportadoraList = () => {
  const [transportadoras, setTransportadoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTransportadoras = async () => {
      try {
        setLoading(true);
        // Dados simulados
        setTimeout(() => {
          setTransportadoras([
            { id: 1, nome: 'Transportadora Veloz', cnpj: '12.345.678/0001-90', telefone: '(11) 3456-7890', email: 'contato@veloz.com.br', cidade: 'São Paulo', uf: 'SP', ativo: true },
            { id: 2, nome: 'Express Logística', cnpj: '98.765.432/0001-10', telefone: '(21) 2345-6789', email: 'contato@expresslog.com.br', cidade: 'Rio de Janeiro', uf: 'RJ', ativo: true },
            { id: 3, nome: 'Rápida Entregas', cnpj: '45.678.901/0001-23', telefone: '(31) 3456-7890', email: 'contato@rapidaentregas.com.br', cidade: 'Belo Horizonte', uf: 'MG', ativo: false },
            { id: 4, nome: 'Sul Transportes', cnpj: '56.789.012/0001-34', telefone: '(41) 3456-7890', email: 'atendimento@sultransportes.com.br', cidade: 'Curitiba', uf: 'PR', ativo: true },
            { id: 5, nome: 'Norte Logística', cnpj: '67.890.123/0001-45', telefone: '(92) 3456-7890', email: 'contato@nortelogistica.com.br', cidade: 'Manaus', uf: 'AM', ativo: true }
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Erro ao carregar transportadoras: ' + err.message);
        setLoading(false);
      }
    };
    
    fetchTransportadoras();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transportadora?')) {
      try {
        // await TransportadoraService.delete(id);
        setTransportadoras(transportadoras.filter(transportadora => transportadora.id !== id));
      } catch (err) {
        setError('Erro ao excluir transportadora: ' + err.message);
      }
    }
  };
  
  const filteredTransportadoras = transportadoras.filter(transportadora => 
    transportadora.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    transportadora.cnpj.includes(searchTerm) ||
    transportadora.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transportadora.cidade.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <div className="page-header">
        <h2>
          <FontAwesomeIcon icon={faTruck} className="me-2" />
          Transportadoras
        </h2>
        <Button 
          color="primary"
          onClick={() => navigate('/transportadoras/novo')}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nova Transportadora
        </Button>
      </div>
      
      <Card className="mb-4">
        <CardBody>
          <InputGroup className="mb-3">
            <InputGroupText>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroupText>
            <Input 
              placeholder="Buscar por nome, CNPJ, email ou cidade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </CardBody>
      </Card>
      
      <Card>
        <CardBody>
          {error && <Alert color="danger">{error}</Alert>}
          
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-3">Carregando transportadoras...</p>
            </div>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Contato</th>
                  <th>Cidade/UF</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransportadoras.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Nenhuma transportadora encontrada
                    </td>
                  </tr>
                ) : (
                  filteredTransportadoras.map(transportadora => (
                    <tr key={transportadora.id}>
                      <td>{transportadora.nome}</td>
                      <td>{transportadora.cnpj}</td>
                      <td>
                        {transportadora.telefone}<br/>
                        <small>{transportadora.email}</small>
                      </td>
                      <td>{transportadora.cidade}/{transportadora.uf}</td>
                      <td>
                        <Badge color={transportadora.ativo ? "success" : "danger"}>
                          {transportadora.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            color="primary" 
                            size="sm"
                            onClick={() => navigate(`/transportadoras/editar/${transportadora.id}`)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button 
                            color="danger" 
                            size="sm"
                            onClick={() => handleDelete(transportadora.id)}
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
        </CardBody>
      </Card>
    </>
  );
};

export default TransportadoraList;