export function TextArea(props:{id?:string, onInput:(value:string) => void,value:string}) {
  return(
    <textarea id={ props.id} class="px-2 w-96 border-2 h-52 border-black focus:border-blue-400 rounded-md" value={props.value} onInput={(event) => {
      props.onInput(event.target.value)
    }} />
  )
}
