import { JSX } from "solid-js/jsx-runtime";
import { twMerge } from "tailwind-merge";

export function Button(props: { children: JSX.Element,onClick:()=>void, class?:string}) {
  return(
    <button class={twMerge("px-2 py-2 border-2 bg-gray-400 border-gray-400 hover:bourder-gray-800 rounded-2xl duration-300 ease-in-out hover:scale-110",props.class)}
        onClick={props.onClick}>
      { props.children}
    </button>
  )
}
