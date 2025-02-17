import { createResource, createSignal, For, Suspense } from "solid-js";
import { Input } from "../components/primatives/Input";
import { Button } from "../components/primatives/button";
import { GroupCreation } from "../components/GroupCreation";
import { fetchGroups } from "../libs/apiAccesss";
import { GroupDisplay } from "../components/GroupDisplay";
import { Group } from "../types";
import { LoadingSpinner } from "../components/primatives/loadingSpinner";

export function Home() {
   const [groups, { mutate, refetch }] = createResource(fetchGroups)

  function optimisticAddGroup(group:Group) {
    console.log("called optimistic add")
    const groupsState = groups()
    if (groupsState == undefined) {
      mutate([group])
      return
    }
    const newGroups = [...groupsState,group]
    mutate(newGroups)
    setTimeout(() => {
      refetch()
    },1000)
  }

  return(
    <div class='px-5 py-4'>
      <div class="flex justify-center w-full">
        <GroupCreation onGroupCreate={optimisticAddGroup}/>
      </div>
      <Suspense fallback={<div class="w-full flex justify-center">  <LoadingSpinner/> </div>}>
        <div class="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-4 gap-10 py-10">
        <For each={groups()}>
          {(group) => <GroupDisplay onJoin={refetch} onDelete={refetch} onEdit={refetch} group={group} />}
        </For>
        </div>
      </Suspense>
    </div>
  )
}
