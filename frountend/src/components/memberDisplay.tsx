import { User } from "../types";
import { ProfilePicture } from "./primatives/profilePicture";

export function MemberDisplay(props: {user:User,full:boolean}) {
  if (props.full) {
    return (
      <div class="flex flex-row gap-2">
        <p>{ props.user.username }</p>
        <ProfilePicture class="place-self-center w-6 h-6" src={ props.user.photos[0].value} />
      </div>
    )
  } else {
    return(
      <ProfilePicture src={ props.user.photos[0].value} />
    )
  }
}
