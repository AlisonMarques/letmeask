import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss';

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
};

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  //pegando o parâmetro da rota, no caso o ID
  const params = useParams<RoomParams>();
  const roomId = params.id;

  useEffect(() => {
    //buscando os dados do banco
    const roomRef = database.ref(`rooms/${roomId}`);

    // (on) vai ficar ouvindo cada modificação que ocorrer e apresentar em tela
    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      //passando os objetos para um array
      const parseQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighLighted: value.isHighLighted,
            isAnswered: value.isAnswered,
          };
        }
      );
      setTitle(databaseRoom.title);
      setQuestions(parseQuestions);
    });
  }, [roomId]);

  //função que vai criar uma nova pergunta
  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    // verificando se o campo esta vazio
    if (newQuestion.trim() === '') {
      return;
    }

    //verificando se o usuário nao esta logado
    if (!user) {
      throw new Error('You must be logged in');
    }

    //recebendo a pergunta e os dados do usuario que criou a pergunta
    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighLighted: false,
      isAnswered: false,
    };

    //salvando os dados no banco
    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
