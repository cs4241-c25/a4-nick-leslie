import { useParams } from "@solidjs/router";
import { createResource, For, Suspense } from "solid-js";
import { fetchGroup } from "../libs/apiAccesss";
import { Group } from "../types";
import { LoadingSpinner } from "../components/primatives/loadingSpinner";
import { MemberDisplay } from "../components/memberDisplay";

export function group() {
    const params = useParams();
    const [group, { mutate, refetch }] = createResource<Group>(async () => {
      return await fetchGroup(params.group_id);
    });

    return (
      <div class='px-5 py-4'>
        <Suspense fallback={<div class="w-full flex justify-center">  <LoadingSpinner/> </div>}>
          <div class="flex flex-row gap-10">
            <img alt={`thumbnail for ${group()?.group_name} group`} class="w-40 h-40" src={`/api/group/${group()?._id}/thumbnail`}></img>
            <div class="flex flex-col gap-10">
              <h1 class="text-4xl">Group Name: {group()?.group_name}</h1>
              <p class="text-3xl">Description: {group()?.description}</p>
            </div>
          </div>
          <div class="flex flex-col gap-5">
            <h1 class="font-bold text-2xl">Members</h1>
            <div class="grid grid-cols-4 gap-2">
              <For each={group()?.members}>
                {(member) => <MemberDisplay user={member} full={true} />}
              </For>
            </div>
          </div>
        </Suspense>
      </div>
    );
}
