import React, { useCallback, useEffect, useState } from 'react';

import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import { FaGithub, FaPlus, FaSpinner, FaTrash, FaBars } from 'react-icons/fa';

import api from '../../services/api'
import { Link } from 'react-router-dom';

export default function Main(){

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // Buscar
    useEffect(() => {
        const repoStorage = localStorage.getItem('repos');
        
        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage));
        }
        
    }, []);
    
    // Salvar alterações
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios));
    }, [repositorios]);


    const handleSubmit = useCallback((e) => {

        e.preventDefault();

        const submit = async () => {
            setLoading(true);
            setAlert(null);

            try {

                if (newRepo === '') {
                    throw new Error('Você precisa indicar um repositorio!');
                }

                const response = await api.get(`repos/${newRepo}`);

                const hasRepo = repositorios.find(repo => repo.name === newRepo);

                if (hasRepo) {
                    throw new Error('Repositorio duplicado');
                }

                const data = {
                    name: response.data.full_name,
                }

                setRepositorios([...repositorios, data]);
                setNewRepo('');
            } catch (error) {
                setAlert(true);
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        submit();

    }, [newRepo, repositorios]);

    const handleInputChange = (e) => {
        setNewRepo(e.target.value);
        setAlert(null);
    }

    const handleDelete = useCallback((name) => {
        const find = repositorios.filter(r => r.name !== name);
        setRepositorios(find);
    }, [repositorios]);


    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositorios
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input
                    type="text"
                    placeholder='Adicionar Repositórios'
                    value={newRepo}
                    onChange={handleInputChange} />


                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14} />
                    ) : (
                        <FaPlus color="#FFF" size={14} />
                    )}
                    {/* <FaPlus color="#FFF" size={14} /> */}
                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>

        </Container>
    )
}

