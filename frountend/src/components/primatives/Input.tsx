//this is realy just a styled wraper
//todo allow for additonal styles
export function Input(props: {id?:string,onInput:(value:string) => void,value:string}) {

  return(
    <input id={props.id} class="px-2 border-2 w-full border-black focus:border-blue-400 rounded-md" value={props.value} onInput={(event) => {
      props.onInput(event.target.value)
    }}/>
  )
}
