import {
  updateDoc,
  doc,
  collection,
  collectionGroup,
  getDocs,
  writeBatch,
  onSnapshot,
  runTransaction,
  query,
  where,
  getDoc,
  limit,
} from "firebase/firestore";
import db from "../firebase";

// general helpers
export function handleDocChange(
  parentCollection,
  setStateList,
  limitValue,
  condition
) {
  if (parentCollection === null)
    return () => {
      setStateList([]);
    };
  let dataArray = [];

  const q = condition
    ? query(parentCollection, condition, limit(limitValue))
    : query(parentCollection, limit(limitValue));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const currentDoc = Object.assign(
        { id: change.doc.id },
        change.doc.data()
      );
      if (change.type === "added") {
        dataArray.push(currentDoc);
      }
      if (change.type === "modified") {
        dataArray = dataArray.map((obj) =>
          obj.id === change.doc.id ? currentDoc : obj
        );
      }
      if (change.type === "removed") {
        const index = dataArray.findIndex((item) => change.doc.id === item.id);
        dataArray.splice(index, 1);
      }
      setStateList([...dataArray]);
    });
  });

  return () => {
    setStateList([]);
    unsubscribe();
  };
}

export function onCellEditCommit(params, setAlertOpen, parentCollection) {
  try {
    updateDoc(doc(parentCollection, params.id.toString()), {
      [params.field]: params.value,
    });
    setAlertOpen(true);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export function handleRemoveDoc(selectionModel, parentCollection) {
  const batch = writeBatch(db);
  selectionModel.forEach((id) => {
    batch.delete(doc(parentCollection, id));
  });
  batch.commit();
}

export async function getDocuments(
  parentCollection,
  setStateList,
  limitValue,
  condition
) {
  if (parentCollection === null)
    return () => {
      setStateList([]);
    };
  let dataArray = [];
  const q = condition
    ? query(parentCollection, condition, limit(limitValue))
    : query(parentCollection, limit(limitValue));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const currentDoc = Object.assign({ id: doc.id }, doc.data());
    dataArray.push(currentDoc);
  });

  setStateList([...dataArray]);
  return () => {
    setStateList([]);
  };
}

export async function observeDocument(docRef, setStateList) {
  if (docRef === null)
    return () => {
      setStateList(null);
    };

  const unsub = onSnapshot(docRef, (doc) => {
    setStateList(doc.data());
  });
  return () => {
    unsub();
    setStateList(null);
  };
}

export async function getDocument(docRef, setStateList) {
  if (docRef === null)
    return () => {
      setStateList(null);
    };
  let data = null;
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) setStateList(docSnap.data());
  return () => {
    setStateList(null);
  };
}

//department helpers

export async function onDepNameCellEditCommit(
  params,
  setAlertOpen,
  depCollection
) {
  try {
    await runTransaction(db, async (transaction) => {
      const batchCollectionRef = collection(
        depCollection,
        params.id.toString(),
        "batchs"
      );

      const batchCollection = await getDocs(batchCollectionRef);
      batchCollection.forEach((batch) => {
        transaction.update(batch.ref, { depName: params.value });
      });
      setAlertOpen(true);
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  console.log(params);
}

// staff helpers
export async function onStaffNameCellEditCommit(
  params,
  setAlertOpen,
  teacherId
) {
  try {
    await runTransaction(db, async (transaction) => {
      const subjectsCollectionRef = collectionGroup(db, "subjects");
      const timetableCollectionRef = collectionGroup(db, "Timetable");

      const subjectsCollection = query(
        subjectsCollectionRef,
        where("teacher.id", "==", teacherId)
      );

      const timetableCollection = query(
        timetableCollectionRef,
        where("teacherId", "==", teacherId)
      );

      const querySnapshot1 = await getDocs(timetableCollection);
      querySnapshot1.forEach((lecture) => {
        transaction.update(lecture.ref, { teacherName: params.value });
      });

      const querySnapshot2 = await getDocs(subjectsCollection);
      querySnapshot2.forEach((subject) => {
        transaction.update(subject.ref, { teacher: { name: params.value } });
      });
      setAlertOpen(true);
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// timetable helpers
export async function onSubjectNameCellEditCommit(params, subjectId) {
  try {
    await runTransaction(db, async (transaction) => {
      const timetableCollectionRef = collectionGroup(db, "Timetable");

      const timetableCollection = query(
        timetableCollectionRef,
        where("subjectId", "==", subjectId)
      );

      const querySnapshot = await getDocs(timetableCollection);
      querySnapshot.forEach((lecture) => {
        transaction.update(lecture.ref, { name: params.value });
      });
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
