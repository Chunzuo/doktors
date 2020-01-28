import { fv, fn, db } from "./main";
import { getDocByPhone, arr_diff } from "./helperFunctions";

export const onAssistantrequestAnsered = fn.firestore
  .document("Users/{usersId}")
  .onUpdate(async change => {
    const b = change.before.data();
    const a = change.after.data();
    const batch = db.batch();

    if (a && b) {
      await assistantRefused(batch, a, b);
      await assistantAccepted(batch, a, b);
      await changeToDoctor(batch, a, b, change.after.id);
      await editAssistantsRequest(batch, a, b, change.before.id);
    }
    return await batch.commit();
  });

async function assistantRefused(
  batch: FirebaseFirestore.WriteBatch,
  a: FirebaseFirestore.DocumentData,
  b: FirebaseFirestore.DocumentData
) {
  if (
    b.roleConfirm !== undefined && // If the roleConfirm has changed
    a.roleConfirm === undefined &&
    a.role === "pateint"
  ) {
    await removeRequestFromList(batch, b.roleConfirm.doctorDocId, b.phone);
  }
}
async function assistantAccepted(
  batch: FirebaseFirestore.WriteBatch,
  a: FirebaseFirestore.DocumentData,
  b: FirebaseFirestore.DocumentData
) {
  if (
    b.roleConfirm !== undefined && // If the roleConfire has changed
    a.roleConfirm === undefined &&
    a.role === "assistant"
  ) {
    await removeRequestFromList(batch, b.roleConfirm.doctorDocId, b.phone);
    const assistantObj = {
      avatar: "person",
      phone: b.phone,
      name: b.name
    };

    await db
      .collection("Users")
      .doc(b.roleConfirm.doctorDocId)
      .update({
        assistants: fv.arrayUnion(assistantObj)
      });
    await editAssistantInHistory(
      batch,
      fv.arrayUnion,
      b.roleConfirm.doctorPhone,
      b.phone
    );
  }
}

async function editAssistantInHistory(
  batch: FirebaseFirestore.WriteBatch,
  arrayOperation: (...elements: any[]) => FirebaseFirestore.FieldValue,
  doctorPhone: string,
  assistPhone: string
) {
  const doctorHistories = await getDocByPhone(
    "History",
    "doctorPhoneNumber",
    doctorPhone
  );

  doctorHistories.docs.forEach(doc => {
    batch.update(db.collection("History").doc(doc.id), {
      assistants: arrayOperation(assistPhone)
    });
  });
}

async function removeRequestFromList(
  batch: FirebaseFirestore.WriteBatch,
  doctorDocId: string,
  assistantPhone: string
) {
  const ref = db.collection("Users").doc(doctorDocId);
  batch.update(ref, {
    assistantsRequest: fv.arrayRemove(assistantPhone),
    cloudFunctionRequestUpdate: true
  });
  return batch;
}
async function changeToDoctor(
  batch: FirebaseFirestore.WriteBatch,
  a: FirebaseFirestore.DocumentData,
  b: FirebaseFirestore.DocumentData,
  uid: string
) {
  if (a.role !== b.role && a.role === "doctor") {
    const webStructureRef = await db
      .collection("WebStructure")
      .doc("en")
      .get();
    const webStructure = webStructureRef.data();
    let histEle = {};
    if (webStructure) histEle = webStructure["historyElements"];
    const ref = db.collection("Users").doc(uid);
    batch.update(ref, {
      assistants: [],
      assistantsRequest: [],
      historyElements: histEle
    });
  }
  return batch;
}

async function editAssistantsRequest(
  batch: FirebaseFirestore.WriteBatch,
  a: FirebaseFirestore.DocumentData,
  b: FirebaseFirestore.DocumentData,
  docId: string
) {
  if (
    JSON.stringify(a.assistantsRequest) !== JSON.stringify(b.assistantsRequest)
  ) {
    await addAssistantRequest(batch, a, b, docId);

    if (!a.cloudFunctionRequestUpdate) {
      await removeAssistantRequest(batch, a, b);
    } else {
      await removeUpdateSignal(batch, docId);
    }
  }
}
async function addAssistantRequest(
  batch: FirebaseFirestore.WriteBatch,
  a: FirebaseFirestore.DocumentData,
  b: FirebaseFirestore.DocumentData,
  docId: string
) {
  for (const x of arr_diff(a.assistantsRequest, b.assistantsRequest)) {
    const docRef = await getDocByPhone("Users", "phone", x);
    docRef.docs.forEach(async doc => {
      const ref = db.collection("Users").doc(doc.id);
      batch.update(ref, {
        roleConfirm: {
          role: "assistant",
          doctorPhone: b.phone,
          doctorDocId: docId
        }
      });
    });
  }
}
async function removeAssistantRequest(
  batch: FirebaseFirestore.WriteBatch,
  a: FirebaseFirestore.DocumentData,
  b: FirebaseFirestore.DocumentData
) {
  for (const x of arr_diff(b.assistantsRequest, a.assistantsRequest)) {
    const docRef = await getDocByPhone("Users", "phone", x);
    docRef.docs.forEach(async doc => {
      const ref = db.collection("Users").doc(doc.id);
      batch.update(ref, {
        role: "pateint",
        roleConfirm: fv.delete()
      });
    });
  }
}
async function removeUpdateSignal(
  batch: FirebaseFirestore.WriteBatch,
  doctorDocId: string
) {
  const ref = db.collection("Users").doc(doctorDocId);
  batch.update(ref, {
    cloudFunctionRequestUpdate: fv.delete()
  });
  return batch;
}
