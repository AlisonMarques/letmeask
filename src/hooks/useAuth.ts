import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// transformando 2 importações ou mais em uma só
export function useAuth() {
   const value = useContext(AuthContext);

   return value;
}
