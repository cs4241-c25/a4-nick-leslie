import { createSignal, createContext, useContext, createResource, Context, Resource } from "solid-js";
import { getUserInfo } from "../libs/apiAccesss";
import { JSX } from "solid-js/jsx-runtime";
import { authStatus, User } from "../types";

const AuthContext = createContext<Resource<authStatus> | undefined>(undefined);

export function AuthProvider(props: {children:JSX.Element}) {
  //getUserInfo
  const [userInfo, { mutate, refetch }] = createResource(getUserInfo)
  console.log(userInfo())
  return (
    <AuthContext.Provider value={userInfo}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
