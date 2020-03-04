import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyDTaQDP2ofY6ZMPG26E0Ca6PFsocvlXOdo',
  authDomain: 'doktor-doc.firebaseapp.com',
  databaseURL: 'https://doktor-doc.firebaseio.com',
  projectId: 'doktor-doc',
  storageBucket: 'doktor-doc.appspot.com',
  messagingSenderId: '880358410809',
  appId: '1:880358410809:web:e67562dce322bfa2'
}

firebase.initializeApp(config)

const dbt = firebase.firestore()

dbt.enablePersistence().catch(function(err) {
  if (err.code === 'failed-precondition') {
    // window.alert('You can not open more than one instance of Doctors application')
    // window.close()
  } else if (err.code === 'unimplemented') {
    window.alert('Please use a real browser like Chrome, firefox or safari')
    window.close()
  }
})

export const db = dbt

export const storage = firebase.storage()
