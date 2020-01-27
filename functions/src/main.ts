import * as functions from "firebase-functions";
import * as _admin from "firebase-admin";
export const db = _admin.firestore();
export const fv = _admin.firestore.FieldValue;
export const fn = functions.region("europe-west1");
export const admin = _admin;
