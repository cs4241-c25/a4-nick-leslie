import { authStatus, Group, User } from "../types"

export async function fetchGroups():Promise<Group[]> {
  const response = await fetch("/api/groups", {
    method:"GET",
    headers: {
      "content-type": "application/json"
    },
  })
  return await response.json()
}
export async function fetchGroup(groupId:String):Promise<Group> {
  const response = await fetch(`/api/group/${groupId}`, {
    method:"GET",
    headers: {
      "content-type": "application/json"
    },
  })
  return await response.json()
}


export async function getUserInfo():Promise<authStatus> {
  console.log("called get user info")
  const response = await fetch("/api/auth/user", {
    method:"GET",
  })

  if(response.ok === false) {
    console.log("test")
    return {
      authenticated:false,
      user:undefined
    };
  }
  const responseJson = await response.json()
  console.log(responseJson)
  return {
    authenticated:true,
    user:responseJson
  }
}
