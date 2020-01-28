import { fn, db } from "./main";
import { diffrenceAssistant } from "./helperFunctions";

export const onRequestAssistant = fn.firestore
  .document("Doctors/{doctorsId}")
  .onUpdate(async change => {
    const b = change.before.data();
    const a = change.after.data();
    const batch = db.batch();
    if (b && a) {
      // let myFirebaseFirestoreTimestampFromDate = firebase.firestore.Timestamp.fromDate(
      // new Date()
      // );

      console.log(diffrenceAssistant(a.assistants, b.assistants));
    }
    return batch.commit();
  });
