import { serverTimestamp } from 'firebase/firestore'
import { UserData } from 'types/UserData'

export const adminData: UserData = {
  profile_image: 'https:example.com/img.jpg',
  role: 'admin',
  username: 'admin',
  uid: '0',
}

export const contributorData: UserData = {
  profile_image: 'https:example.com/img.jpg',
  role: 'contributor',
  username: 'contributor',
  uid: '1',
}

export const readerData: UserData = {
  profile_image: 'https:example.com/img.jpg',
  role: 'reader',
  username: 'reader',
  uid: '2',
}

export const newUserData: UserData = {
  profile_image: 'https:example.com/img.jpg',
  role: 'reader',
  username: 'newUser',
  uid: '3',
}

export const contributorPublishedArticle = {
  author_uid: contributorData.uid,
  author_image: contributorData.profile_image,
  author_username: contributorData.username,
  content: 'This is the article body.',
  edit_time: serverTimestamp(),
  header_image: 'https:example.com/img.jpg',
  published: true,
  publish_time: serverTimestamp(),
  title: 'This is the title',
}

export const contributorPublishedArticleID = '0'

export const contributorPrivateArticle = {
  author_uid: contributorData.uid,
  author_image: contributorData.profile_image,
  author_username: contributorData.username,
  content: 'This is the article body.',
  edit_time: serverTimestamp(),
  header_image: 'https:example.com/img.jpg',
  published: false,
  title: 'This is the title',
}

export const contributorPrivateArticleID = '1'

export const adminPublishedArticle = {
  author_uid: adminData.uid,
  author_image: adminData.profile_image,
  author_username: adminData.username,
  content: 'This is the article body.',
  edit_time: serverTimestamp(),
  header_image: 'https:example.com/img.jpg',
  published: true,
  publish_time: serverTimestamp(),
  title: 'This is the title',
}

export const adminPublishedArticleID = '2'

export const adminPrivateArticle = {
  author_uid: adminData.uid,
  author_image: adminData.profile_image,
  author_username: adminData.username,
  content: 'This is the article body.',
  edit_time: serverTimestamp(),
  header_image: 'https:example.com/img.jpg',
  published: false,
  title: 'This is the title',
}

export const adminPrivateArticleID = '3'

export const adminComment = {
  commenter_uid: adminData.uid,
  commenter_image: adminData.profile_image,
  commenter_username: adminData.username,
  content: 'Admin comment',
  post_time: serverTimestamp(),
}

export const adminCommentId = '0'

export const contributorComment = {
  commenter_uid: contributorData.uid,
  commenter_image: contributorData.profile_image,
  commenter_username: contributorData.username,
  content: 'Contributor comment',
  post_time: serverTimestamp(),
}

export const contributorCommentId = '1'

export const readerComment = {
  commenter_uid: readerData.uid,
  commenter_image: readerData.profile_image,
  commenter_username: readerData.username,
  content: 'Reader comment',
  post_time: serverTimestamp(),
}

export const readerCommentId = '2'
