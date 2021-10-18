# todo-list-nextjs-firebase
Simple app to practice NextJS and Firebase

To run this code sample it is necessary to have a firebase account with the follow configurations:
1. Enable authentication
  1.1 Go to Firebase Console
  1.2 Click in Authentication on the left menu
  1.3 Click in Sign-in Method and enable Email/Password
2. Click in Firestore Database on the left Menu
  2.1 Create a new Collection called "todo"
  2.2 Click on "Indexes" and create an index for the "todo" collection that contemplates the following fields: user_uid ascending date ascending
  2.3 Click in "Rules" and set the following rule: allow read, write: if request.auth != null;

After you setup the firebase project, replace the placeholders in file .env.local with the values provided by firebase.

To run the application:

1. yarn install
2. yarn dev
