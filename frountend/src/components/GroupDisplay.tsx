import { createSignal, For, Match, Show, Switch } from "solid-js";
import { Group } from "../types";
import { MemberDisplay } from "./memberDisplay";
import { Button } from "./primatives/button";
import { useAuth } from "./authContext";
import { Input } from "./primatives/Input";
import { TextArea } from "./primatives/textArea";
import { A } from "@solidjs/router";
import { group } from "../routes/group";


export function GroupDisplay(props: { group: Group, onDelete?: (group: Group) => void, onJoin?: (group: Group) => void,onEdit?:(group:Group)=>void}) {
  const auth = useAuth()
  const [editMode, setEditMode] = createSignal(false);
  const [groupName, setGroupName] = createSignal(props.group.group_name);
  const [description, setGroupDescription] = createSignal(props.group.description);
  if(auth === undefined) {
    return;
  }
  const authsignal = auth()
  if(authsignal === undefined) {
    return
  }
  const authStatus = authsignal;


  async function deleteGroup() {
    //todo pop up a portal
    const response = await fetch("/api/deleteGroup",{
      method:"POST",
      headers: {
        "content-type": "application/json"
      },
      body:JSON.stringify(props.group)
    })
    if(response.ok === false) {
      //todo pop up a toast
      return
    }
    if(props.onDelete != undefined) {
      props.onDelete(props.group)
    }
  }
  async function saveEdits() {
    if (props.group._id == "") {
      //todo optimisitc data force refetch
      return;
    }
    const groupEdits:Group = {
      ...props.group,
      description:description(),
      group_name:groupName()
    }
    const response = await fetch("/api/editGroup",{
      method:"POST",
      headers: {
        "content-type": "application/json"
      },
      body:JSON.stringify(groupEdits)
    })
    if(response.ok === false) {
      //todo pop up a toast
      return
    }
    if(props.onEdit != undefined) {
      props.onEdit(props.group)
    }
    setEditMode(false);
  }
  async function joinGroup() {
    const response = await fetch("/api/join",{
      method:"POST",
      headers: {
        "content-type": "application/json"
      },
      body:JSON.stringify(props.group)
    })
  }

  return (
    <div class="border-2 flex flex-col gap-5 border-black rounded-xl px-5 py-3">
      <div class="flex text-xl gap-5 flex-row">
        <div class="flex flex-col grow gap-2">
          <div>
            <Switch>
              <Match when={editMode() === false}>
                <h1 class="hover:underline"><A href={`/group/${props.group._id}`}> Name: {props.group.group_name}</A></h1>
              </Match>
              <Match when={editMode() === true}>
                <Input onInput={setGroupName} value={groupName()}/>
              </Match>
            </Switch>
            <div class="flex flex-row gap-2">
              <p>owner:</p>
              <MemberDisplay user={props.group.owner} full={true } />
            </div>
          </div>
          <Switch>
            <Match when={editMode() === false}>
              <p>Description: {props.group.description}</p>
            </Match>
            <Match when={editMode() === true}>
              <TextArea id="edid-description" onInput={setGroupDescription} value={description()}/>
            </Match>
          </Switch>
          <div>
            <h1>Members</h1>
            <div class="grid grid-cols-4 gap-2">
              <For each={props.group.members.slice(0,10)}>
                {(member) => <MemberDisplay user={member} full={false } />}
              </For>
            </div>
          </div>
        </div>
        <div class="w-fit flex flex-col gap-5">
          <img alt={`thumbnail for ${props.group.group_name} group`} class="w-20 h-20" src={`/api/group/${props.group._id}/thumbnail`}></img>
          <Show when={authStatus.authenticated === true && authStatus.user !== undefined  && authStatus.user?.id === props.group.owner.id}>
            <Button class="bg-red-600 border-red-600 hover:bourder-red-800" onClick={() => { deleteGroup().then() }}>Delete group</Button>
            <Switch>
              <Match when={editMode()===false}>
                <Button  class="bg-gray-400 border-gray-400 hover:bourder-gray-800" onClick={() => { setEditMode(true) }}>Edit group</Button>
              </Match>
              <Match when={editMode()===true}>
                <Button  class="bg-gray-400 border-gray-400 hover:bourder-gray-800"  onClick={saveEdits}>SaveEdits</Button>
              </Match>
            </Switch>
          </Show>
        </div>
      </div>
      <Show when={authStatus.authenticated === true && authStatus.user !== undefined  || props.group.members.find((member) => member.id === authStatus.user?.id) === undefined}>
        <Button onClick={() => {joinGroup().then()}}>Join Group</Button>
      </Show>
    </div>
  )
}
