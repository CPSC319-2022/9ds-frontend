export interface UserData {
  role: string
  profile_image: string
  username: string
  uid: string
  promotion_request?: string | null
}

export interface AdminUserData {
  role: string
  profile_image: string
  username: string
  uid: string
  promotion_request: string | null
}
