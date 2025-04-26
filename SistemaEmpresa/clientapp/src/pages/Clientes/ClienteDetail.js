import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardHeader, CardBody, Button, Row, Col, 
  Table, Alert, Spinner, Badge, Nav, NavItem, NavLink, TabContent, TabPane 
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, faArrowLeft, faUser, faShoppingCart, faFileAlt, 
  faMapMarkerAlt, faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';
import { ClienteService } from '../../api/services';

const ClienteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [vendas, setVendas] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simular dados para desenvolvimento
        setTimeout(() => {
          setCliente({
            id: id,
            nome: 'Cliente Exemplo',
            documento: '123.456.789-00',
            email: 'cliente@exemplo.com',
            telefone: '(11) 98765-4321',
            endereco: {
              logradouro: 'Rua Exemplo',
              numero: '123',
              complemento: 'Apto 45',
              bairro: 'Centro',
              cidade: 'São Paulo',
              uf: 'SP',
              cep: '01234-567'
            },
            observacoes: 'Cliente VIP, merece atenção especial.',
            dataCadastro: '2023-01-15',
            ativo: true
          });
          
          setVendas([
            { id: 1, data: '2023-03-10', valor: 289.90, status: 'Finalizada' },
            { id: 2, data: '2023-02-15', valor: 159.50, status: 'Finalizada' },
            { id: 3, data: '2023-01-20', valor: 450.00, status: 'Cancelada' }
          ]);
          
          setLoading(false);
        }, 1000);
        
        // Descomente quando a API estiver pronta:
        // const data = await ClienteService.getById(id);
        // setCliente(data);
        // const vendasData = await VendaService.getVendasByCliente(id);
        // setVendas(vendasData);
      } catch (err) {
        setError('Erro ao carregar cliente: ' + err.message);
        setLoading(false);
      }
    };
    
    fetchCliente();
  }, [id]);
  
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  
  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
        <p className="mt-3">Carregando dados do cliente...</p>
      </div>
    );
  }
  
  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }
  
  if (!cliente) {
    return <Alert color="warning">Cliente não encontrado</Alert>;
  }
  
  return (
    <div>
      <div className="page-header">
        <h2>Detalhes do Cliente</h2>
        <div className="d-flex gap-2">
          <Button 
            color="primary" 
            onClick={() => navigate(`/clientes/editar/${id}`)}
          >
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Editar
          </Button>
          <Button 
            color="secondary" 
            onClick={() => navigate('/clientes')}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Voltar
          </Button>
        </div>
      </div>
      
      <Card className="mb-4">
        <CardBody>
          <Row>
            <Col md={8}>
              <h3>{cliente.nome}</h3>
              <p className="text-muted mb-0">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                {cliente.documento}
              </p>
              <p>
                <Badge color={cliente.ativo ? 'success' : 'danger'}>
                  {cliente.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </p>
              <hr />
              <Row>
                <Col md={6}>
                  <p className="mb-1"><strong>Email:</strong></p>
                  <p>{cliente.email}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><strong>Telefone:</strong></p>
                  <p>{cliente.telefone}</p>
                </Col>
              </Row>
              <p className="mb-1"><strong>Data de Cadastro:</strong></p>
              <p>{new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</p>
            </Col>
            <Col md={4}>
              <Card className="bg-light">
                <CardBody>
                  <h5>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                    Endereço
                  </h5>
                  <address>
                    {cliente.endereco.logradouro}, {cliente.endereco.numero}
                    {cliente.endereco.complemento && <><br />{cliente.endereco.complemento}</>}
                    <br />
                    {cliente.endereco.bairro}
                    <br />
                    {cliente.endereco.cidade} - {cliente.endereco.uf}
                    <br />
                    CEP: {cliente.endereco.cep}
                  </address>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>
      
      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab === '1' ? 'active' : ''}
            onClick={() => toggle('1')}
          >
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            Histórico de Vendas
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === '2' ? 'active' : ''}
            onClick={() => toggle('2')}
          >
            <FontAwesomeIcon icon={faFileAlt} className="me-2" />
            Documentos
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === '3' ? 'active' : ''}
            onClick={() => toggle('3')}
          >
            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
            Observações
          </NavLink>
        </NavItem>
      </Nav>
      
      <TabContent activeTab={activeTab} className="p-4 border border-top-0 rounded-bottom mb-4">
        <TabPane tabId="1">
          <h4>Histórico de Vendas</h4>
          {vendas.length === 0 ? (
            <p>Este cliente não possui vendas registradas.</p>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map(venda => (
                  <tr key={venda.id}>
                    <td>{venda.id}</td>
                    <td>{new Date(venda.data).toLocaleDateString('pt-BR')}</td>
                    <td>
                      {parseFloat(venda.valor).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </td>
                    <td>
                      <Badge color={venda.status === 'Finalizada' ? 'success' : 'danger'}>
                        {venda.status}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        color="info" 
                        size="sm" 
                        onClick={() => navigate(`/vendas/${venda.id}`)}
                      >
                        Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </TabPane>
        <TabPane tabId="2">
          <h4>Documentos</h4>
          <p>Nenhum documento disponível para este cliente.</p>
        </TabPane>
        <TabPane tabId="3">
          <h4>Observações</h4>
          <p>{cliente.observacoes || 'Nenhuma observação registrada.'}</p>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default ClienteDetail;