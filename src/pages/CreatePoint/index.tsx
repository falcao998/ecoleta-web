import React, { useEffect, useState, ChangeEvent } from "react";
import {Link} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import axios from "axios";
import api from "../../services/api";

import "./styles.css";

import logo from "../../assets/logo.svg";

interface Item {
    id: number;
    titulo: string;
    image: string;
}

interface Uf {
    sigla: string;
    nome: string;
}

interface Cidade {
    nome: string;
}

const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<Uf[]>([]);
    const [cidades, setCidades] = useState<Cidade[]>([]);

    const [selectedUf, setSelectedUf] = useState("0");
    const [selectedCidade, setSelectedCidade] = useState("0");

    useEffect(() => {
        api.get("items")
        .then(response => {
            setItems(response.data);
        })
    },[]);

    useEffect(() => {
        axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(response => {
            setUfs(response.data);
        })
    },[]);

    useEffect(() => {
        if(selectedUf ==="0") {
            return;
        }
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
            setSelectedCidade(response.data);
        })
    },[selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value);
    }

    function handleSelectCidade(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCidade(event.target.value);
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form action="">
                <h1>Cadastro de<br/>Ponto de Coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text" 
                                name="whatsapp" 
                                id="whatsapp"
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>

                    <Map center={[-12.9415829,-38.4744777]} zoom={15}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[-12.9415829,-38.4744777]} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado(UF)</label>
                            <select 
                                name="uf" 
                                id="uf" 
                                value={selectedUf}
                                onChange={handleSelectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="cidade">Cidade</label>
                            <select 
                                name="cidade" 
                                id="cidade"
                                value={selectedCidade}
                                onChange={handleSelectCidade}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cidades.map(cidade => (
                                    <option key={cidade.nome} value={cidade.nome}>{cidade.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id}>
                                <img src={item.image} alt={item.titulo}/>
                                <span>{item.titulo}</span>
                            </li>
                        ))}
                    </ul>
                    <button type="submit">Cadastrar ponto de coleta</button>
                </fieldset>
            </form>
        </div>
    )
};

export default CreatePoint;