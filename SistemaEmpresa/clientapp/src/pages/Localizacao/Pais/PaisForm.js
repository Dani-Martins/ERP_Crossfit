import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Form, FormGroup, Label, Input, Button, Alert, InputGroup, InputGroupText } from 'reactstrap';
import PaisService from '../../../api/services/paisService';

const PaisForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    codigo: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const fetchPais = async () => {
        try {
          setLoading(true);
          console.log("Buscando país com ID:", id);
          
          const paisData = await PaisService.getById(id);
          console.log("Dados recebidos do país:", paisData);
          
          setFormData({
            nome: paisData.nome || '',
            sigla: paisData.sigla || '',
            codigo: paisData.codigo || ''
          });
        } catch (error) {
          console.error("Erro ao buscar país:", error);
          setError("Não foi possível carregar os dados do país");
        } finally {
          setLoading(false);
        }
      };
      
      fetchPais();
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
      if (isNew) {
        await PaisService.create(formData);
      } else {
        await PaisService.update(id, formData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/localizacao/paises'); // Ajuste para a rota correta de listagem
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar país:', error);
      setError('Ocorreu um erro ao salvar o país. Por favor tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <h3>{isNew ? 'Novo País' : 'Editar País'}</h3>
        
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">País salvo com sucesso!</Alert>}
        
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
            <Label for="sigla">Sigla</Label>
            <Input 
              type="text"
              id="sigla"
              name="sigla"
              value={formData.sigla}
              onChange={handleChange}
              maxLength={3}
              placeholder="Digite a sigla com 3 letras (Ex: BRA, USA, JPN)"
            />
          </FormGroup>
          
          <FormGroup>
            <Label for="codigo">Código Telefônico</Label>
            <InputGroup>
              <InputGroupText>+</InputGroupText>
              <Input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                placeholder="Digite o código telefônico (sem o +)"
                required
              />
            </InputGroup>
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
              onClick={() => navigate('/localizacao/paises')} // Mesma correção aqui
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default PaisForm;