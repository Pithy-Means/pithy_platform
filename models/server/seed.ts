import { db } from "../name";
import { databases } from "./config";
import createCommentCollection from "./commentPost.collection";
import createCourseCommentCollection from "./courseComment.collection";
import createLikeCollection from "./likePost.collection";
import createLikeCommentCollection from "./likeComment.collection";
import createPostCollection from "./post.collection";
import createUserCollection from "./user.collection";
import createCourseCollection from "./course.collection";
import createPreCourseQuestionCollection from "./precourseQuestion.collection";
import createPostCourseQuestionCollection from "./postcourseQuestion.collection";
import createPreCourseAnswerCollection from "./precourseAnswer.collection";
import createPostCourseAnswerCollection from "./postcourseAnswer.collection";
import createScholarshipCollection from "./scholarship.collection";
import createJobCollection from "./job.collection";
import createCertificateCollection from "./certificate.collection";
import createPaymentCollection from "./payment.collection";

let isDbSetup = false;

export default async function getOrCreateDB() {
  if (isDbSetup) {
    return databases;
  }
  try {
    await databases.get(db);
    console.log("Database exists");
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log("Database created");
      // Create collections
      await Promise.all([
        createUserCollection(),
        createPaymentCollection(),
        createPreCourseQuestionCollection(),
        createPreCourseAnswerCollection(),
        createCourseCollection(),
        createCourseCommentCollection(),
        createPostCourseQuestionCollection(),
        createPostCourseAnswerCollection(),
        createCertificateCollection(),
        createPostCollection(),
        createCommentCollection(),
        createLikeCollection(),
        createLikeCommentCollection(),
        createScholarshipCollection(),
        createJobCollection(),
      ]);
      console.log("Database setup complete");
    } catch (error) {
      console.log("Error creating database", error);
    }
  }
  return databases;
}
