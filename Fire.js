import firebase from "firebase";

class Fire {

    uploadPhotoAsync = (uri, filename)=> {
        // const path = `photos/${this.uid}/${Date.now()}.jpg`;
         return new Promise(async (res, rej) => {
             const response = await fetch(uri);
             const file = await response.blob();
             let upload = firebase
                 .storage()
                 .ref(filename)
                 .put(file);
             upload.on(
                 "state_changed",
                 snapshot => {},
                 err => {
                     rej(err);
                 },
                 async () => {
                     const url = await upload.snapshot.ref.getDownloadURL();
                     res(url);
                 }
             );
         });
     };

    createUser = async user => {
        let remoteUri = null;
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            let db = this.firestore.collection("users").doc(this.uid);
            db.set({
                name: user.name,
                email: user.email,
                avatar: null
            });

            if (user.avatar) {
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);
                db.set({ avatar: remoteUri }, { merge: true });
            }
        } catch (error) {
            alert("Error: ", error);
        }
    };

    signOutUser = () => {
        firebase.auth().signOut();
    };

    get firestore() {
        return firebase.firestore();
    };

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    };

    get timestamp() {
        return Date.now();
    };



}


Fire.shared = new Fire();
export default Fire;