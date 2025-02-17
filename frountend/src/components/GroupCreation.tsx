import { createSignal } from "solid-js"
import { Button } from "./primatives/button"
import { Input} from "./primatives/Input"
import { TextArea } from "./primatives/textArea"
import { Group, User } from "../types"
import { useAuth } from "./authContext"
import { FileUpload, ImageUpload } from "./primatives/fileUpload"



export function GroupCreation(props: {onGroupCreate?:(group:Group) => void}) {
  const auth = useAuth()
  const [name,setName] = createSignal("")
  const [desciption,setDescription] = createSignal("")
  const [error,setError] = createSignal("")
  const [image,setImage] = createSignal<ImageUpload | null>(null)
  if(auth === undefined) {
    return
  }
  const authStatus = auth()
  if(authStatus !== undefined && authStatus.authenticated === false) {
    return (
      <h1 class="text-4xl">Login to Create Group</h1>
    )
  }
  //todo could this be solved with an error group
  async function createGroup() {
    if(name() === "") {
      showErrorMessage("Plese enter a group name")
      return
    }
    if(desciption() === "") {
      showErrorMessage("Plese enter a group description")
      return
    }
    //todo clean this up
    const imageSignal = image()
      try {
        const response = await fetch("/api/createGroup", {
          method:"POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            group_name: name(),
            description: desciption(),
          })
        })
        if (response.ok == false) {
          console.log("not ok")
          throw Error("500 status")
        }
        const group = await response.json()
        const uploadImageRes = uploadImage(group,image())
        if (props.onGroupCreate != undefined) {
          props.onGroupCreate(group);
        }
      } catch(err) {
        showErrorMessage("failed to create group please try again")
      }
  }

  function showErrorMessage(msg:string) {
    setError(msg)
    setTimeout(() => {
      setError("")
    },5000)
  }



  return (
    <div class="flex flex-col gap-4">
      <div class="flex justify-center ">
        <h1 class="text-4xl">Create Group</h1>
      </div>
      <div>
        <h1><label for="name">Name: </label><Input id="name" onInput={setName} value=""/> </h1>
      </div>

      <div><h1><label for="description">Description:</label></h1><TextArea id="description" onInput={setDescription} value=""/></div>
      <FileUpload onUpload={(img) => setImage(img)}/>
      <div class="flex justify-center">
        <Button onClick={() => (createGroup().then())}>Create Group!</Button>
      </div>
      <div>{error()}</div>
    </div>
  )
}


async function uploadImage(group:Group,image:ImageUpload | null) {
  console.log("image")
  if(image === null) {
    return""
  }
  let mime = image.name.split(".")[1];
  if(mime === "" || (mime !== "png" && mime !== "jpg")) {
    throw Error("plese upload a thumbnail in png or jpg format")
  }
  if(mime === "jpg") {
    mime="jpeg"
  }

  const response = await fetch(`/api/upload/${group._id}`, {
    method:"PUT",
    headers: {
      "content-type": `image/${mime}`
    },
    body: image?.data
  })
  if(response.ok === false) {
    throw Error("failed to upload image")
  }
  const output:{url:string } = await response.json()
  return output.url
}
