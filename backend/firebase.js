//if you're seeing this, thanks man (you know who you are) :D

import admin from "firebase-admin";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();

// db.enablePersistence({
//   synchronizeTabs: true,
//   experimentalForceOwningTab: true,
// })
//   .then(console.log("Persistence enabled!"))
//   .catch((err) => console.error("Failed enabling persistence:", err));

class CachedEmitter {
  constructor() {
    this.collection = null;
    this.updateData = null;
    this.addData = null;
    this.referencedDocs = [];
    this.queryFilters = [];
    this.fieldsToDelete = [];
    this.deleteData = false;
    this.batch = db.batch();
  }

  open(collectionName) {
    this.collection = collectionName;
    return this;
  }

  add(dataObject) {
    this.addData = {
      ...dataObject,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    return this;
  }

  update(dataObject) {
    this.updateData = dataObject;
    return this;
  }

  delete() {
    this.deleteData = true;
    return this;
  }

  find(attribute, operator, value) {
    this.queryFilters.push({ attribute, operator, value, m_returnAll: false });
    return this;
  }

  async commit() {
    console.log("Attempting to commit changes to Firestore...");

    if (this.referencedDocs.length == 0 && !this.deleteData) {
      this.batch.set(db.collection(this.collection).doc(), this.addData);
    }

    if (this.referencedDocs.length == 1) {
      this.addData["uniquifier"] = this.referencedDocs[0];
    }

    if (this.queryFilters.length > 0) {
      console.log("Found query filters");
      let object = db.collection(this.collection);

      this.queryFilters.forEach((filter) => {
        object = object.where(filter.attribute, filter.condition, filter.value);
      });

      let querySnapshot = await object.get();

      querySnapshot.forEach((doc) => {
        this.referencedDocs.push(doc.id);
      });
    }

    if (this.fieldsToDelete.length > 0) {
      let deletingObject = {};
      for (let field of this.fieldsToDelete) {
        deletingObject[field] = firebase.firestore.FieldValue.delete();
      }
      for (let doc of this.referencedDocs) {
        this.batch.update(
          db.collection(this.collection).doc(doc),
          deletingObject,
        );
      }
    }
    if (!this.deleteData) {
      if ((this.addData !== null) != (this.updateData !== null)) {
        if (this.addData !== null) {
          for (let doc of this.referencedDocs) {
            this.batch.set(
              db.collection(this.collection).doc(doc),
              this.addData,
            );
          }
        } else {
          for (let doc of this.referencedDocs) {
            this.batch.update(
              db.collection(this.collection).doc(doc),
              this.updateData,
            );
          }
        }
      } else {
        console.log("Both add or update method or no add or update method.");
      }
    } else {
      console.log("Deleting data...");
      for (let doc of this.referencedDocs) {
        this.batch.delete(db.collection(this.collection).doc(doc));
      }
    }

    await this.batch.commit();
  }
}
