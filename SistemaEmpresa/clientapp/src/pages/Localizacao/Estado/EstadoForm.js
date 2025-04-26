import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Form, FormGroup, Label, Input, Button, Alert, InputGroup, InputGroupText } from 'reactstrap';
import EstadoService from '../../../api/services/estadoService';
import PaisService from '../../../api/services/paisService';
// Ajustar o caminho de importação para o componente existente
import PaisModalForm from '../../../components/PaisModalForm/PaisModalForm';

const EstadoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  
  const [formData, setFormData] = useState({
    nome: '',
    uf: '',
    paisId: ''
  });
  
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paisModalOpen, setPaisModalOpen] = useState(false);

  // Carregar lista de países para o dropdown
  const fetchPaises = async () => {
    try {
      const data = await PaisService.getAll();
      setPaises(data);
    } catch (error) {
      console.error('Erro ao buscar países:', error);
      setError('Erro ao carregar a lista de países.');
    }
  };

  useEffect(() => {
    fetchPaises();
  }, []);

  // Buscar dados do estado se for edição
  useEffect(() => {
    if (!isNew) {
      const fetchEstado = async () => {
        try {
          setLoading(true);
          const estadoData = await EstadoService.getById(id);
          setFormData({
            nome: estadoData.nome,
            uf: estadoData.uf,
            paisId: estadoData.paisId.toString()
          });
          setError(null);
        } catch (error) {
          console.error('Erro ao buscar estado:', error);
          setError('Não foi possível carregar os dados do estado.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchEstado();
    }
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Converter paisId para número
      const estadoData = {
        ...formData,
        paisId: parseInt(formData.paisId, 10)
      };
      
      if (isNew) {
        await EstadoService.create(estadoData);
      } else {
        await EstadoService.update(id, estadoData);
      }
      
      setSuccess(true);
      
      // Navegar após breve delay
      setTimeout(() => {
        navigate('/localizacao/estados');
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
      setError('Ocorreu um erro ao salvar o estado. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Handler para quando um novo país é salvo
  const handlePaisSaved = async (novoPais) => {
    // Recarregar a lista completa de países para obter o ID correto
    await fetchPaises();
    
    // Se o ID retornado for válido, selecione-o
    if (novoPais && novoPais.id > 0) {
      setFormData(prev => ({
        ...prev,
        paisId: novoPais.id.toString()
      }));
    } else {
      // Se o ID for inválido, tente encontrar o país pelo nome
      const paisesAtualizados = await PaisService.getAll();
      const paisEncontrado = paisesAtualizados.find(p => 
        p.nome.toUpperCase() === novoPais.nome.toUpperCase()
      );
      
      if (paisEncontrado) {
        setFormData(prev => ({
          ...prev,
          paisId: paisEncontrado.id.toString()
        }));
      }
    }
  };

  return (
    <Card>
      <CardBody>
        <h3>{isNew ? 'Novo Estado' : 'Editar Estado'}</h3>
        
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">Estado salvo com sucesso!</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="nome">Nome</Label>
            <Input 
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label for="uf">UF/SIGLA</Label>
            <Input 
              type="text"
              id="uf"
              name="uf"
              value={formData.uf}
              onChange={handleChange}
              required
              maxLength={5}
              placeholder="Ex: SP, RJ, MG, QC, ON, etc."
            />
            <small className="form-text text-muted">
              UF para estados brasileiros ou sigla para regiões/províncias de outros países
            </small>
          </FormGroup>
          
          <FormGroup>
            <Label for="paisId">País</Label>
            <InputGroup>
              <Input 
                type="select"
                id="paisId"
                name="paisId"
                value={formData.paisId}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um país</option>
                {paises.map(pais => (
                  <option key={pais.id} value={pais.id}>
                    {pais.nome}
                  </option>
                ))}
              </Input>
              <Button 
                color="success" 
                onClick={() => setPaisModalOpen(true)}
                title="Cadastrar novo país"
              >
                + Novo País
              </Button>
            </InputGroup>
            <small className="form-text text-muted">
              Se o país não estiver na lista, clique em "Novo País" para adicioná-lo
            </small>
          </FormGroup>
          
          <div className="d-flex justify-content-end">
            <Button 
              color="primary" 
              type="submit"
              className="me-2"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            
            <Button 
              color="secondary" 
              onClick={() => navigate('/localizacao/estados')}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </Form>

        {/* Usar o componente existente em vez do novo */}
        <PaisModalForm 
          isOpen={paisModalOpen}
          toggle={() => setPaisModalOpen(!paisModalOpen)}
          onSaved={handlePaisSaved}
        />
      </CardBody>
    </Card>
  );
};

export default EstadoForm;