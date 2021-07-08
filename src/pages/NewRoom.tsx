import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useHistory } from 'react-router-dom';
import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');

  //função que vai criar a salas
  async function handleCreateRoom(event: FormEvent) {
    //pegando o evento do submit para n recarregar a pagina
    event.preventDefault();

    //verificando se o campo de criar sala está vazio
    if (newRoom.trim() === '') {
      return;
    }

    //referenciando o banco de dados na tabela rooms
    const roomRef = database.ref('rooms');

    //Jogando os dados para a tabela rooms através do push
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    // navegando o usuário para a sala após ser criado
    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie Salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real </p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
