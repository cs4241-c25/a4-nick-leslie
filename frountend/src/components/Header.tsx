import { GithubLogin } from "./githubLogin";

export function Header() {
  return(
    <header class="flex flex-row px-5 py-10 bg-red-900 text-white">
      <div class="flex gap-4 flex-col">
        <h1 class="text-6xl">Group up</h1>
        <h1 class="text-2xl">A way for people to meet new people</h1>
      </div>
      <div class="grow"/>
      <div>
        <GithubLogin/>
      </div>
    </header>
  )
}
