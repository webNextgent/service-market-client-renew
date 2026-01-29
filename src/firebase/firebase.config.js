import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCUE03J178SxHRGQImE2eDvf-s9IeNDzwU",
    authDomain: "pest-control-7381f.firebaseapp.com",
    projectId: "pest-control-7381f",
    storageBucket: "pest-control-7381f.firebasestorage.app",
    messagingSenderId: "207485865209",
    appId: "1:207485865209:web:9fd52248b27e50e3dc2628"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default auth;



// 2nd
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "AIzaSyC2SganBP8xvDwx_wfyUFZs6_3SlG-D-WI",
//     authDomain: "service-market-8c5d2.firebaseapp.com",
//     projectId: "service-market-8c5d2",
//     storageBucket: "service-market-8c5d2.firebasestorage.app",
//     messagingSenderId: "48340897976",
//     appId: "1:48340897976:web:2d4ec2c1809aad1a67a44d"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// export default auth;


// 1st
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
// apiKey: "AIzaSyC2SganBP8xvDwx_wfyUFZs6_3SlG-D-WI",
// authDomain: "service-market-8c5d2.firebaseapp.com",
// projectId: "service-market-8c5d2",
// storageBucket: "service-market-8c5d2.firebasestorage.app",
// messagingSenderId: "48340897976",
// appId: "1:48340897976:web:2d4ec2c1809aad1a67a44d"
// };

// const app = initializeApp(firebaseConfig);
// export default app;