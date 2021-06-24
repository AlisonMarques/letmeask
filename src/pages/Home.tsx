import { useAuth } from "../hooks/useAuth";
import { useHistory } from "react-router-dom";

import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

import { Button } from "../components/Button";

// import { Testcontext } from "../App";

import "../styles/auth.scss";

export function Home() {
   //criando a navegação
   const history = useHistory();

   //passando o valor para o contexto
   const { user, signInWithGoogle } = useAuth();

   async function handleCreateRoom() {
      // se o usuário n está autenticado, chame a função para autenticar
      if (!user) {
         await signInWithGoogle();
      }

      // se o usuário estiver conectado, navegue para rooms/new
      history.push("/rooms/new");
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
               <form>
                  <input type="text" placeholder="Digite o código da sala" />
                  <Button type="submit">Entrar na sala</Button>
               </form>
            </div>
         </main>
      </div>
   );
}
