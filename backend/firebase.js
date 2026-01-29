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

const db = admin.firestore();

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

class CachedListener {
  constructor() {
    this.collection = null;
    this.referencedDocs = [];
    this.queryFilters = [];
    this.limits = null;
    this.orders = [];
    this.givenID = [];
  }

  /**
   * Opens the collection provided.
   * @param {string} collectionName
   * @returns An updated Cached Listener
   */
  open(collectionName) {
    this.collection = collectionName;
    console.log("open");
    return this;
  }
  /**
   * Adds a document ID to the referenced queries.
   * @param  {...string} docList
   * @returns An updated Cached Listener
   */
  addDocID(...docList) {
    this.givenID = this.givenID.concat(docList);
    return this;
  }

  /**
   * Adds a document reference to the referenced queries.
   * @param  {...string} docList
   * @returns An updated Cached Listener
   */
  addReference(...docList) {
    this.referencedDocs = this.referencedDocs.concat(docList);
    return this;
  }
  /**
   * Orders results based on attribute and order direction.
   * @param {string} attribute
   * @param {string} orderDir
   * @returns An updated Cached Listener
   */
  order(attribute, orderDir) {
    this.orders.push({ attribute, orderDir });
    return this;
  }
  /**
   * Filters results based on attribute and condition.
   * @param {string} attribute
   * @param {string} condition
   * @param {string} value
   * @returns An updated Cached Listener
   */
  find(attribute, condition, value) {
    this.queryFilters.push({ attribute, condition, value });
    console.log("find");
    return this;
  }

  /**
   * Limits results to a certain number.
   * @param {integer} number
   * @returns An updated Cached Listener
   */
  // limit(number) {
  //     this.limit = number;
  //     return this;
  // }

  /**
   * Returns all document references, asynchronously.
   * @returns All document references that have been queried.
   */
  async getAllReferences() {
    let object = db.collection(this.collection);

    this.queryFilters.forEach((filter) => {
      object = object.where(filter.attribute, filter.condition, filter.value);
    });

    this.orders.forEach((order) => {
      object = object.orderBy(order.attribute, order.orderDir);
    });

    let querySnapshot = await object.get();

    querySnapshot.forEach((doc) => {
      console.log(doc.id);
      this.referencedDocs.push(doc);
    });

    this.givenID.forEach((doc) => {
      this.referencedDocs.push(db.collection(this.collection).doc(doc));
    });

    return this.referencedDocs;
  }

  /**
   * Returns all document IDs, asynchronously.
   * @returns All document IDs that have been queried.
   */
  async getAllIDs() {
    let object = db.collection(this.collection);

    this.queryFilters.forEach((filter) => {
      object = object.where(filter.attribute, filter.condition, filter.value);
    });

    this.orders.forEach((order) => {
      object = object.orderBy(order.attribute, order.orderDir);
    });

    let querySnapshot = await object.get();

    querySnapshot.forEach((doc) => {
      this.givenID.push(doc.id);
    });

    this.referencedDocs.forEach((doc) => {
      this.givenID.push(doc.id);
    });

    return this.givenID;
  }

  /**
   * Returns data from referenced queries, and can be further focused on specific attributes.
   * @param  {string} attributesList
   * @returns Returns data from all referenced queries.
   */
  async return(...attributesList) {
    let array = [];
    let object = db.collection(this.collection);

    this.queryFilters.forEach((filter) => {
      object = object.where(filter.attribute, filter.condition, filter.value);
      console.log("queryFilter");
      console.log(filter);
    });

    this.orders.forEach((order) => {
      object = object.orderBy(order.attribute, order.orderDir);
    });

    // if (this.limit !== null) object = object.limit(this.limit);

    console.log(object);
    console.log(await object.get());
    let querySnapshot = await object.get();
    console.log(querySnapshot.empty);

    querySnapshot.forEach((doc) => {
      array.push(doc.data());
      console.log("array push");
    });

    this.referencedDocs.forEach((doc) => {
      array.push(doc.data());
    });

    this.givenID.forEach(async (doc) => {
      let docRef = await db.collection(this.collection).doc(doc).get();
      array.push(docRef.data());
    });

    if (attributesList.length == 0) {
      console.log("working");
      return array;
    } else {
      let revisedArray = [];
      array.forEach((doc) => {
        let revisedDoc = {};
        attributesList.forEach((attr) => {
          revisedDoc[attr] = doc[attr];
        });
        revisedArray.push(revisedDoc);
      });
      return revisedArray;
    }
  }
}

// priyanshu says js time :3

function addEmitter() {
  return new CachedEmitter();
}

function addListener() {
  return new CachedListener();
}

export { db, addEmitter, addListener };
