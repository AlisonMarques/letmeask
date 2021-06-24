import { createContext, ReactNode, useState, useEffect } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
   id: string;
   name: string;
   avatar: string;
};

type AuthContextType = {
   user: User | undefined;
   signInWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
   children: ReactNode;
};

//criando o contexto
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
   const [user, setUser] = useState<User>();

   // Ouvindo se existe um login pre-feito pelo usuário para nao fica logando toda vez
   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
         if (user) {
            //verificando se existe um usuário
            const { displayName, photoURL, uid } = user;

            //Verificando se o usuário possui nome e foto
            if (!displayName || !photoURL) {
               throw new Error("Missing information from Google Account.");
            }

            // passando os dados para o contexto
            setUser({
               id: uid,
               name: displayName,
               avatar: photoURL,
            });
         }
      });

      // saindo do evento listerning (Importante fazer isso)
      return () => {
         unsubscribe();
      };
   }, []);

   async function signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();

      const result = await auth.signInWithPopup(provider);

      //verificando se existe um usuário
      if (result.user) {
         const { displayName, photoURL, uid } = result.user;

         //Verificando se o usuário possui nome e foto
         if (!displayName || !photoURL) {
            throw new Error("Missing information from Google Account.");
         }

         // passando os dados para o contexto
         setUser({
            id: uid,
            name: displayName,
            avatar: photoURL,
         });
      }
   }
   return (
      <AuthContext.Provider value={{ user, signInWithGoogle }}>
         {props.children}
      </AuthContext.Provider>
   );
}
