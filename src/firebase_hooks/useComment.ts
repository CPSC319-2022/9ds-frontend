import {addDoc, deleteDoc, doc, collection, updateDoc} from "firebase/firestore";
import {db} from "../index";

async function handleCommentCreate(articleID: string, comment: any): Promise<string | boolean> {
    const docRef = await addDoc(collection(db, `article/${articleID}/comments`), comment);
    return docRef.id;
}

async function handleCommentEdit(articleID: string, commentID: string, comment: any) {
    await updateDoc(doc(db, `article/${articleID}/comments`, commentID), comment);
}

async function handleCommentDelete(articleID: string, commentID: string) {
    await deleteDoc(doc(db, `article/${articleID}/comments`, commentID));
}

export {handleCommentCreate, handleCommentDelete, handleCommentEdit}