import { JSX } from "solid-js/jsx-runtime";
import { Header } from "../components/Header";
import { AuthProvider } from "../components/authContext";

export function Layout(props: {children?: JSX.Element;}) {
  return(
    <div class="flex-row gap-4">
      <AuthProvider>
        <Header/>
        {props.children}
      </AuthProvider>
    </div>
  )
}
