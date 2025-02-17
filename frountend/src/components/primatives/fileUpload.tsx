import { createSignal, Match, Switch } from "solid-js";

export type ImageUpload = {
  name:string,
  data:string | ArrayBuffer | null
}
export function FileUpload(props: { id?: string, onUpload: (image:ImageUpload) => void }) {
  const [fileName,setFileName] = createSignal("")
  const handleFileChange = (event:Event & {currentTarget: HTMLInputElement; target: HTMLInputElement}) => {
    if(event.target === null) {
      return
    }
    if(event.target.files === null) {
      return
    }
    const name = event.target.value;
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if(e.target === null) {
          return
        }
        setFileName(name)
        props.onUpload({
          name:name,
          data:e.target.result
        })
      };

      reader.readAsArrayBuffer(file);
     }
   };


  return(
    <div class="flex items-center justify-center w-full ">
        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <Switch>
                  <Match when={fileName() === ""}>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p>
                  </Match>
                  <Match when={fileName() !== ""}>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">CurrentFile {fileName()}</span></p>
                  </Match>
                </Switch>
            </div>
            <input  onChange={handleFileChange} id="dropzone-file" type="file" class="hidden" />
        </label>
    </div>
  )
}
