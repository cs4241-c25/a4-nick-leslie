export type User = {
  id:         string,
  username:   string,
  photos: {value:string}[]
}

export type join_request = {
  group_name:string,
  username:string
}

export type Group = {
  _id:string
  group_name: string,
  description:string,
  owner: User,
  members:User[]
}


export type authStatus = {
  authenticated:boolean,
  user: User | undefined
}
