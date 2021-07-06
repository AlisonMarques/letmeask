import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

import { useAuth } from '../hooks/useAuth';
import { useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

// import { Testcontext } from "../App";

import '../styles/auth.scss';

export function Home() {
  //criando a navegação
  const history = useHistory();
  const [roomCode, setRoomCode] = useState('');

  //passando o valor para o contexto
  const { user, signInWithGoogle } = useAuth();

  async function handleCreateRoom() {
    // se o usuário n está autenticado, chame a função para autenticar
    if (!user) {
      await signInWithGoogle();
    }

    // se o usuário estiver conectado, navegue para rooms/new
    history.push('/rooms/new');
  }

  //fluxo de entrar em uma sala
  async function handleJoinRoom(event: FormEvent) {
    //pegando o evento do submit para n recarregar a pagina
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    //se sala não existe retorne o erro
    if (!roomRef.exists()) {
      alert('Room does not exist.');
      return;
    }

    // se existir dados em endedAt signfica que a sala foi encerrada
    if (roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }

    //se a sala existir, navegar até ela
    history.push(`/rooms/${roomCode}`);
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
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
