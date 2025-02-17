import { ssr } from "solid-js/web";
import { useAuth } from "../authContext";
import { twMerge } from "tailwind-merge";

export function ProfilePicture(props: {src:string,class?:string}) {
  console.log(props.src)
  return(
    <img class={twMerge("w-10 rounded-4xl",props.class)} src={props.src}/>
  )
}
