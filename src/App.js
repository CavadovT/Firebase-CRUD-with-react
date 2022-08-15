import './App.css';
import { initializeApp } from "firebase/app";
import {getFirestore, collection,addDoc,deleteDoc,doc, updateDoc} from "firebase/firestore";
import { useState,useCallback } from 'react';
import {useCollectionData} from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4VLwLs5F9pgnKb8hc1uHyV3NkJwwYAaI",
  authDomain: "project1-6b678.firebaseapp.com",
  projectId: "project1-6b678",
  storageBucket: "project1-6b678.appspot.com",
  messagingSenderId: "685241993940",
  appId: "1:685241993940:web:d167736047389423bdc941",
  measurementId: "G-8NZETFYY90"
};

const app = initializeApp(firebaseConfig);
const db=getFirestore(app);
const prodConvert={
  toFirestore:(product)=>{
return{
  name:product.name,
  description:product.description
}
  },
  fromFirestore:(snapshot,opt)=>{
    const data =snapshot.data(opt)
    return {
      id:snapshot.id,
      name:data.name,
      description:data.description
    };

  }
}

const App=()=>{
const [id,setId]=useState("");
const [name, setName] = useState("");
const [description,setDescription]=useState("");

const handleNameChange=useCallback((e)=>{
  setName(e.currentTarget.value);

},[]);

const handleDescription=useCallback((e)=>{
setDescription(e.currentTarget.value);
},[]);

//loading empty data
const [products,loading]=useCollectionData(collection(db,"products").withConverter(prodConvert));

//create data in firestore
const handleCreate =useCallback(
  async (e)=>{
e.preventDefault();
if(!name || !description){
  alert("please fill inputs");
  return;
}
if(id){
  const ref=doc(db,"products",id);
  await updateDoc(ref,{
    name:name,
    description:description
  });
}
else{
  const ref=collection(db,"products");
  await addDoc(ref, {
    name: name,
    description: description
 });
}
 setId("");
 setName("");
 setDescription("");
},[id,name,description]);

//delete data from firebase
const handleDelete=useCallback((id)=>{
  deleteDoc(doc(db,"products",id))
},[])
//update data from firebase
const handleUpdateClick=useCallback((product)=>{
  setId(product.id);
  setName(product.name);
  setDescription(product.description);
},[])

  return (
    <div>
      <form onSubmit={handleCreate}>
        <input type="text" placeholder="name" id="name" value={name} onChange={handleNameChange}></input>
        <input type="text" placeholder="description" id="description" value={description} onChange={handleDescription} ></input>
      <input type="submit" value="Submit"></input>
      </form>
      {loading && <span>loading...</span>}
      {products?.map((p)=>(
        <li key={p.id}>
          <span onClick={()=>handleUpdateClick(p)}>
          {p.name}-{p.description}-{" "}
          </span>
          <button type="button" onClick={()=>handleDelete(p.id)}>x</button>
        </li>
      ))}
    </div>

  )
};
export default App;
