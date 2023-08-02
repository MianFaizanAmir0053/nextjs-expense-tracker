'use client';
import React, {useState, useEffect} from 'react';
import {
  collection,
  addDoc,
  getDoc,
  querySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {db, googleAuthProvider} from './firebase';
import {getAuth, signInWithPopup, GoogleAuthProvider, signOut} from "firebase/auth";
import Image from 'next/image';


export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({name: '', price: ''});
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);

  const googleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        setUser({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        console.log('User: ' + user.photoURL);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(
          'Error Code: ' + errorCode + ' Error Message: ' + errorMessage
        );
      });
  }

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.price !== '') {
      // setItems([...items, newItem]);
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: newItem.price,
      });
      setNewItem({name: '', price: ''});
    }
  };

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id: doc.id});
      });
      setItems(itemsArr);

      // Read total from itemsArr
      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
        setTotal(totalPrice);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
        <div className='flex justify-between'>
          <button onClick={googleSignIn} className='font-semibold text-xl hover:bg-slate-700 rounded bg-slate-800 px-3 py-1'>Sign In</button>
          {user && (
            <div className='flex items-center'>
              <Image
                className='w-10 h-10 rounded-full mr-2'
                src={user.photoURL}
                alt={user.displayName}
                width={40}
                height={40}
              />

              <span className='text-white'>{user.displayName}</span>
              <span className='text-white mx-2'>{user.email}</span>
              <button className='font-semibold text-base hover:bg-slate-700 rounded bg-slate-800 px-3 py-1' onClick={() => {
                const auth = getAuth();
                signOut(auth).then(() => {
                  setUser(null);
                }).catch((error) => {
                  console.log(error);
                });
              }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
        <h1 className='text-4xl p-4 text-center'>Expense Tracker</h1>
        <div className='bg-slate-800 p-4 rounded-lg'>
          <form className='grid grid-cols-6 items-center text-black'>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              className='col-span-3 p-3 border'
              type='text'
              placeholder='Enter Item'
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({...newItem, price: e.target.value})
              }
              className='col-span-2 p-3 border mx-3'
              type='number'
              placeholder='Enter $'
            />
            <button
              onClick={addItem}
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl'
              type='submit'
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className='capitalize'>{item.name}</span>
                  <span>${item.price}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ''
          ) : (
            <div className='flex justify-between p-3'>
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
