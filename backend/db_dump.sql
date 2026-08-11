--
-- PostgreSQL database dump
--

\restrict UHrHeOl20jCSdVpHbxeyxwmZYcxXdZCvMTYyT5SGTyADBtG2uFYrzQs1MjjUwfF

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_collegeId_fkey";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_classId_fkey";
ALTER TABLE ONLY public."Transactions" DROP CONSTRAINT "Transactions_studentId_fkey";
ALTER TABLE ONLY public."Timetables" DROP CONSTRAINT "Timetables_teacherId_fkey";
ALTER TABLE ONLY public."Timetables" DROP CONSTRAINT "Timetables_subjectId_fkey";
ALTER TABLE ONLY public."Timetables" DROP CONSTRAINT "Timetables_classId_fkey";
ALTER TABLE ONLY public."TeamRequests" DROP CONSTRAINT "TeamRequests_studentId_fkey";
ALTER TABLE ONLY public."TeamRequests" DROP CONSTRAINT "TeamRequests_opportunityId_fkey";
ALTER TABLE ONLY public."Tasks" DROP CONSTRAINT "Tasks_studentId_fkey";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_teacherId_fkey";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_classId_fkey";
ALTER TABLE ONLY public."StudyRequests" DROP CONSTRAINT "StudyRequests_tutorId_fkey";
ALTER TABLE ONLY public."StudyRequests" DROP CONSTRAINT "StudyRequests_subjectId_fkey";
ALTER TABLE ONLY public."StudyRequests" DROP CONSTRAINT "StudyRequests_requesterId_fkey";
ALTER TABLE ONLY public."StudyGuides" DROP CONSTRAINT "StudyGuides_studentId_fkey";
ALTER TABLE ONLY public."StudyGroups" DROP CONSTRAINT "StudyGroups_subjectId_fkey";
ALTER TABLE ONLY public."StudyGroups" DROP CONSTRAINT "StudyGroups_creatorId_fkey";
ALTER TABLE ONLY public."StudyGroupParticipants" DROP CONSTRAINT "StudyGroupParticipants_studyGroupId_fkey";
ALTER TABLE ONLY public."StudyGroupParticipants" DROP CONSTRAINT "StudyGroupParticipants_studentId_fkey";
ALTER TABLE ONLY public."SelfAttendances" DROP CONSTRAINT "SelfAttendances_studentId_fkey";
ALTER TABLE ONLY public."RecoveryAssignments" DROP CONSTRAINT "RecoveryAssignments_subjectId_fkey";
ALTER TABLE ONLY public."RecoveryAssignments" DROP CONSTRAINT "RecoveryAssignments_studentId_fkey";
ALTER TABLE ONLY public."Quizzes" DROP CONSTRAINT "Quizzes_teacherId_fkey";
ALTER TABLE ONLY public."Quizzes" DROP CONSTRAINT "Quizzes_subjectId_fkey";
ALTER TABLE ONLY public."QuizQuestions" DROP CONSTRAINT "QuizQuestions_quizId_fkey";
ALTER TABLE ONLY public."QuizAttempts" DROP CONSTRAINT "QuizAttempts_studentId_fkey";
ALTER TABLE ONLY public."QuizAttempts" DROP CONSTRAINT "QuizAttempts_quizId_fkey";
ALTER TABLE ONLY public."ProjectPostings" DROP CONSTRAINT "ProjectPostings_creatorId_fkey";
ALTER TABLE ONLY public."ProjectInvites" DROP CONSTRAINT "ProjectInvites_projectPostingId_fkey";
ALTER TABLE ONLY public."ProjectInvites" DROP CONSTRAINT "ProjectInvites_inviteeId_fkey";
ALTER TABLE ONLY public."PrepHistories" DROP CONSTRAINT "PrepHistories_studentId_fkey";
ALTER TABLE ONLY public."PlacementApplications" DROP CONSTRAINT "PlacementApplications_studentId_fkey";
ALTER TABLE ONLY public."PlacementApplications" DROP CONSTRAINT "PlacementApplications_companyListingId_fkey";
ALTER TABLE ONLY public."Opportunities" DROP CONSTRAINT "Opportunities_postedById_fkey";
ALTER TABLE ONLY public."Notifications" DROP CONSTRAINT "Notifications_userId_fkey";
ALTER TABLE ONLY public."Messages" DROP CONSTRAINT "Messages_studyRequestId_fkey";
ALTER TABLE ONLY public."Messages" DROP CONSTRAINT "Messages_studyGroupId_fkey";
ALTER TABLE ONLY public."Messages" DROP CONSTRAINT "Messages_senderId_fkey";
ALTER TABLE ONLY public."Messages" DROP CONSTRAINT "Messages_receiverId_fkey";
ALTER TABLE ONLY public."MentorshipSlots" DROP CONSTRAINT "MentorshipSlots_mentorId_fkey";
ALTER TABLE ONLY public."MentorshipSlots" DROP CONSTRAINT "MentorshipSlots_menteeId_fkey";
ALTER TABLE ONLY public."MentorProfiles" DROP CONSTRAINT "MentorProfiles_userId_fkey";
ALTER TABLE ONLY public."Materials" DROP CONSTRAINT "Materials_uploaderId_fkey";
ALTER TABLE ONLY public."Materials" DROP CONSTRAINT "Materials_subjectId_fkey";
ALTER TABLE ONLY public."MaterialPurchases" DROP CONSTRAINT "MaterialPurchases_studentId_fkey";
ALTER TABLE ONLY public."MaterialPurchases" DROP CONSTRAINT "MaterialPurchases_materialId_fkey";
ALTER TABLE ONLY public."Marks" DROP CONSTRAINT "Marks_subjectId_fkey";
ALTER TABLE ONLY public."Marks" DROP CONSTRAINT "Marks_studentId_fkey";
ALTER TABLE ONLY public."LeaveRequests" DROP CONSTRAINT "LeaveRequests_studentId_fkey";
ALTER TABLE ONLY public."LeaveRequests" DROP CONSTRAINT "LeaveRequests_approvedById_fkey";
ALTER TABLE ONLY public."JobPosts" DROP CONSTRAINT "JobPosts_postedById_fkey";
ALTER TABLE ONLY public."JobApplications" DROP CONSTRAINT "JobApplications_studentId_fkey";
ALTER TABLE ONLY public."JobApplications" DROP CONSTRAINT "JobApplications_jobPostId_fkey";
ALTER TABLE ONLY public."InterviewExperiences" DROP CONSTRAINT "InterviewExperiences_studentId_fkey";
ALTER TABLE ONLY public."ForumReplies" DROP CONSTRAINT "ForumReplies_userId_fkey";
ALTER TABLE ONLY public."ForumReplies" DROP CONSTRAINT "ForumReplies_postId_fkey";
ALTER TABLE ONLY public."ForumPosts" DROP CONSTRAINT "ForumPosts_userId_fkey";
ALTER TABLE ONLY public."ForumPosts" DROP CONSTRAINT "ForumPosts_subjectId_fkey";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_collegeId_fkey";
ALTER TABLE ONLY public."BookReviews" DROP CONSTRAINT "BookReviews_studentId_fkey";
ALTER TABLE ONLY public."BookReviews" DROP CONSTRAINT "BookReviews_bookId_fkey";
ALTER TABLE ONLY public."BookCheckouts" DROP CONSTRAINT "BookCheckouts_studentId_fkey";
ALTER TABLE ONLY public."BookCheckouts" DROP CONSTRAINT "BookCheckouts_bookId_fkey";
ALTER TABLE ONLY public."Attendances" DROP CONSTRAINT "Attendances_subjectId_fkey";
ALTER TABLE ONLY public."Attendances" DROP CONSTRAINT "Attendances_markedById_fkey";
ALTER TABLE ONLY public."Attendances" DROP CONSTRAINT "Attendances_classId_fkey";
ALTER TABLE ONLY public."AttendanceRecords" DROP CONSTRAINT "AttendanceRecords_studentId_fkey";
ALTER TABLE ONLY public."AttendanceRecords" DROP CONSTRAINT "AttendanceRecords_attendanceId_fkey";
ALTER TABLE ONLY public."Assignments" DROP CONSTRAINT "Assignments_teacherId_fkey";
ALTER TABLE ONLY public."Assignments" DROP CONSTRAINT "Assignments_subjectId_fkey";
ALTER TABLE ONLY public."AssignmentSubmissions" DROP CONSTRAINT "AssignmentSubmissions_studentId_fkey";
ALTER TABLE ONLY public."AssignmentSubmissions" DROP CONSTRAINT "AssignmentSubmissions_assignmentId_fkey";
ALTER TABLE ONLY public."Announcements" DROP CONSTRAINT "Announcements_postedById_fkey";
ALTER TABLE ONLY public."Announcements" DROP CONSTRAINT "Announcements_collegeId_fkey";
ALTER TABLE ONLY public."AlumniProfiles" DROP CONSTRAINT "AlumniProfiles_userId_fkey";
DROP INDEX public.attendances_class_id_subject_id_date;
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key99";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key98";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key97";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key96";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key95";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key94";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key93";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key92";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key91";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key90";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key9";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key89";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key88";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key87";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key86";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key85";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key84";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key83";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key82";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key81";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key80";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key8";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key79";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key78";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key77";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key76";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key75";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key74";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key73";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key72";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key71";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key70";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key7";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key69";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key68";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key67";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key66";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key65";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key64";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key63";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key62";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key61";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key60";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key6";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key59";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key58";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key57";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key56";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key55";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key54";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key53";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key52";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key51";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key50";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key5";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key49";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key48";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key47";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key46";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key45";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key44";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key43";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key42";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key41";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key40";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key4";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key39";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key38";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key37";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key36";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key35";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key34";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key33";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key32";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key31";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key30";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key3";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key29";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key28";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key27";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key26";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key25";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key24";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key239";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key238";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key237";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key236";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key235";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key234";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key233";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key232";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key231";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key230";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key23";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key229";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key228";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key227";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key226";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key225";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key224";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key223";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key222";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key221";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key220";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key22";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key219";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key218";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key217";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key216";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key215";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key214";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key213";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key212";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key211";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key210";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key21";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key209";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key208";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key207";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key206";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key205";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key204";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key203";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key202";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key201";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key200";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key20";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key2";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key199";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key198";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key197";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key196";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key195";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key194";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key193";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key192";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key191";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key190";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key19";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key189";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key188";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key187";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key186";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key185";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key184";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key183";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key182";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key181";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key180";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key18";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key179";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key178";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key177";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key176";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key175";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key174";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key173";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key172";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key171";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key170";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key17";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key169";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key168";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key167";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key166";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key165";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key164";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key163";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key162";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key161";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key160";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key16";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key159";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key158";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key157";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key156";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key155";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key154";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key153";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key152";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key151";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key150";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key15";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key149";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key148";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key147";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key146";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key145";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key144";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key143";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key142";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key141";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key140";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key14";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key139";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key138";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key137";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key136";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key135";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key134";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key133";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key132";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key131";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key130";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key13";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key129";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key128";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key127";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key126";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key125";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key124";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key123";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key122";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key121";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key120";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key12";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key119";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key118";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key117";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key116";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key115";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key114";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key113";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key112";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key111";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key110";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key11";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key109";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key108";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key107";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key106";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key105";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key104";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key103";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key102";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key101";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key100";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key10";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key1";
ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key";
ALTER TABLE ONLY public."Transactions" DROP CONSTRAINT "Transactions_pkey";
ALTER TABLE ONLY public."Timetables" DROP CONSTRAINT "Timetables_pkey";
ALTER TABLE ONLY public."TeamRequests" DROP CONSTRAINT "TeamRequests_pkey";
ALTER TABLE ONLY public."Tasks" DROP CONSTRAINT "Tasks_pkey";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_pkey";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key99";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key98";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key97";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key96";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key95";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key94";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key93";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key92";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key91";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key90";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key9";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key89";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key88";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key87";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key86";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key85";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key84";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key83";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key82";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key81";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key80";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key8";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key79";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key78";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key77";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key76";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key75";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key74";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key73";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key72";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key71";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key70";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key7";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key69";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key68";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key67";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key66";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key65";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key64";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key63";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key62";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key61";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key60";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key6";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key59";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key58";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key57";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key56";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key55";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key54";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key53";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key52";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key51";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key50";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key5";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key49";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key48";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key47";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key46";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key45";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key44";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key43";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key42";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key41";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key40";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key4";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key39";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key38";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key37";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key36";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key35";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key34";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key33";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key32";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key31";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key30";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key3";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key29";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key28";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key27";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key26";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key25";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key24";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key23";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key225";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key224";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key223";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key222";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key221";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key220";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key22";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key219";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key218";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key217";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key216";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key215";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key214";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key213";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key212";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key211";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key210";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key21";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key209";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key208";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key207";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key206";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key205";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key204";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key203";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key202";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key201";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key200";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key20";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key2";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key199";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key198";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key197";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key196";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key195";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key194";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key193";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key192";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key191";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key190";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key19";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key189";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key188";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key187";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key186";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key185";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key184";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key183";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key182";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key181";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key180";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key18";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key179";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key178";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key177";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key176";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key175";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key174";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key173";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key172";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key171";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key170";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key17";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key169";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key168";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key167";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key166";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key165";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key164";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key163";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key162";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key161";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key160";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key16";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key159";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key158";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key157";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key156";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key155";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key154";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key153";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key152";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key151";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key150";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key15";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key149";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key148";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key147";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key146";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key145";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key144";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key143";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key142";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key141";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key140";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key14";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key139";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key138";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key137";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key136";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key135";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key134";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key133";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key132";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key131";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key130";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key13";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key129";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key128";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key127";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key126";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key125";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key124";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key123";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key122";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key121";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key120";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key12";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key119";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key118";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key117";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key116";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key115";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key114";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key113";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key112";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key111";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key110";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key11";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key109";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key108";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key107";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key106";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key105";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key104";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key103";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key102";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key101";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key100";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key10";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key1";
ALTER TABLE ONLY public."Subjects" DROP CONSTRAINT "Subjects_code_key";
ALTER TABLE ONLY public."StudyRequests" DROP CONSTRAINT "StudyRequests_pkey";
ALTER TABLE ONLY public."StudyGuides" DROP CONSTRAINT "StudyGuides_pkey";
ALTER TABLE ONLY public."StudyGroups" DROP CONSTRAINT "StudyGroups_pkey";
ALTER TABLE ONLY public."StudyGroupParticipants" DROP CONSTRAINT "StudyGroupParticipants_pkey";
ALTER TABLE ONLY public."SelfAttendances" DROP CONSTRAINT "SelfAttendances_pkey";
ALTER TABLE ONLY public."RecoveryAssignments" DROP CONSTRAINT "RecoveryAssignments_pkey";
ALTER TABLE ONLY public."Quizzes" DROP CONSTRAINT "Quizzes_pkey";
ALTER TABLE ONLY public."QuizQuestions" DROP CONSTRAINT "QuizQuestions_pkey";
ALTER TABLE ONLY public."QuizAttempts" DROP CONSTRAINT "QuizAttempts_pkey";
ALTER TABLE ONLY public."ProjectPostings" DROP CONSTRAINT "ProjectPostings_pkey";
ALTER TABLE ONLY public."ProjectInvites" DROP CONSTRAINT "ProjectInvites_pkey";
ALTER TABLE ONLY public."PrepHistories" DROP CONSTRAINT "PrepHistories_pkey";
ALTER TABLE ONLY public."PredictionLogs" DROP CONSTRAINT "PredictionLogs_pkey";
ALTER TABLE ONLY public."PlacementInsights" DROP CONSTRAINT "PlacementInsights_pkey";
ALTER TABLE ONLY public."PlacementApplications" DROP CONSTRAINT "PlacementApplications_pkey";
ALTER TABLE ONLY public."Opportunities" DROP CONSTRAINT "Opportunities_pkey";
ALTER TABLE ONLY public."Notifications" DROP CONSTRAINT "Notifications_pkey";
ALTER TABLE ONLY public."Messages" DROP CONSTRAINT "Messages_pkey";
ALTER TABLE ONLY public."MentorshipSlots" DROP CONSTRAINT "MentorshipSlots_pkey";
ALTER TABLE ONLY public."MentorProfiles" DROP CONSTRAINT "MentorProfiles_pkey";
ALTER TABLE ONLY public."Materials" DROP CONSTRAINT "Materials_pkey";
ALTER TABLE ONLY public."MaterialPurchases" DROP CONSTRAINT "MaterialPurchases_pkey";
ALTER TABLE ONLY public."Marks" DROP CONSTRAINT "Marks_pkey";
ALTER TABLE ONLY public."MarketplaceItems" DROP CONSTRAINT "MarketplaceItems_pkey";
ALTER TABLE ONLY public."LibraryBooks" DROP CONSTRAINT "LibraryBooks_pkey";
ALTER TABLE ONLY public."LeaveRequests" DROP CONSTRAINT "LeaveRequests_pkey";
ALTER TABLE ONLY public."JobPosts" DROP CONSTRAINT "JobPosts_pkey";
ALTER TABLE ONLY public."JobApplications" DROP CONSTRAINT "JobApplications_pkey";
ALTER TABLE ONLY public."InterviewExperiences" DROP CONSTRAINT "InterviewExperiences_pkey";
ALTER TABLE ONLY public."Holidays" DROP CONSTRAINT "Holidays_pkey";
ALTER TABLE ONLY public."ForumReplies" DROP CONSTRAINT "ForumReplies_pkey";
ALTER TABLE ONLY public."ForumPosts" DROP CONSTRAINT "ForumPosts_pkey";
ALTER TABLE ONLY public."Confessions" DROP CONSTRAINT "Confessions_pkey";
ALTER TABLE ONLY public."CompanyListings" DROP CONSTRAINT "CompanyListings_pkey";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_pkey";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key99";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key98";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key97";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key96";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key95";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key94";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key93";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key92";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key91";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key90";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key9";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key89";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key88";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key87";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key86";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key85";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key84";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key83";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key82";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key81";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key80";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key8";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key79";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key78";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key77";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key76";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key75";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key74";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key73";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key72";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key71";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key70";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key7";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key69";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key68";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key67";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key66";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key65";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key64";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key63";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key62";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key61";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key60";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key6";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key59";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key58";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key57";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key56";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key55";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key54";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key53";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key52";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key51";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key50";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key5";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key49";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key48";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key47";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key46";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key45";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key44";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key43";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key42";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key41";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key40";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key4";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key39";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key38";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key37";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key36";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key35";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key34";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key33";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key32";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key31";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key30";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key3";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key29";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key28";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key27";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key26";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key25";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key24";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key23";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key22";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key21";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key20";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key2";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key19";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key18";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key17";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key16";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key15";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key148";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key147";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key146";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key145";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key144";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key143";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key142";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key141";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key140";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key14";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key139";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key138";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key137";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key136";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key135";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key134";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key133";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key132";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key131";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key130";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key13";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key129";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key128";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key127";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key126";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key125";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key124";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key123";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key122";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key121";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key120";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key12";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key119";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key118";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key117";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key116";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key115";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key114";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key113";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key112";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key111";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key110";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key11";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key109";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key108";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key107";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key106";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key105";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key104";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key103";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key102";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key101";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key100";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key10";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key1";
ALTER TABLE ONLY public."Colleges" DROP CONSTRAINT "Colleges_name_key";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_pkey";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key99";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key98";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key97";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key96";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key95";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key94";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key93";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key92";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key91";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key90";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key9";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key89";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key88";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key87";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key86";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key85";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key84";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key83";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key82";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key81";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key80";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key8";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key79";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key78";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key77";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key76";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key75";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key74";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key73";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key72";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key71";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key70";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key7";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key69";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key68";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key67";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key66";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key65";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key64";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key63";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key62";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key61";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key60";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key6";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key59";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key58";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key57";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key56";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key55";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key54";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key53";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key52";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key51";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key50";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key5";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key49";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key48";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key47";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key46";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key45";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key44";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key43";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key42";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key41";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key40";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key4";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key39";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key38";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key37";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key36";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key35";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key34";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key33";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key32";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key31";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key30";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key3";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key29";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key28";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key27";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key264";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key263";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key262";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key261";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key260";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key26";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key259";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key258";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key257";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key256";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key255";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key254";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key253";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key252";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key251";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key250";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key25";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key249";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key248";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key247";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key246";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key245";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key244";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key243";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key242";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key241";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key240";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key24";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key239";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key238";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key237";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key236";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key235";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key234";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key233";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key232";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key231";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key230";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key23";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key229";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key228";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key227";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key226";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key225";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key224";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key223";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key222";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key221";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key220";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key22";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key219";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key218";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key217";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key216";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key215";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key214";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key213";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key212";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key211";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key210";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key21";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key209";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key208";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key207";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key206";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key205";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key204";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key203";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key202";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key201";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key200";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key20";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key2";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key199";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key198";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key197";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key196";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key195";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key194";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key193";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key192";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key191";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key190";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key19";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key189";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key188";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key187";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key186";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key185";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key184";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key183";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key182";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key181";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key180";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key18";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key179";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key178";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key177";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key176";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key175";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key174";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key173";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key172";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key171";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key170";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key17";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key169";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key168";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key167";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key166";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key165";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key164";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key163";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key162";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key161";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key160";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key16";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key159";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key158";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key157";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key156";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key155";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key154";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key153";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key152";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key151";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key150";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key15";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key149";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key148";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key147";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key146";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key145";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key144";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key143";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key142";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key141";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key140";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key14";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key139";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key138";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key137";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key136";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key135";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key134";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key133";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key132";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key131";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key130";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key13";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key129";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key128";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key127";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key126";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key125";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key124";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key123";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key122";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key121";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key120";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key12";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key119";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key118";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key117";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key116";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key115";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key114";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key113";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key112";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key111";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key110";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key11";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key109";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key108";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key107";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key106";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key105";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key104";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key103";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key102";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key101";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key100";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key10";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key1";
ALTER TABLE ONLY public."Classes" DROP CONSTRAINT "Classes_name_key";
ALTER TABLE ONLY public."BookReviews" DROP CONSTRAINT "BookReviews_pkey";
ALTER TABLE ONLY public."BookCheckouts" DROP CONSTRAINT "BookCheckouts_pkey";
ALTER TABLE ONLY public."Attendances" DROP CONSTRAINT "Attendances_pkey";
ALTER TABLE ONLY public."AttendanceRecords" DROP CONSTRAINT "AttendanceRecords_pkey";
ALTER TABLE ONLY public."Assignments" DROP CONSTRAINT "Assignments_pkey";
ALTER TABLE ONLY public."AssignmentSubmissions" DROP CONSTRAINT "AssignmentSubmissions_pkey";
ALTER TABLE ONLY public."Announcements" DROP CONSTRAINT "Announcements_pkey";
ALTER TABLE ONLY public."AlumniProfiles" DROP CONSTRAINT "AlumniProfiles_userId_key";
ALTER TABLE ONLY public."AlumniProfiles" DROP CONSTRAINT "AlumniProfiles_pkey";
ALTER TABLE public."PredictionLogs" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."PlacementInsights" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."MentorProfiles" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."MarketplaceItems" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."Confessions" ALTER COLUMN id DROP DEFAULT;
DROP TABLE public."Users";
DROP TABLE public."Transactions";
DROP TABLE public."Timetables";
DROP TABLE public."TeamRequests";
DROP TABLE public."Tasks";
DROP TABLE public."Subjects";
DROP TABLE public."StudyRequests";
DROP TABLE public."StudyGuides";
DROP TABLE public."StudyGroups";
DROP TABLE public."StudyGroupParticipants";
DROP TABLE public."SelfAttendances";
DROP TABLE public."RecoveryAssignments";
DROP TABLE public."Quizzes";
DROP TABLE public."QuizQuestions";
DROP TABLE public."QuizAttempts";
DROP TABLE public."ProjectPostings";
DROP TABLE public."ProjectInvites";
DROP TABLE public."PrepHistories";
DROP SEQUENCE public."PredictionLogs_id_seq";
DROP TABLE public."PredictionLogs";
DROP SEQUENCE public."PlacementInsights_id_seq";
DROP TABLE public."PlacementInsights";
DROP TABLE public."PlacementApplications";
DROP TABLE public."Opportunities";
DROP TABLE public."Notifications";
DROP TABLE public."Messages";
DROP TABLE public."MentorshipSlots";
DROP SEQUENCE public."MentorProfiles_id_seq";
DROP TABLE public."MentorProfiles";
DROP TABLE public."Materials";
DROP TABLE public."MaterialPurchases";
DROP TABLE public."Marks";
DROP SEQUENCE public."MarketplaceItems_id_seq";
DROP TABLE public."MarketplaceItems";
DROP TABLE public."LibraryBooks";
DROP TABLE public."LeaveRequests";
DROP TABLE public."JobPosts";
DROP TABLE public."JobApplications";
DROP TABLE public."InterviewExperiences";
DROP TABLE public."Holidays";
DROP TABLE public."ForumReplies";
DROP TABLE public."ForumPosts";
DROP SEQUENCE public."Confessions_id_seq";
DROP TABLE public."Confessions";
DROP TABLE public."CompanyListings";
DROP TABLE public."Colleges";
DROP TABLE public."Classes";
DROP TABLE public."BookReviews";
DROP TABLE public."BookCheckouts";
DROP TABLE public."Attendances";
DROP TABLE public."AttendanceRecords";
DROP TABLE public."Assignments";
DROP TABLE public."AssignmentSubmissions";
DROP TABLE public."Announcements";
DROP TABLE public."AlumniProfiles";
DROP TYPE public."enum_Users_role";
DROP TYPE public."enum_Timetables_dayOfWeek";
DROP TYPE public."enum_TeamRequests_status";
DROP TYPE public."enum_Tasks_type";
DROP TYPE public."enum_Tasks_status";
DROP TYPE public."enum_Subjects_type";
DROP TYPE public."enum_StudyRequests_status";
DROP TYPE public."enum_SelfAttendances_status";
DROP TYPE public."enum_RecoveryAssignments_status";
DROP TYPE public."enum_PlacementApplications_status";
DROP TYPE public."enum_Opportunities_type";
DROP TYPE public."enum_Notifications_type";
DROP TYPE public."enum_MentorshipSlots_visibility";
DROP TYPE public."enum_MentorshipSlots_status";
DROP TYPE public."enum_Materials_visibility";
DROP TYPE public."enum_LeaveRequests_type";
DROP TYPE public."enum_LeaveRequests_status";
DROP TYPE public."enum_JobPosts_type";
DROP TYPE public."enum_JobApplications_status";
DROP TYPE public."enum_InterviewExperiences_outcome";
DROP TYPE public."enum_Holidays_type";
DROP TYPE public."enum_ForumPosts_visibility";
DROP TYPE public."enum_ForumPosts_tag";
DROP TYPE public."enum_CompanyListings_type";
DROP TYPE public."enum_BookCheckouts_status";
DROP TYPE public."enum_AttendanceRecords_status";
DROP TYPE public."enum_AssignmentSubmissions_status";
DROP TYPE public."enum_Announcements_targetRole";
DROP TYPE public."enum_Announcements_category";
--
-- Name: enum_Announcements_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Announcements_category" AS ENUM (
    'Exam',
    'Holiday',
    'Event',
    'Fee',
    'Result',
    'General'
);


--
-- Name: enum_Announcements_targetRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Announcements_targetRole" AS ENUM (
    'all',
    'student',
    'teacher'
);


--
-- Name: enum_AssignmentSubmissions_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_AssignmentSubmissions_status" AS ENUM (
    'pending',
    'submitted',
    'graded',
    'late'
);


--
-- Name: enum_AttendanceRecords_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_AttendanceRecords_status" AS ENUM (
    'present',
    'absent',
    'late',
    'excused',
    'duty'
);


--
-- Name: enum_BookCheckouts_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_BookCheckouts_status" AS ENUM (
    'active',
    'returned',
    'overdue'
);


--
-- Name: enum_CompanyListings_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_CompanyListings_type" AS ENUM (
    'internship',
    'placement'
);


--
-- Name: enum_ForumPosts_tag; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_ForumPosts_tag" AS ENUM (
    'doubt',
    'resource',
    'exam-prep',
    'discussion',
    'announcement'
);


--
-- Name: enum_ForumPosts_visibility; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_ForumPosts_visibility" AS ENUM (
    'campus_only',
    'global'
);


--
-- Name: enum_Holidays_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Holidays_type" AS ENUM (
    'holiday',
    'exam',
    'festival',
    'other'
);


--
-- Name: enum_InterviewExperiences_outcome; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_InterviewExperiences_outcome" AS ENUM (
    'selected',
    'rejected',
    'waiting'
);


--
-- Name: enum_JobApplications_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_JobApplications_status" AS ENUM (
    'applied',
    'shortlisted',
    'rejected',
    'hired'
);


--
-- Name: enum_JobPosts_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_JobPosts_type" AS ENUM (
    'fulltime',
    'internship',
    'parttime',
    'contract'
);


--
-- Name: enum_LeaveRequests_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_LeaveRequests_status" AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: enum_LeaveRequests_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_LeaveRequests_type" AS ENUM (
    'medical',
    'personal',
    'duty'
);


--
-- Name: enum_Materials_visibility; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Materials_visibility" AS ENUM (
    'campus_only',
    'global'
);


--
-- Name: enum_MentorshipSlots_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_MentorshipSlots_status" AS ENUM (
    'open',
    'booked',
    'completed',
    'cancelled'
);


--
-- Name: enum_MentorshipSlots_visibility; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_MentorshipSlots_visibility" AS ENUM (
    'global',
    'campus_only'
);


--
-- Name: enum_Notifications_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Notifications_type" AS ENUM (
    'info',
    'alert',
    'success'
);


--
-- Name: enum_Opportunities_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Opportunities_type" AS ENUM (
    'hackathon',
    'internship',
    'full-time',
    'other'
);


--
-- Name: enum_PlacementApplications_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_PlacementApplications_status" AS ENUM (
    'applied',
    'exam_scheduled',
    'interview_round',
    'selected',
    'rejected'
);


--
-- Name: enum_RecoveryAssignments_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_RecoveryAssignments_status" AS ENUM (
    'pending',
    'submitted',
    'approved',
    'rejected'
);


--
-- Name: enum_SelfAttendances_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_SelfAttendances_status" AS ENUM (
    'present',
    'absent'
);


--
-- Name: enum_StudyRequests_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_StudyRequests_status" AS ENUM (
    'pending',
    'accepted',
    'completed',
    'cancelled',
    'rejected'
);


--
-- Name: enum_Subjects_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Subjects_type" AS ENUM (
    'theory',
    'lab'
);


--
-- Name: enum_Tasks_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Tasks_status" AS ENUM (
    'todo',
    'in_progress',
    'done'
);


--
-- Name: enum_Tasks_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Tasks_type" AS ENUM (
    'assignment',
    'note',
    'custom'
);


--
-- Name: enum_TeamRequests_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_TeamRequests_status" AS ENUM (
    'open',
    'closed'
);


--
-- Name: enum_Timetables_dayOfWeek; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Timetables_dayOfWeek" AS ENUM (
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
);


--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'admin',
    'teacher',
    'student',
    'guardian'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AlumniProfiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AlumniProfiles" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "graduationYear" integer,
    batch character varying(255),
    company character varying(255),
    designation character varying(255),
    location character varying(255),
    "linkedIn" character varying(255),
    bio text,
    skills json DEFAULT '[]'::json,
    "isVerified" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Announcements" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    category public."enum_Announcements_category" DEFAULT 'General'::public."enum_Announcements_category",
    "isPinned" boolean DEFAULT false,
    "expiresAt" timestamp with time zone,
    "postedById" uuid NOT NULL,
    "targetRole" public."enum_Announcements_targetRole" DEFAULT 'all'::public."enum_Announcements_targetRole",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "collegeId" uuid
);


--
-- Name: AssignmentSubmissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AssignmentSubmissions" (
    id uuid NOT NULL,
    "assignmentId" uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "fileUrl" character varying(255),
    "submittedAt" timestamp with time zone,
    grade integer,
    feedback text,
    status public."enum_AssignmentSubmissions_status" DEFAULT 'pending'::public."enum_AssignmentSubmissions_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Assignments" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    "subjectId" uuid NOT NULL,
    "teacherId" uuid NOT NULL,
    "dueDate" timestamp with time zone,
    "maxMarks" integer DEFAULT 100,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "fileUrl" character varying(255),
    "isLocked" boolean DEFAULT false
);


--
-- Name: AttendanceRecords; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AttendanceRecords" (
    id uuid NOT NULL,
    "attendanceId" uuid NOT NULL,
    "studentId" uuid NOT NULL,
    status public."enum_AttendanceRecords_status" DEFAULT 'present'::public."enum_AttendanceRecords_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Attendances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Attendances" (
    id uuid NOT NULL,
    "classId" uuid NOT NULL,
    "subjectId" uuid NOT NULL,
    date date NOT NULL,
    "markedById" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: BookCheckouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BookCheckouts" (
    id uuid NOT NULL,
    "bookId" uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "checkoutDate" timestamp with time zone,
    "dueDate" timestamp with time zone NOT NULL,
    "returnDate" timestamp with time zone,
    status public."enum_BookCheckouts_status" DEFAULT 'active'::public."enum_BookCheckouts_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: BookReviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BookReviews" (
    id uuid NOT NULL,
    "bookId" uuid NOT NULL,
    "studentId" uuid NOT NULL,
    rating integer NOT NULL,
    comment text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Classes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Classes" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "collegeId" uuid,
    latitude double precision DEFAULT '20.3533'::double precision,
    longitude double precision DEFAULT '85.8266'::double precision,
    "activeOtp" character varying(255),
    "activeOtpExpires" timestamp with time zone,
    "activeQrToken" character varying(255),
    "isSessionActive" boolean DEFAULT false
);


--
-- Name: Colleges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Colleges" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "logoUrl" character varying(255),
    "secretKey" character varying(255) DEFAULT 'EDU-STAFF-KEY-2026'::character varying NOT NULL,
    latitude double precision DEFAULT '20.3533'::double precision,
    longitude double precision DEFAULT '85.8266'::double precision,
    "midSemStartDate" date,
    "midSemEndDate" date,
    "isMidSemAdmitCardEnabled" boolean DEFAULT false,
    "endSemStartDate" date,
    "endSemEndDate" date,
    "isEndSemAdmitCardEnabled" boolean DEFAULT false
);


--
-- Name: CompanyListings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CompanyListings" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    "position" character varying(255) NOT NULL,
    type public."enum_CompanyListings_type" DEFAULT 'placement'::public."enum_CompanyListings_type",
    package character varying(255) NOT NULL,
    criteria text,
    description text,
    steps text,
    deadline date,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Confessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Confessions" (
    id integer NOT NULL,
    content text NOT NULL,
    "collegeId" integer,
    "createdAt" timestamp with time zone
);


--
-- Name: Confessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Confessions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Confessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Confessions_id_seq" OWNED BY public."Confessions".id;


--
-- Name: ForumPosts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ForumPosts" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "subjectId" uuid NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    tag public."enum_ForumPosts_tag" DEFAULT 'doubt'::public."enum_ForumPosts_tag",
    "isSolved" boolean DEFAULT false,
    upvotes integer DEFAULT 0
);


--
-- Name: ForumReplies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ForumReplies" (
    id uuid NOT NULL,
    "postId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isAnswer" boolean DEFAULT false
);


--
-- Name: Holidays; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Holidays" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    date date NOT NULL,
    type public."enum_Holidays_type" DEFAULT 'holiday'::public."enum_Holidays_type",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: InterviewExperiences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."InterviewExperiences" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "companyName" character varying(255) NOT NULL,
    "roleApplied" character varying(255) NOT NULL,
    questions text NOT NULL,
    difficulty integer NOT NULL,
    outcome public."enum_InterviewExperiences_outcome",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: JobApplications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."JobApplications" (
    id uuid NOT NULL,
    "jobPostId" uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "coverLetter" text,
    status public."enum_JobApplications_status" DEFAULT 'applied'::public."enum_JobApplications_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: JobPosts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."JobPosts" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    company character varying(255) NOT NULL,
    description text NOT NULL,
    location character varying(255),
    salary character varying(255),
    type public."enum_JobPosts_type" DEFAULT 'fulltime'::public."enum_JobPosts_type",
    "postedById" uuid NOT NULL,
    deadline timestamp with time zone,
    skills json DEFAULT '[]'::json,
    "applyLink" character varying(255),
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: LeaveRequests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LeaveRequests" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    reason text NOT NULL,
    status public."enum_LeaveRequests_status" DEFAULT 'pending'::public."enum_LeaveRequests_status",
    "approvedById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    type public."enum_LeaveRequests_type" DEFAULT 'personal'::public."enum_LeaveRequests_type" NOT NULL,
    "certificateUrl" text
);


--
-- Name: LibraryBooks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LibraryBooks" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    category character varying(255) NOT NULL,
    "totalCopies" integer DEFAULT 1,
    "availableCopies" integer DEFAULT 1,
    "ebookUrl" character varying(255),
    "coverUrl" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: MarketplaceItems; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MarketplaceItems" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    currency character varying(255) DEFAULT 'USD'::character varying,
    global boolean DEFAULT false,
    "sellerId" integer NOT NULL,
    "createdAt" timestamp with time zone
);


--
-- Name: MarketplaceItems_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."MarketplaceItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: MarketplaceItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."MarketplaceItems_id_seq" OWNED BY public."MarketplaceItems".id;


--
-- Name: Marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Marks" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "subjectId" uuid NOT NULL,
    "midSem" integer,
    assignment integer,
    quiz integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: MaterialPurchases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MaterialPurchases" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "materialId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "purchaseType" character varying(255) DEFAULT 'lifetime'::character varying,
    "leaseExpiresAt" timestamp with time zone
);


--
-- Name: Materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Materials" (
    id uuid NOT NULL,
    "subjectId" uuid NOT NULL,
    title character varying(255) NOT NULL,
    "contentUrl" text,
    date date NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "uploaderId" uuid,
    price integer DEFAULT 0,
    description character varying(255),
    "itemType" character varying(255) DEFAULT 'notes'::character varying
);


--
-- Name: MentorProfiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MentorProfiles" (
    id integer NOT NULL,
    "userId" uuid NOT NULL,
    expertise text NOT NULL,
    available boolean DEFAULT true,
    rating numeric(3,2) DEFAULT 0,
    "createdAt" timestamp with time zone
);


--
-- Name: MentorProfiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."MentorProfiles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: MentorProfiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."MentorProfiles_id_seq" OWNED BY public."MentorProfiles".id;


--
-- Name: MentorshipSlots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MentorshipSlots" (
    id uuid NOT NULL,
    "mentorId" uuid NOT NULL,
    "menteeId" uuid,
    "startTime" timestamp with time zone NOT NULL,
    "endTime" timestamp with time zone NOT NULL,
    topic character varying(255) NOT NULL,
    status public."enum_MentorshipSlots_status" DEFAULT 'open'::public."enum_MentorshipSlots_status",
    "meetingLink" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Messages" (
    id uuid NOT NULL,
    "senderId" uuid NOT NULL,
    "receiverId" uuid,
    "studyGroupId" uuid,
    "studyRequestId" uuid,
    content text NOT NULL,
    "isRead" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notifications" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type public."enum_Notifications_type" DEFAULT 'info'::public."enum_Notifications_type",
    "isRead" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Opportunities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Opportunities" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    type public."enum_Opportunities_type" NOT NULL,
    link character varying(255),
    deadline timestamp with time zone,
    "postedById" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: PlacementApplications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PlacementApplications" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "companyListingId" uuid NOT NULL,
    status public."enum_PlacementApplications_status" DEFAULT 'applied'::public."enum_PlacementApplications_status",
    "submissionText" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: PlacementInsights; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PlacementInsights" (
    id integer NOT NULL,
    company character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    package character varying(255) NOT NULL,
    "collegeId" integer,
    "submittedBy" integer NOT NULL,
    "createdAt" timestamp with time zone
);


--
-- Name: PlacementInsights_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PlacementInsights_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: PlacementInsights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PlacementInsights_id_seq" OWNED BY public."PlacementInsights".id;


--
-- Name: PredictionLogs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PredictionLogs" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "inputData" json NOT NULL,
    "predictionResult" json NOT NULL,
    "createdAt" timestamp with time zone
);


--
-- Name: PredictionLogs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PredictionLogs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: PredictionLogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PredictionLogs_id_seq" OWNED BY public."PredictionLogs".id;


--
-- Name: PrepHistories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PrepHistories" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    type character varying(255) NOT NULL,
    target character varying(255) NOT NULL,
    score integer NOT NULL,
    details text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: ProjectInvites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProjectInvites" (
    id uuid NOT NULL,
    "projectPostingId" uuid NOT NULL,
    "inviteeId" uuid NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: ProjectPostings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProjectPostings" (
    id uuid NOT NULL,
    "creatorId" uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    "requiredSkills" character varying(255) NOT NULL,
    "maxTeamSize" integer DEFAULT 4,
    status character varying(255) DEFAULT 'open'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: QuizAttempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."QuizAttempts" (
    id uuid NOT NULL,
    "quizId" uuid NOT NULL,
    "studentId" uuid NOT NULL,
    answers json,
    score integer DEFAULT 0,
    "completedAt" timestamp with time zone,
    "timeTakenSeconds" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: QuizQuestions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."QuizQuestions" (
    id uuid NOT NULL,
    "quizId" uuid NOT NULL,
    question text NOT NULL,
    options json NOT NULL,
    "correctAnswer" integer NOT NULL,
    marks integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Quizzes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Quizzes" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    "subjectId" uuid NOT NULL,
    "teacherId" uuid NOT NULL,
    "timeLimitMinutes" integer DEFAULT 30,
    "dueDate" timestamp with time zone,
    "totalMarks" integer DEFAULT 0,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isLocked" boolean DEFAULT false
);


--
-- Name: RecoveryAssignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RecoveryAssignments" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "subjectId" uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    status public."enum_RecoveryAssignments_status" DEFAULT 'pending'::public."enum_RecoveryAssignments_status" NOT NULL,
    "submissionText" text,
    "boostCount" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "absenceReason" character varying(255),
    "absenceDate" date,
    "hoursMissed" integer DEFAULT 1,
    "documentUrl" character varying(255),
    "reviewFeedback" text,
    "feePaid" numeric(10,2),
    "sessionType" character varying(255) DEFAULT 'Condonation Petition'::character varying NOT NULL,
    "remedialStatus" character varying(255) DEFAULT 'Pending'::character varying NOT NULL
);


--
-- Name: SelfAttendances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SelfAttendances" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "subjectName" character varying(255) NOT NULL,
    date date,
    status public."enum_SelfAttendances_status" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: StudyGroupParticipants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StudyGroupParticipants" (
    id uuid NOT NULL,
    "studyGroupId" uuid NOT NULL,
    "studentId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: StudyGroups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StudyGroups" (
    id uuid NOT NULL,
    "creatorId" uuid NOT NULL,
    "subjectId" uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    "scheduledTime" timestamp with time zone,
    "meetLink" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying,
    "notesData" json,
    "targetColleges" json
);


--
-- Name: StudyGuides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StudyGuides" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    title character varying(255) NOT NULL,
    summary text NOT NULL,
    transcript text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: StudyRequests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StudyRequests" (
    id uuid NOT NULL,
    "requesterId" uuid NOT NULL,
    "tutorId" uuid,
    "subjectId" uuid NOT NULL,
    status public."enum_StudyRequests_status" DEFAULT 'pending'::public."enum_StudyRequests_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "scheduledTime" timestamp with time zone,
    rating integer,
    review text,
    "whiteboardData" json
);


--
-- Name: Subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Subjects" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(255) NOT NULL,
    "classId" uuid NOT NULL,
    "teacherId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    type public."enum_Subjects_type" DEFAULT 'theory'::public."enum_Subjects_type" NOT NULL,
    credits integer DEFAULT 3 NOT NULL,
    course character varying(255)
);


--
-- Name: Tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tasks" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    title character varying(255) NOT NULL,
    "dueDate" timestamp with time zone,
    type public."enum_Tasks_type" DEFAULT 'custom'::public."enum_Tasks_type",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    status public."enum_Tasks_status" DEFAULT 'todo'::public."enum_Tasks_status"
);


--
-- Name: TeamRequests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TeamRequests" (
    id uuid NOT NULL,
    "opportunityId" uuid NOT NULL,
    "studentId" uuid NOT NULL,
    message text NOT NULL,
    status public."enum_TeamRequests_status" DEFAULT 'open'::public."enum_TeamRequests_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Timetables; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Timetables" (
    id uuid NOT NULL,
    "classId" uuid NOT NULL,
    "subjectId" uuid NOT NULL,
    "teacherId" uuid NOT NULL,
    "dayOfWeek" public."enum_Timetables_dayOfWeek" NOT NULL,
    "startTime" time without time zone NOT NULL,
    "endTime" time without time zone NOT NULL,
    "roomNumber" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Transactions" (
    id uuid NOT NULL,
    "studentId" uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    "paymentMethod" character varying(255) DEFAULT 'UPI'::character varying,
    "transactionId" character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'completed'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public."enum_Users_role" DEFAULT 'student'::public."enum_Users_role",
    "classId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "parentEmail" character varying(255),
    "gracePeriodEnds" date,
    "resumeUrl" character varying(255),
    course character varying(255),
    tokens integer DEFAULT 0,
    "lastTokenClaim" timestamp with time zone,
    "collegeId" uuid,
    "faceDescriptor" text,
    "isPremium" boolean DEFAULT false
);


--
-- Name: Confessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Confessions" ALTER COLUMN id SET DEFAULT nextval('public."Confessions_id_seq"'::regclass);


--
-- Name: MarketplaceItems id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MarketplaceItems" ALTER COLUMN id SET DEFAULT nextval('public."MarketplaceItems_id_seq"'::regclass);


--
-- Name: MentorProfiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MentorProfiles" ALTER COLUMN id SET DEFAULT nextval('public."MentorProfiles_id_seq"'::regclass);


--
-- Name: PlacementInsights id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlacementInsights" ALTER COLUMN id SET DEFAULT nextval('public."PlacementInsights_id_seq"'::regclass);


--
-- Name: PredictionLogs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PredictionLogs" ALTER COLUMN id SET DEFAULT nextval('public."PredictionLogs_id_seq"'::regclass);


--
-- Data for Name: AlumniProfiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AlumniProfiles" (id, "userId", "graduationYear", batch, company, designation, location, "linkedIn", bio, skills, "isVerified", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Announcements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Announcements" (id, title, content, category, "isPinned", "expiresAt", "postedById", "targetRole", "createdAt", "updatedAt", "collegeId") FROM stdin;
\.


--
-- Data for Name: AssignmentSubmissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AssignmentSubmissions" (id, "assignmentId", "studentId", "fileUrl", "submittedAt", grade, feedback, status, "createdAt", "updatedAt") FROM stdin;
cf3bd1db-d2c2-49b2-a598-66410af5d7cc	56f3eaf5-ad5d-4614-938f-c685fd675e54	8e555c38-60a3-4bac-b40e-45551c30a9ad	/uploads/assignments/1785667871514-KIIT_Theory_HallTicket_UJJWAL.pdf	2026-08-02 16:21:11.524+05:30	13		graded	2026-08-02 16:21:11.525+05:30	2026-08-02 16:48:00.018+05:30
\.


--
-- Data for Name: Assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Assignments" (id, title, description, "subjectId", "teacherId", "dueDate", "maxMarks", "createdAt", "updatedAt", "fileUrl", "isLocked") FROM stdin;
56f3eaf5-ad5d-4614-938f-c685fd675e54	assignment 1		86cb9f66-340a-458a-8d03-5222fdf1a82d	121eac85-bfc0-4002-b176-4a198cfade89	2026-08-04 17:00:00+05:30	15	2026-08-02 16:14:54.099+05:30	2026-08-02 16:14:54.099+05:30	/uploads/assignments/1785667493971-DBMS_Full_Notes.pdf	f
\.


--
-- Data for Name: AttendanceRecords; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AttendanceRecords" (id, "attendanceId", "studentId", status, "createdAt", "updatedAt") FROM stdin;
3eba4609-cf09-4818-a8a1-193f49dc8c98	8c32792f-4113-46a7-87c4-131c06600dd4	effe52a6-9714-4b02-9d10-abf544d74396	present	2026-07-28 19:28:49.586+05:30	2026-07-28 19:28:49.586+05:30
3bac2000-1800-4929-8854-31b1fa01ebf7	8c32792f-4113-46a7-87c4-131c06600dd4	8e555c38-60a3-4bac-b40e-45551c30a9ad	absent	2026-07-28 19:28:57.51+05:30	2026-07-28 19:28:57.51+05:30
71143ea7-3ada-499c-b274-39b3439ff8b0	8c32792f-4113-46a7-87c4-131c06600dd4	b1b7502d-1573-4f1c-9231-714861890adf	absent	2026-07-28 19:28:57.51+05:30	2026-07-28 19:28:57.51+05:30
2129e285-dbe4-4d07-8fc9-e01b68139677	91094378-f674-4640-bc09-1b4fbfd9a889	8e555c38-60a3-4bac-b40e-45551c30a9ad	present	2026-08-02 13:11:07.497+05:30	2026-08-02 13:11:07.497+05:30
ea133784-c28a-4615-9b02-6c87febfc6ec	e1d4dce7-57f2-449f-a176-9c1a415ebc18	8e555c38-60a3-4bac-b40e-45551c30a9ad	present	2026-08-02 13:12:46.852+05:30	2026-08-02 16:49:59.687+05:30
\.


--
-- Data for Name: Attendances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Attendances" (id, "classId", "subjectId", date, "markedById", "createdAt", "updatedAt") FROM stdin;
8c32792f-4113-46a7-87c4-131c06600dd4	313e3a8d-6380-4331-818c-383eaea7eefa	86cb9f66-340a-458a-8d03-5222fdf1a82d	2026-07-28	121eac85-bfc0-4002-b176-4a198cfade89	2026-07-28 19:28:14.047+05:30	2026-07-28 19:28:14.047+05:30
91094378-f674-4640-bc09-1b4fbfd9a889	313e3a8d-6380-4331-818c-383eaea7eefa	86cb9f66-340a-458a-8d03-5222fdf1a82d	2026-08-07	95070d3a-4aa1-41af-9aa7-b2d2e9859c5c	2026-08-02 13:11:07.16+05:30	2026-08-02 13:11:07.16+05:30
e1d4dce7-57f2-449f-a176-9c1a415ebc18	313e3a8d-6380-4331-818c-383eaea7eefa	86cb9f66-340a-458a-8d03-5222fdf1a82d	2026-08-02	4b624d5e-ee56-43af-bd6f-7d3f539a736e	2026-08-02 13:12:46.83+05:30	2026-08-02 13:12:46.83+05:30
\.


--
-- Data for Name: BookCheckouts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BookCheckouts" (id, "bookId", "studentId", "checkoutDate", "dueDate", "returnDate", status, "createdAt", "updatedAt") FROM stdin;
550c99cb-1c13-448a-8051-93c4e3d35710	8aac50f6-26dd-4a80-880d-4aad36603a5a	8e555c38-60a3-4bac-b40e-45551c30a9ad	2026-07-23 01:26:54.039+05:30	2026-08-06 01:26:54.039+05:30	2026-07-23 01:27:02.974+05:30	returned	2026-07-23 01:26:54.04+05:30	2026-07-23 01:27:02.975+05:30
bf01fc85-5eeb-43c5-828c-13be0fe58c84	e87d95f4-d70b-43d2-ad40-0796612e223d	8e555c38-60a3-4bac-b40e-45551c30a9ad	2026-07-23 01:27:14.996+05:30	2026-08-06 01:27:14.996+05:30	2026-07-23 01:27:35.189+05:30	returned	2026-07-23 01:27:14.996+05:30	2026-07-23 01:27:35.189+05:30
e94b8413-0c3d-4700-9a5b-c37f808c3121	e87d95f4-d70b-43d2-ad40-0796612e223d	effe52a6-9714-4b02-9d10-abf544d74396	2026-07-25 18:51:00.04+05:30	2026-08-08 18:51:00.039+05:30	2026-07-25 18:51:17.338+05:30	returned	2026-07-25 18:51:00.041+05:30	2026-07-25 18:51:17.338+05:30
\.


--
-- Data for Name: BookReviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BookReviews" (id, "bookId", "studentId", rating, comment, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Classes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Classes" (id, name, description, "createdAt", "updatedAt", "collegeId", latitude, longitude, "activeOtp", "activeOtpExpires", "activeQrToken", "isSessionActive") FROM stdin;
313e3a8d-6380-4331-818c-383eaea7eefa	3RD YEAR	COLLEGE	2026-07-15 13:47:58.385+05:30	2026-08-01 23:09:10.859+05:30	42cdc2ba-b326-47b6-ae91-1d9717a6e0e7	20.348915685773378	85.8158409616127	\N	\N	\N	f
51b2e00e-89d6-441e-ae58-47d80a6e0722	3RD YEAR - NIT	\N	2026-08-03 10:31:54.133+05:30	2026-08-03 10:31:54.133+05:30	e36412b8-7d6c-4c34-addd-b38a48e92e59	20.3533	85.8266	\N	\N	\N	f
\.


--
-- Data for Name: Colleges; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Colleges" (id, name, "createdAt", "updatedAt", "logoUrl", "secretKey", latitude, longitude, "midSemStartDate", "midSemEndDate", "isMidSemAdmitCardEnabled", "endSemStartDate", "endSemEndDate", "isEndSemAdmitCardEnabled") FROM stdin;
e36412b8-7d6c-4c34-addd-b38a48e92e59	Nexus Institute of Technology	2026-07-25 09:30:38.778+05:30	2026-07-25 09:30:38.778+05:30	\N	NEXUS-STAFF-2026	20.3533	85.8266	\N	\N	f	\N	\N	f
42cdc2ba-b326-47b6-ae91-1d9717a6e0e7	Apex Engineering College	2026-07-25 09:30:38.76+05:30	2026-08-02 16:06:19.796+05:30	\N	APEX-STAFF-2026	20.348931	85.815931	\N	\N	f	\N	\N	f
\.


--
-- Data for Name: CompanyListings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CompanyListings" (id, name, "position", type, package, criteria, description, steps, deadline, "createdAt", "updatedAt") FROM stdin;
ea4f1fa3-9f62-4c4c-a02e-76052e98c782	Google	Software Engineer Intern	internship	₹1,00,000 / month	Currently enrolled in BCA, B.Tech or equivalent. CGPA >= 8.0. No active backlogs.	Join the Google Engineering team to build next-generation applications. You will work on real-world projects and collaborate with senior engineers.	1. Resume Shortlisting\n2. Online Coding Assessment (2 questions, 90 mins)\n3. Technical Interview (Data Structures & Algorithms)\n4. Go/No-Go Review	2026-09-30	2026-07-17 17:10:24.204+05:30	2026-07-17 17:10:24.204+05:30
17b1aa03-f48c-48ed-9310-3fcb7266ca87	Microsoft	Associate Software Developer	placement	₹18,00,000 / annum	Graduating students of BCA/MCA/B.Tech. CGPA >= 7.5. Strong foundation in OOP and system design.	Full-time software engineering role at Microsoft. Design, build and maintain scalable cloud services on Azure.	1. CV Screening\n2. Codility Test\n3. System Design Round\n4. HR and Culture Fit Round	2026-10-15	2026-07-17 17:10:24.204+05:30	2026-07-17 17:10:24.204+05:30
eadfad08-d7f7-4f38-a509-041ca2276201	TCS (Tata Consultancy Services)	Ninja Developer	placement	₹4,50,000 / annum	Open to all BCA, BSc, and MCA students. Minimum 60% in 10th, 12th, and graduation.	Entry-level full-time development role under TCS National Qualifier Test (NQT). Excellent opportunity to start your IT career.	1. TCS NQT Exam (Aptitude & Coding)\n2. Technical & Managerial Interview\n3. HR Onboarding	2026-08-30	2026-07-17 17:10:24.204+05:30	2026-07-17 17:10:24.204+05:30
fdf3e344-d189-4d78-aa79-9351dfeaee0c	Wipro	Elite Project Engineer	placement	₹4,00,000 / annum	BCA or BSc Computer Science graduates. CGPA >= 6.0.	Work on cutting-edge enterprise projects at Wipro. Training and certification included.	1. Aptitude + Written Communication Test\n2. Technical Interview\n3. HR Round	2026-08-20	2026-07-17 17:10:24.204+05:30	2026-07-17 17:10:24.204+05:30
c760b07f-2f31-4c10-8caa-7707041fee80	Infosys	Systems Engineer	placement	₹4,20,000 / annum	BCA, MCA, and MSc graduates. 65% aggregate or above.	Solve real-world business problems by engineering cloud, AI, and big data solutions.	1. Infosys Certification Exam\n2. Technical round\n3. HR Interview	2026-09-10	2026-07-17 17:10:24.204+05:30	2026-07-17 17:10:24.204+05:30
8e4a5c3c-244f-4a47-87cd-74fafa690318	KIIT R&D Lab	Research Intern	internship	₹15,000 / month	Open to KIIT students of any year. Passion for machine learning and academic research.	Conduct literature reviews and assist professors in writing research papers on artificial intelligence and agentic workflows.	1. SOP Round\n2. Interview with Research Directors	2026-07-31	2026-07-17 17:10:24.204+05:30	2026-07-17 17:10:24.204+05:30
\.


--
-- Data for Name: Confessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Confessions" (id, content, "collegeId", "createdAt") FROM stdin;
\.


--
-- Data for Name: ForumPosts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ForumPosts" (id, "userId", "subjectId", title, content, "createdAt", "updatedAt", tag, "isSolved", upvotes) FROM stdin;
\.


--
-- Data for Name: ForumReplies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ForumReplies" (id, "postId", "userId", content, "createdAt", "updatedAt", "isAnswer") FROM stdin;
\.


--
-- Data for Name: Holidays; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Holidays" (id, title, date, type, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: InterviewExperiences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."InterviewExperiences" (id, "studentId", "companyName", "roleApplied", questions, difficulty, outcome, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: JobApplications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."JobApplications" (id, "jobPostId", "studentId", "coverLetter", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: JobPosts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."JobPosts" (id, title, company, description, location, salary, type, "postedById", deadline, skills, "applyLink", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LeaveRequests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LeaveRequests" (id, "studentId", "startDate", "endDate", reason, status, "approvedById", "createdAt", "updatedAt", type, "certificateUrl") FROM stdin;
f190961c-1176-4987-a466-479d90e5cddd	effe52a6-9714-4b02-9d10-abf544d74396	2026-07-16	2026-07-17	LEAVE FOR RATH YATRA	approved	4b624d5e-ee56-43af-bd6f-7d3f539a736e	2026-07-15 13:50:36.961+05:30	2026-07-15 13:51:14.366+05:30	personal	\N
90e2f8bc-a846-452e-8b10-2b8a8c4fcd1d	b1b7502d-1573-4f1c-9231-714861890adf	2026-07-26	2026-08-19	HACKATHON IN DELHI\n	approved	4b624d5e-ee56-43af-bd6f-7d3f539a736e	2026-07-16 17:05:33.253+05:30	2026-07-16 17:06:58.173+05:30	duty	\N
7b9bc268-cef4-42fe-a178-e20d1bd4da19	b1b7502d-1573-4f1c-9231-714861890adf	2026-07-24	2026-07-29	sick	rejected	4b624d5e-ee56-43af-bd6f-7d3f539a736e	2026-07-17 16:34:59.294+05:30	2026-07-17 16:35:31.72+05:30	duty	\N
\.


--
-- Data for Name: LibraryBooks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LibraryBooks" (id, title, author, category, "totalCopies", "availableCopies", "ebookUrl", "coverUrl", "createdAt", "updatedAt") FROM stdin;
c184c38f-3a69-4581-8c41-e31258d8d888	Introduction to Algorithms	Thomas H. Cormen	Computer Science	5	5	https://example.com/algorithms.pdf	\N	2026-07-23 01:25:57.522+05:30	2026-07-23 01:25:57.522+05:30
b29704d4-eff9-4ef1-9218-9dd1c3040428	Database System Concepts	Abraham Silberschatz	Database Systems	2	2	https://example.com/db-concepts.pdf	\N	2026-07-23 01:25:57.522+05:30	2026-07-23 01:25:57.522+05:30
b2cb555e-adb6-4bff-b129-0fe3194a4c0b	Artificial Intelligence: A Modern Approach	Stuart Russell and Peter Norvig	Artificial Intelligence	1	1		\N	2026-07-23 01:25:57.522+05:30	2026-07-23 01:25:57.522+05:30
8aac50f6-26dd-4a80-880d-4aad36603a5a	Clean Code: A Handbook of Agile Software Craftsmanship	Robert C. Martin	Software Engineering	4	4		\N	2026-07-23 01:25:57.522+05:30	2026-07-23 01:27:02.977+05:30
e87d95f4-d70b-43d2-ad40-0796612e223d	Design Patterns: Elements of Reusable Object-Oriented Software	Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides	Software Engineering	3	3	https://example.com/design-patterns.pdf	\N	2026-07-23 01:25:57.522+05:30	2026-07-25 18:51:17.342+05:30
\.


--
-- Data for Name: MarketplaceItems; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MarketplaceItems" (id, title, description, price, currency, global, "sellerId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Marks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Marks" (id, "studentId", "subjectId", "midSem", assignment, quiz, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MaterialPurchases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MaterialPurchases" (id, "studentId", "materialId", "createdAt", "updatedAt", "purchaseType", "leaseExpiresAt") FROM stdin;
\.


--
-- Data for Name: Materials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Materials" (id, "subjectId", title, "contentUrl", date, "createdAt", "updatedAt", "uploaderId", price, description, "itemType") FROM stdin;
207f5b98-b7ef-4b0f-a1ae-d5d0e2fadd47	86cb9f66-340a-458a-8d03-5222fdf1a82d	Data Structures Complete Handwritten Notes	/uploads/notes/ds-notes.pdf	2026-07-25	2026-07-25 09:08:45.961+05:30	2026-07-25 09:08:45.961+05:30	\N	15	Comprehensive handwritten class notes covering Arrays, Linked Lists, Trees, and Graphs with visual diagrams.	notes
f0aa3e85-ba84-4448-9018-110f5601fc45	86cb9f66-340a-458a-8d03-5222fdf1a82d	Artificial Intelligence Cheat Sheet	/uploads/notes/ai-cheat-sheet.pdf	2026-07-25	2026-07-25 09:08:45.973+05:30	2026-07-25 09:08:45.973+05:30	\N	10	Quick reference sheet for AI algorithms, heuristics, searching techniques, and neural networks formulas.	notes
dc9c6b90-9cd0-4ce3-93e1-463dbda3905f	86cb9f66-340a-458a-8d03-5222fdf1a82d	Machine Learning PYQs (2025 Solved)	/uploads/notes/ml-pyqs.pdf	2026-07-25	2026-07-25 09:08:45.976+05:30	2026-07-25 09:08:45.976+05:30	\N	25	Solved previous year question papers from 2023-2025 containing step-by-step mathematical answers.	pyqs
89749cf7-bd8f-45eb-a013-ae6b38e14418	86cb9f66-340a-458a-8d03-5222fdf1a82d	DBMS Midterm Solved Papers	/uploads/notes/dbms-midterm.pdf	2026-07-25	2026-07-25 09:08:45.979+05:30	2026-07-25 09:08:45.979+05:30	\N	20	Last 5 years mid-term examination questions solved by top scorers. Focuses on SQL and Normalization.	pyqs
\.


--
-- Data for Name: MentorProfiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MentorProfiles" (id, "userId", expertise, available, rating, "createdAt") FROM stdin;
\.


--
-- Data for Name: MentorshipSlots; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MentorshipSlots" (id, "mentorId", "menteeId", "startTime", "endTime", topic, status, "meetingLink", "createdAt", "updatedAt") FROM stdin;
5e5acb46-2e3b-433a-a58f-a10cbeb06562	4b624d5e-ee56-43af-bd6f-7d3f539a736e	b1b7502d-1573-4f1c-9231-714861890adf	2026-07-18 16:59:00+05:30	2026-07-18 17:59:00+05:30	DSA IN JAVA 	booked	https://meet.google.com/pew-aunm-hmk 	2026-07-18 16:09:36.668+05:30	2026-07-19 23:06:01.628+05:30
\.


--
-- Data for Name: Messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Messages" (id, "senderId", "receiverId", "studyGroupId", "studyRequestId", content, "isRead", "createdAt", "updatedAt") FROM stdin;
a834768e-4ec1-4c1a-88e6-7d7d41042999	effe52a6-9714-4b02-9d10-abf544d74396	\N	3cb1316c-336b-42d8-996f-48d5030a51b5	\N	HIII	f	2026-07-22 16:33:23.171+05:30	2026-07-22 16:33:23.171+05:30
7828037a-14dc-4626-93c1-ca3781be2c6f	effe52a6-9714-4b02-9d10-abf544d74396	\N	3cb1316c-336b-42d8-996f-48d5030a51b5	\N	hii	f	2026-07-22 16:34:41.083+05:30	2026-07-22 16:34:41.083+05:30
d43e3745-d893-468f-a4a4-785c55d8fc45	effe52a6-9714-4b02-9d10-abf544d74396	\N	aee9b6ab-bbb1-4775-baa4-a62466f6088c	\N	HII	f	2026-07-26 00:18:43.306+05:30	2026-07-26 00:18:43.306+05:30
\.


--
-- Data for Name: Notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notifications" (id, "userId", title, message, type, "isRead", "createdAt", "updatedAt") FROM stdin;
6ad3cddd-e266-432a-b298-f3b1e3af922e	effe52a6-9714-4b02-9d10-abf544d74396	System Update	Notifications are now live and fully functional!	success	t	2026-07-19 23:00:40.703+05:30	2026-07-19 23:01:47.569+05:30
1a2f8c09-affe-47b7-b847-b3b6f509bab6	121eac85-bfc0-4002-b176-4a198cfade89	System Update	Notifications are now live and fully functional!	success	t	2026-07-19 23:00:40.701+05:30	2026-07-19 23:01:58.673+05:30
9cf72d73-bda9-4443-bcaa-2b50c34e78d0	4b624d5e-ee56-43af-bd6f-7d3f539a736e	System Update	Notifications are now live and fully functional!	success	t	2026-07-19 23:00:40.668+05:30	2026-07-19 23:03:51.585+05:30
08294088-4c7b-497f-a749-10f3efe8f80c	effe52a6-9714-4b02-9d10-abf544d74396	ATTENDANCE WARNING	Your overall attendance has dropped to 62.5%. Please attend classes regularly to avoid detention.	alert	t	2026-07-21 13:02:47.382+05:30	2026-07-21 13:03:29.038+05:30
e40cde89-5247-4c6e-9bc7-82cd031c7b45	effe52a6-9714-4b02-9d10-abf544d74396	ATTENDANCE WARNING	Your overall attendance has dropped to 62.5%. Please attend classes regularly to avoid detention.	alert	t	2026-07-21 13:03:06.819+05:30	2026-07-21 13:03:39.794+05:30
03a231fb-8ea0-4648-95af-23ef86e47cd4	effe52a6-9714-4b02-9d10-abf544d74396	ATTENDANCE WARNING	Your overall attendance has dropped to 62.5%. Please attend classes regularly to avoid detention.	alert	t	2026-07-21 13:13:55.897+05:30	2026-07-21 15:03:37.299+05:30
8a7d098d-576e-4fdb-8f70-a52938bcec26	b1b7502d-1573-4f1c-9231-714861890adf	System Update	Notifications are now live and fully functional!	success	t	2026-07-19 23:00:40.698+05:30	2026-07-21 15:09:02.533+05:30
7c8ffc6b-a75f-4369-ba1f-c3ac100acf82	b1b7502d-1573-4f1c-9231-714861890adf	Study Buddy Request	A classmate has requested your help tutoring ML. Accept to earn 100 Tokens!	info	t	2026-07-21 12:29:47.355+05:30	2026-07-21 15:09:02.533+05:30
ed42f942-bd79-4753-b33b-cae5ce175b8d	b1b7502d-1573-4f1c-9231-714861890adf	ATTENDANCE WARNING	Your overall attendance has dropped to 37.5%. Please attend classes regularly to avoid detention.	alert	t	2026-07-21 13:02:47.368+05:30	2026-07-21 15:09:02.533+05:30
e2d0a378-4350-45fa-ad79-0b1ac10e22fc	b1b7502d-1573-4f1c-9231-714861890adf	ATTENDANCE WARNING	Your overall attendance has dropped to 37.5%. Please attend classes regularly to avoid detention.	alert	t	2026-07-21 13:03:06.8+05:30	2026-07-21 15:09:02.533+05:30
2a3ffa0c-4294-4bf5-8f63-614a7130366b	b1b7502d-1573-4f1c-9231-714861890adf	ATTENDANCE WARNING	Your overall attendance has dropped to 37.5%. Please attend classes regularly to avoid detention.	alert	t	2026-07-21 13:13:55.877+05:30	2026-07-21 15:09:02.533+05:30
e6502cbd-8b51-4f8f-9cad-bd823fb36951	effe52a6-9714-4b02-9d10-abf544d74396	Buddy Found!	Your tutor has accepted your study buddy request.	success	t	2026-07-21 15:08:49.214+05:30	2026-07-21 15:31:30.058+05:30
6da399fd-32fc-4b27-b263-1b5d6386cd67	8e555c38-60a3-4bac-b40e-45551c30a9ad	Study Buddy Request	A classmate has requested your help tutoring IDS.	info	t	2026-07-21 15:30:45.401+05:30	2026-07-22 16:42:53.995+05:30
18ecd439-2e94-44d2-8750-73ec77500bc1	8e555c38-60a3-4bac-b40e-45551c30a9ad	System Update	Notifications are now live and fully functional!	success	t	2026-07-19 23:00:40.695+05:30	2026-07-22 16:42:55.224+05:30
dd198424-5408-4d44-afc2-7f522399637c	b1b7502d-1573-4f1c-9231-714861890adf	🔴 Live Session Started!	aryan just went live for: "MIDSEM PREP". Join the group now to participate!	info	t	2026-07-26 00:17:17.979+05:30	2026-07-26 00:18:04.239+05:30
2d02c4bf-e4e5-4d81-8001-27958c7cc82c	b1b7502d-1573-4f1c-9231-714861890adf	Absence Alert	You were marked ABSENT for AI on 2026-07-28.	alert	t	2026-07-28 19:29:05.595+05:30	2026-07-31 17:18:53.953+05:30
526c6631-b402-41af-bd92-9aa6371c7c6f	8e555c38-60a3-4bac-b40e-45551c30a9ad	🔴 Live Session Started!	aryan just went live for: "MIDSEM PREP". Join the group now to participate!	info	t	2026-07-26 00:17:17.979+05:30	2026-08-01 22:19:21.951+05:30
d681b4ee-2b2c-45dd-a767-1b36c984d273	8e555c38-60a3-4bac-b40e-45551c30a9ad	Absence Alert	You were marked ABSENT for AI on 2026-07-28.	alert	t	2026-07-28 19:28:57.544+05:30	2026-08-01 22:19:21.951+05:30
a7be10e8-3bab-41cb-9e2c-0fc6f9d6d2c2	8e555c38-60a3-4bac-b40e-45551c30a9ad	Attendance Credit Added 📈	Your attendance shortage recovery petition for Condonation has been verified! Credit of 2 hours has been logged.	alert	t	2026-08-02 13:12:46.862+05:30	2026-08-02 13:15:09.851+05:30
9fee8913-cc79-4fc4-a6cd-fecb5e52e3c7	8e555c38-60a3-4bac-b40e-45551c30a9ad	Attendance Credit Added 📈	Your attendance shortage recovery petition for Saturday Remedial class has been verified! Credit of 1 hours has been logged.	alert	t	2026-08-02 13:12:07.96+05:30	2026-08-02 13:15:11.882+05:30
8027e3e5-00e7-4a2b-a548-24fb1546bffa	effe52a6-9714-4b02-9d10-abf544d74396	New Quiz Scheduled 🧠	A new quiz "tree graph" has been scheduled for AI. Time Limit: 20 mins.	info	f	2026-08-02 16:35:33.503+05:30	2026-08-02 16:35:33.503+05:30
c5c693e4-f925-4e61-a58a-901c9542396d	b1b7502d-1573-4f1c-9231-714861890adf	New Quiz Scheduled 🧠	A new quiz "tree graph" has been scheduled for AI. Time Limit: 20 mins.	info	t	2026-08-02 16:35:33.503+05:30	2026-08-02 16:36:19.143+05:30
e53321a4-63b2-4ac4-b408-ead450469124	8e555c38-60a3-4bac-b40e-45551c30a9ad	New Quiz Scheduled 🧠	A new quiz "tree graph" has been scheduled for AI. Time Limit: 20 mins.	info	t	2026-08-02 16:35:33.503+05:30	2026-08-02 16:37:47.105+05:30
787ba62d-58b2-4106-8f3f-600c442407e0	8e555c38-60a3-4bac-b40e-45551c30a9ad	Attendance Credit Added 📈	Your attendance shortage recovery petition for Saturday Remedial class has been verified! Credit of 1 hours has been logged.	alert	t	2026-08-02 16:49:59.689+05:30	2026-08-02 16:50:51.652+05:30
\.


--
-- Data for Name: Opportunities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Opportunities" (id, title, description, type, link, deadline, "postedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PlacementApplications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PlacementApplications" (id, "studentId", "companyListingId", status, "submissionText", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PlacementInsights; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PlacementInsights" (id, company, role, package, "collegeId", "submittedBy", "createdAt") FROM stdin;
\.


--
-- Data for Name: PredictionLogs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PredictionLogs" (id, "userId", "inputData", "predictionResult", "createdAt") FROM stdin;
\.


--
-- Data for Name: PrepHistories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PrepHistories" (id, "studentId", type, target, score, details, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ProjectInvites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProjectInvites" (id, "projectPostingId", "inviteeId", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ProjectPostings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProjectPostings" (id, "creatorId", title, description, "requiredSkills", "maxTeamSize", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: QuizAttempts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."QuizAttempts" (id, "quizId", "studentId", answers, score, "completedAt", "timeTakenSeconds", "createdAt", "updatedAt") FROM stdin;
9d699b0a-903c-4c5e-b7ce-98187933dfde	b4a654b1-c2f0-449a-95ae-d5598521c844	8e555c38-60a3-4bac-b40e-45551c30a9ad	{}	0	2026-08-02 16:20:50.069+05:30	\N	2026-08-02 16:20:50.073+05:30	2026-08-02 16:20:50.073+05:30
34e77473-9c04-49ff-afa4-00effeceb783	d65b197e-832b-45d1-b925-92590cb50082	8e555c38-60a3-4bac-b40e-45551c30a9ad	{"1f64594e-8d8b-4287-acd0-53418c08eb1c":3,"2b6ae7d3-096e-4439-8663-0f4f01762028":0,"0354f95c-29d3-4cd4-bcd4-b5c38c2cb963":3,"a32d6cd6-523e-434f-a630-06cd0173f0ef":2,"9454c592-c92e-444e-ba84-55bd3fc666bd":3}	1	2026-08-02 16:38:16.489+05:30	25	2026-08-02 16:38:16.49+05:30	2026-08-02 16:38:16.49+05:30
50024bc4-14d5-4ea9-9693-b4ee6399ec1d	b4a654b1-c2f0-449a-95ae-d5598521c844	b1b7502d-1573-4f1c-9231-714861890adf	{}	0	2026-08-03 10:36:55.053+05:30	\N	2026-08-03 10:36:55.055+05:30	2026-08-03 10:36:55.055+05:30
078d1e61-5344-4bf6-990c-5346c015aab6	d65b197e-832b-45d1-b925-92590cb50082	b1b7502d-1573-4f1c-9231-714861890adf	{}	0	2026-08-03 10:37:07.516+05:30	6	2026-08-03 10:37:07.516+05:30	2026-08-03 10:37:07.516+05:30
\.


--
-- Data for Name: QuizQuestions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."QuizQuestions" (id, "quizId", question, options, "correctAnswer", marks, "createdAt", "updatedAt") FROM stdin;
4c58b9a3-2810-4f46-b226-4969140ce0da	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
a258e7ad-afe5-446f-8e87-6de5978655f8	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
4eace2d1-b322-49f6-9151-705abd995ade	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
0cc6f86b-5f22-4c04-be93-b579adf54693	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
7228f908-010b-49cf-90de-4b1695e32cb2	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
aeed1491-d531-4a90-bc1f-9ea69d019b13	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
3cead2d5-fedd-4b4f-901c-d906a2f78851	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
968e7c2d-850d-40c5-a674-5596c43cacb6	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
95a3a6d7-1cd2-4004-b8b4-42f5c19715dc	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
cb11797d-b812-4051-9409-c28b33b2b065	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
32c3b12f-2cfd-43f4-8636-51ab25a77a76	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
67e53922-6c0b-4383-874c-41b2dcbfd356	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
cf45f26b-7ad3-4978-bde1-e0ee90369478	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
c8201bd2-74a6-41a3-874c-8ca013bf40c0	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
03a7d464-364e-4dc9-a903-38c5a28a1654	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
5afdd4a4-07c2-48f3-8fba-3aaf30e9f080	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
e43f56ce-d560-45ad-a0aa-efafd325660c	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
e2f731b4-589e-4b5e-9623-d35d0355ae22	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
ec62fc66-f3d4-4ad6-9894-df3db2f31239	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
c0d6d487-ee5d-4711-9625-39682931f3da	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
330096fb-429b-47c0-9445-c71a7aa56389	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
4b7b457a-1a5b-4478-9ad3-6b1e5433c345	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
2dc3896e-08b4-4d61-8a42-5f4816c523e9	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
c7dba0e8-8a09-4d69-8d95-a52d3cde7e9d	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
e3c090f0-0ed9-45a1-9976-cc67a460b0b9	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
544f2063-21f2-4577-999d-431312697aee	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
9857aed4-2f91-4523-b450-16b5c33db9dc	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
eb2923a8-62c3-4f1e-bc14-13d61be72010	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
fdc2c932-2904-4711-936f-06782c61bd8e	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
7fc9bc31-d607-4cd1-9582-eb4fb9d254cf	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
430d5c41-a501-42d2-a236-7c1cbb0d3ae1	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
dc0d90d1-b0ef-41aa-a0fa-e1c2c81d367a	b4a654b1-c2f0-449a-95ae-d5598521c844		["","","",""]	0	1	2026-08-02 16:13:20.755+05:30	2026-08-02 16:13:20.755+05:30
9454c592-c92e-444e-ba84-55bd3fc666bd	d65b197e-832b-45d1-b925-92590cb50082		["","","",""]	0	1	2026-08-02 16:35:33.514+05:30	2026-08-02 16:35:33.514+05:30
a32d6cd6-523e-434f-a630-06cd0173f0ef	d65b197e-832b-45d1-b925-92590cb50082		["","","",""]	0	1	2026-08-02 16:35:33.514+05:30	2026-08-02 16:35:33.514+05:30
b4559b72-87de-4971-8b8f-784d5b2f90c3	d65b197e-832b-45d1-b925-92590cb50082		["","","",""]	0	1	2026-08-02 16:35:33.514+05:30	2026-08-02 16:35:33.514+05:30
0354f95c-29d3-4cd4-bcd4-b5c38c2cb963	d65b197e-832b-45d1-b925-92590cb50082		["","","",""]	0	1	2026-08-02 16:35:33.514+05:30	2026-08-02 16:35:33.514+05:30
2b6ae7d3-096e-4439-8663-0f4f01762028	d65b197e-832b-45d1-b925-92590cb50082		["","","",""]	0	1	2026-08-02 16:35:33.514+05:30	2026-08-02 16:35:33.514+05:30
1f64594e-8d8b-4287-acd0-53418c08eb1c	d65b197e-832b-45d1-b925-92590cb50082		["","","",""]	0	1	2026-08-02 16:35:33.514+05:30	2026-08-02 16:35:33.514+05:30
0f1ef923-1988-4515-b56a-d35e6091cd91	d65b197e-832b-45d1-b925-92590cb50082		["","","",""]	0	1	2026-08-02 16:35:33.514+05:30	2026-08-02 16:35:33.514+05:30
280fca36-b7f0-4463-8d31-833f56ca81bf	d65b197e-832b-45d1-b925-92590cb50082		["","","",""]	0	1	2026-08-02 16:35:33.514+05:30	2026-08-02 16:35:33.514+05:30
be6306a4-16ad-47d6-804d-a4b8bc7c36fc	d65b197e-832b-45d1-b925-92590cb50082		["","","",""]	0	1	2026-08-02 16:35:33.514+05:30	2026-08-02 16:35:33.514+05:30
\.


--
-- Data for Name: Quizzes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Quizzes" (id, title, "subjectId", "teacherId", "timeLimitMinutes", "dueDate", "totalMarks", "isActive", "createdAt", "updatedAt", "isLocked") FROM stdin;
b4a654b1-c2f0-449a-95ae-d5598521c844	rttr	86cb9f66-340a-458a-8d03-5222fdf1a82d	121eac85-bfc0-4002-b176-4a198cfade89	0	2026-08-09 20:00:00+05:30	32	t	2026-08-02 16:13:20.579+05:30	2026-08-02 16:13:20.579+05:30	f
d65b197e-832b-45d1-b925-92590cb50082	tree graph	86cb9f66-340a-458a-8d03-5222fdf1a82d	121eac85-bfc0-4002-b176-4a198cfade89	20	2026-08-02 16:40:00+05:30	9	t	2026-08-02 16:35:33.327+05:30	2026-08-02 16:35:33.327+05:30	f
\.


--
-- Data for Name: RecoveryAssignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RecoveryAssignments" (id, "studentId", "subjectId", title, description, status, "submissionText", "boostCount", "createdAt", "updatedAt", "absenceReason", "absenceDate", "hoursMissed", "documentUrl", "reviewFeedback", "feePaid", "sessionType", "remedialStatus") FROM stdin;
b7724989-ec3d-40fe-8eee-c141f4aad265	effe52a6-9714-4b02-9d10-abf544d74396	86cb9f66-340a-458a-8d03-5222fdf1a82d	notes	sh\n	approved	ff\n	2	2026-07-21 12:42:11.186+05:30	2026-07-21 12:43:04.694+05:30	\N	\N	1	\N	\N	\N	Condonation Petition	Pending
83cee018-f756-40ed-b938-946f484bcf9c	8e555c38-60a3-4bac-b40e-45551c30a9ad	86cb9f66-340a-458a-8d03-5222fdf1a82d	fy	ghff	approved	tr	1	2026-08-01 22:34:25.801+05:30	2026-08-01 22:36:01.645+05:30	Medical Leave	2026-08-01	1		e43	\N	Condonation Petition	Pending
605d72d1-bad3-4d2d-9311-0f9be3d3eb8e	8e555c38-60a3-4bac-b40e-45551c30a9ad	86cb9f66-340a-458a-8d03-5222fdf1a82d	dsa	tree graph\n	pending	\N	1	2026-08-01 23:06:18.168+05:30	2026-08-02 13:12:07.937+05:30	Remedial Class Session	2026-08-07	1	\N	\N	\N	Remedial Class	Attended
50f59af7-dc6b-4f1e-ac2b-858413f8bac4	8e555c38-60a3-4bac-b40e-45551c30a9ad	86cb9f66-340a-458a-8d03-5222fdf1a82d	txn-33786304038302	hcsn	approved	\N	2	2026-08-02 13:08:42.558+05:30	2026-08-02 13:12:46.792+05:30	Medical Leave	2026-08-02	2	wuih3e	ssdfghjk\n	9.97	Condonation Petition	Pending
1f800e2f-0cb4-41b7-be22-cbcb211fdbcf	8e555c38-60a3-4bac-b40e-45551c30a9ad	86cb9f66-340a-458a-8d03-5222fdf1a82d	BFS AND DFS	IQJIO	pending	\N	1	2026-08-02 16:49:53.455+05:30	2026-08-02 16:49:59.665+05:30	Remedial Class Session	2026-08-02	1	\N	\N	\N	Remedial Class	Attended
\.


--
-- Data for Name: SelfAttendances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SelfAttendances" (id, "studentId", "subjectName", date, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: StudyGroupParticipants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StudyGroupParticipants" (id, "studyGroupId", "studentId", "createdAt", "updatedAt") FROM stdin;
af8cbd1c-3a6d-4dea-a43c-7d843cbf4356	78c8db15-9f7f-430a-b00b-6c29a6cf69fb	b1b7502d-1573-4f1c-9231-714861890adf	2026-07-22 15:16:41.738+05:30	2026-07-22 15:16:41.738+05:30
bf9cf098-98d2-417b-8717-bab3d9925572	3cb1316c-336b-42d8-996f-48d5030a51b5	effe52a6-9714-4b02-9d10-abf544d74396	2026-07-22 16:33:05.062+05:30	2026-07-22 16:33:05.062+05:30
bc1e1991-bc4b-4ef8-8386-4ce4003461c0	aee9b6ab-bbb1-4775-baa4-a62466f6088c	b1b7502d-1573-4f1c-9231-714861890adf	2026-07-26 00:18:25.157+05:30	2026-07-26 00:18:25.157+05:30
a4fe9843-d7e9-458d-b65f-f83c1fc8c374	aee9b6ab-bbb1-4775-baa4-a62466f6088c	effe52a6-9714-4b02-9d10-abf544d74396	2026-07-29 14:54:35.761+05:30	2026-07-29 14:54:35.761+05:30
\.


--
-- Data for Name: StudyGroups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StudyGroups" (id, "creatorId", "subjectId", title, description, "scheduledTime", "meetLink", "createdAt", "updatedAt", status, "notesData", "targetColleges") FROM stdin;
78c8db15-9f7f-430a-b00b-6c29a6cf69fb	b1b7502d-1573-4f1c-9231-714861890adf	86cb9f66-340a-458a-8d03-5222fdf1a82d	BFS AND DFS		2026-07-23 12:00:00+05:30	\N	2026-07-22 12:57:41.527+05:30	2026-07-22 15:16:47.764+05:30	completed	{"type":"text","content":""}	\N
3cb1316c-336b-42d8-996f-48d5030a51b5	effe52a6-9714-4b02-9d10-abf544d74396	86cb9f66-340a-458a-8d03-5222fdf1a82d	GRAPH/TREE		2026-07-22 17:00:00+05:30	\N	2026-07-22 16:33:04.966+05:30	2026-07-26 00:16:25.594+05:30	completed	{"type":"text","content":""}	\N
aee9b6ab-bbb1-4775-baa4-a62466f6088c	effe52a6-9714-4b02-9d10-abf544d74396	86cb9f66-340a-458a-8d03-5222fdf1a82d	MIDSEM PREP		2026-07-26 00:20:00+05:30	\N	2026-07-26 00:17:17.887+05:30	2026-07-29 14:54:47.401+05:30	completed	{"type":"text","content":""}	\N
\.


--
-- Data for Name: StudyGuides; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StudyGuides" (id, "studentId", title, summary, transcript, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: StudyRequests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."StudyRequests" (id, "requesterId", "tutorId", "subjectId", status, "createdAt", "updatedAt", "scheduledTime", rating, review, "whiteboardData") FROM stdin;
\.


--
-- Data for Name: Subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Subjects" (id, name, code, "classId", "teacherId", "createdAt", "updatedAt", type, credits, course) FROM stdin;
86cb9f66-340a-458a-8d03-5222fdf1a82d	AI	1003	313e3a8d-6380-4331-818c-383eaea7eefa	121eac85-bfc0-4002-b176-4a198cfade89	2026-07-18 15:13:20.281+05:30	2026-07-18 15:45:47.291+05:30	theory	3	BTech CSE
23adfdd3-901c-46fd-a769-792f100ab4a8	AI	CS-301	51b2e00e-89d6-441e-ae58-47d80a6e0722	95070d3a-4aa1-41af-9aa7-b2d2e9859c5c	2026-08-03 10:31:54.447+05:30	2026-08-03 10:31:54.447+05:30	theory	4	\N
\.


--
-- Data for Name: Tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tasks" (id, "studentId", title, "dueDate", type, "createdAt", "updatedAt", status) FROM stdin;
\.


--
-- Data for Name: TeamRequests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TeamRequests" (id, "opportunityId", "studentId", message, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Timetables; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Timetables" (id, "classId", "subjectId", "teacherId", "dayOfWeek", "startTime", "endTime", "roomNumber", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Transactions" (id, "studentId", amount, "paymentMethod", "transactionId", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Users" (id, name, email, password, role, "classId", "createdAt", "updatedAt", "parentEmail", "gracePeriodEnds", "resumeUrl", course, tokens, "lastTokenClaim", "collegeId", "faceDescriptor", "isPremium") FROM stdin;
752f8ede-20a5-44a7-9f56-2355682b0854	DEV NARAYAN	devnarayan1@gmail.com	$2a$10$G1OiNktyfSPadVyHzh8J6.rskngs99Qazl4HGL8YJCC5ADaZHCk3K	admin	\N	2026-07-25 19:39:12.697+05:30	2026-07-25 19:39:12.697+05:30	\N	\N	\N	\N	0	\N	e36412b8-7d6c-4c34-addd-b38a48e92e59	\N	f
effe52a6-9714-4b02-9d10-abf544d74396	aryan	aryan1@gmail.com	$2a$10$CiKvMYiTufc1tVouRIm5b.r2iOh.0DOu4hviVGal0SZHo9XEO.YJu	student	313e3a8d-6380-4331-818c-383eaea7eefa	2026-07-15 13:40:49.812+05:30	2026-07-29 12:23:28.175+05:30	aryan2@gmail.com	\N	\N	BTech CSE	50	2026-07-29 12:23:28.174+05:30	42cdc2ba-b326-47b6-ae91-1d9717a6e0e7	[-0.08765340596437454,0.06682729721069336,0.08681576699018478,-0.01742372289299965,-0.009004763327538967,-0.05557342246174812,0.008944930508732796,-0.04386890307068825,0.15917131304740906,-0.10943128168582916,0.254121333360672,-0.03789900615811348,-0.19716030359268188,-0.11928976327180862,-0.013074398972094059,0.09306549280881882,-0.0835648700594902,-0.11842518299818039,-0.1293606013059616,-0.1038222685456276,-0.01820238307118416,-0.023895351216197014,-0.0013232133351266384,0.03324207663536072,-0.1471773236989975,-0.32008180022239685,-0.03275052085518837,-0.15114466845989227,0.05574626848101616,-0.11629421263933182,-0.03439568728208542,0.013210161589086056,-0.19436198472976685,-0.08112477511167526,-0.05322851240634918,0.04199216887354851,-0.005849840119481087,0.019775215536355972,0.20286576449871063,0.01418840978294611,-0.13955697417259216,0.07521700859069824,-0.01553979143500328,0.28666481375694275,0.18204520642757416,0.06400144845247269,0.013516651466488838,-0.006678856443613768,0.12781651318073273,-0.2969532310962677,0.08293306082487106,0.05027664825320244,0.15766946971416473,0.03343033790588379,0.1277078092098236,-0.20057497918605804,-0.05095229670405388,0.049700867384672165,-0.1552305519580841,0.09861285984516144,-0.023922981694340706,-0.05401897057890892,-0.061775121837854385,-0.07561023533344269,0.29271307587623596,0.08824870735406876,-0.1174088791012764,-0.02637793868780136,0.19630010426044464,-0.10954561084508896,0.04985061660408974,0.07396278530359268,-0.06324492394924164,-0.11291571706533432,-0.2667236030101776,0.16322800517082214,0.41881442070007324,0.14705930650234222,-0.18873336911201477,0.0459381639957428,-0.13125739991664886,0.033043522387742996,0.012799352407455444,-0.023292236030101776,-0.11419179290533066,0.01764976792037487,-0.04055970162153244,0.011714688502252102,0.13258342444896698,0.013372549787163734,-0.059523191303014755,0.15258535742759705,-0.051129937171936035,0.06685107946395874,0.024177199229598045,-0.08445926010608673,-0.11389991641044617,-0.047062791883945465,-0.10010544955730438,0.023998277261853218,0.05250823497772217,-0.11968391388654709,0.03170144557952881,0.042955949902534485,-0.19548988342285156,0.11581269651651382,-0.01102414634078741,-0.03667890280485153,0.026072967797517776,0.14611586928367615,-0.10944083333015442,-0.006181430537253618,0.13844448328018188,-0.31745365262031555,0.26636242866516113,0.1474785953760147,0.04521067813038826,0.17013579607009888,0.08721018582582474,0.02337571606040001,-0.006063752807676792,0.06584423780441284,-0.10005474835634232,-0.09154298901557922,0.07928655296564102,-0.054776404052972794,0.11019531637430191,0.0639946311712265]	f
95070d3a-4aa1-41af-9aa7-b2d2e9859c5c	KRISHNA SINGH	krishnasingh@gmail.com	$2a$10$/py.8s8O.SZ61HYJ4Vu2.eysUFmJ8yEzNdbsZw4f//y4TQNI0LxSu	teacher	\N	2026-07-25 22:05:31.496+05:30	2026-08-01 22:18:09.836+05:30	\N	\N	\N	\N	0	\N	e36412b8-7d6c-4c34-addd-b38a48e92e59	\N	f
8e555c38-60a3-4bac-b40e-45551c30a9ad	NEERAJ	neeraj123@gmail.com	$2a$10$CW4i5/2xqByZ85iXIyTs4eZc3lAN9fuFdDRdz2rf3dcW4Tmhzm2p2	student	313e3a8d-6380-4331-818c-383eaea7eefa	2026-07-15 13:11:13.691+05:30	2026-08-02 16:04:26.222+05:30	parent321@gmail.com	\N	\N	BTech CSE	100	2026-08-02 16:04:26.222+05:30	42cdc2ba-b326-47b6-ae91-1d9717a6e0e7	\N	t
b1b7502d-1573-4f1c-9231-714861890adf	UJJWAL	ujjwal1@gmail.com	$2a$10$.pfQeI5mS.yIidWj9TWjCuP409BNO4neU4li8aX2p.JoEcwdP0SWi	student	51b2e00e-89d6-441e-ae58-47d80a6e0722	2026-07-15 13:10:16.696+05:30	2026-08-03 10:31:54.267+05:30	parent123@gmail.com	2026-08-07	\N	BTech CSE	5	2026-07-18 17:13:43.146+05:30	e36412b8-7d6c-4c34-addd-b38a48e92e59	[-0.09309124946594238,0.11520789563655853,0.0770832896232605,-0.054916977882385254,-0.0360565148293972,-0.03114284947514534,0.002852080389857292,-0.07648397982120514,0.1754404455423355,-0.13741080462932587,0.2488309144973755,-0.007724335882812738,-0.2028857320547104,-0.1584959179162979,-0.004926673602312803,0.09980380535125732,-0.1618911772966385,-0.1380600929260254,-0.09261051565408707,-0.11434749513864517,0.00910181924700737,-0.007556685712188482,0.009382938966155052,0.012503296136856079,-0.09647373110055923,-0.3562164604663849,-0.07550299912691116,-0.1676608771085739,0.10858280211687088,-0.06969709694385529,0.019371015951037407,-0.0001874981971923262,-0.18627922236919403,-0.05074299871921539,-0.07408616691827774,-0.003917804919183254,0.019621828570961952,0.01310715638101101,0.20944146811962128,0.03682446479797363,-0.16397735476493835,0.02104426920413971,-0.03552128002047539,0.2523159384727478,0.15697899460792542,0.06757479161024094,0.012494339607656002,0.00779258506372571,0.12923765182495117,-0.23625312745571136,0.10045383870601654,0.08288750052452087,0.20974451303482056,0.03694544732570648,0.12986071407794952,-0.26382648944854736,-0.02934282273054123,0.047804683446884155,-0.1872713714838028,0.10498269647359848,-0.07164853066205978,-0.07587295025587082,-0.021860359236598015,-0.017113931477069855,0.3012270927429199,0.12926653027534485,-0.09280110895633698,-0.11766282469034195,0.23635108768939972,-0.1151721179485321,0.027654310688376427,0.11827875673770905,-0.09376221150159836,-0.07975738495588303,-0.28575024008750916,0.10428187996149063,0.3924311101436615,0.1308024376630783,-0.19105041027069092,-0.013963681645691395,-0.1591028869152069,0.012667028233408928,0.022007955238223076,0.034961238503456116,-0.13850528001785278,0.00490168109536171,-0.06890828907489777,-0.05463740974664688,0.100586898624897,0.003538570599630475,-0.12838362157344818,0.22022603452205658,-0.06155781447887421,0.10554791986942291,0.0007708099437877536,-0.08392072468996048,-0.10651042312383652,-0.02894442528486252,-0.03705032914876938,-0.024293607100844383,0.06654566526412964,-0.13245488703250885,0.0009284064290113747,0.08734171092510223,-0.20353072881698608,0.08804997056722641,-0.027907833456993103,0.021695058792829514,-0.012310290709137917,0.13453762233257294,-0.09757396578788757,-0.015168205834925175,0.1653372049331665,-0.3142487108707428,0.3011082112789154,0.18999642133712769,-0.002340974286198616,0.17549210786819458,0.09671139717102051,0.02099210023880005,-0.013924681581556797,-0.03026152029633522,-0.11665874719619751,-0.07022298127412796,0.055534087121486664,-0.08141488581895828,0.06633622199296951,0.07770853489637375]	f
4b624d5e-ee56-43af-bd6f-7d3f539a736e	Test Admin	admin@test.com	$2a$10$I8RDR6aBUglBzlHImE0t0.1go7vXI4cLk0a5vB92rqGk/cp.dbirO	admin	\N	2026-07-15 12:45:37.588+05:30	2026-07-25 18:52:03.454+05:30	\N	\N	\N	\N	0	\N	42cdc2ba-b326-47b6-ae91-1d9717a6e0e7	\N	f
121eac85-bfc0-4002-b176-4a198cfade89	manish	teacher@test.com	$2a$10$wSTgtAtQs4ndy9W6Vzdo..z/9L2c6oNqxLfetwqqAbh0IfcvkIMQe	teacher	\N	2026-07-15 12:50:29.111+05:30	2026-07-25 18:52:03.575+05:30	\N	\N	\N	\N	36	\N	42cdc2ba-b326-47b6-ae91-1d9717a6e0e7	\N	f
\.


--
-- Name: Confessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Confessions_id_seq"', 1, false);


--
-- Name: MarketplaceItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."MarketplaceItems_id_seq"', 1, false);


--
-- Name: MentorProfiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."MentorProfiles_id_seq"', 1, false);


--
-- Name: PlacementInsights_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PlacementInsights_id_seq"', 1, false);


--
-- Name: PredictionLogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PredictionLogs_id_seq"', 1, false);


--
-- Name: AlumniProfiles AlumniProfiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AlumniProfiles"
    ADD CONSTRAINT "AlumniProfiles_pkey" PRIMARY KEY (id);


--
-- Name: AlumniProfiles AlumniProfiles_userId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AlumniProfiles"
    ADD CONSTRAINT "AlumniProfiles_userId_key" UNIQUE ("userId");


--
-- Name: Announcements Announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcements"
    ADD CONSTRAINT "Announcements_pkey" PRIMARY KEY (id);


--
-- Name: AssignmentSubmissions AssignmentSubmissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssignmentSubmissions"
    ADD CONSTRAINT "AssignmentSubmissions_pkey" PRIMARY KEY (id);


--
-- Name: Assignments Assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assignments"
    ADD CONSTRAINT "Assignments_pkey" PRIMARY KEY (id);


--
-- Name: AttendanceRecords AttendanceRecords_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRecords"
    ADD CONSTRAINT "AttendanceRecords_pkey" PRIMARY KEY (id);


--
-- Name: Attendances Attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendances"
    ADD CONSTRAINT "Attendances_pkey" PRIMARY KEY (id);


--
-- Name: BookCheckouts BookCheckouts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BookCheckouts"
    ADD CONSTRAINT "BookCheckouts_pkey" PRIMARY KEY (id);


--
-- Name: BookReviews BookReviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BookReviews"
    ADD CONSTRAINT "BookReviews_pkey" PRIMARY KEY (id);


--
-- Name: Classes Classes_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key" UNIQUE (name);


--
-- Name: Classes Classes_name_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key1" UNIQUE (name);


--
-- Name: Classes Classes_name_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key10" UNIQUE (name);


--
-- Name: Classes Classes_name_key100; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key100" UNIQUE (name);


--
-- Name: Classes Classes_name_key101; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key101" UNIQUE (name);


--
-- Name: Classes Classes_name_key102; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key102" UNIQUE (name);


--
-- Name: Classes Classes_name_key103; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key103" UNIQUE (name);


--
-- Name: Classes Classes_name_key104; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key104" UNIQUE (name);


--
-- Name: Classes Classes_name_key105; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key105" UNIQUE (name);


--
-- Name: Classes Classes_name_key106; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key106" UNIQUE (name);


--
-- Name: Classes Classes_name_key107; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key107" UNIQUE (name);


--
-- Name: Classes Classes_name_key108; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key108" UNIQUE (name);


--
-- Name: Classes Classes_name_key109; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key109" UNIQUE (name);


--
-- Name: Classes Classes_name_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key11" UNIQUE (name);


--
-- Name: Classes Classes_name_key110; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key110" UNIQUE (name);


--
-- Name: Classes Classes_name_key111; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key111" UNIQUE (name);


--
-- Name: Classes Classes_name_key112; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key112" UNIQUE (name);


--
-- Name: Classes Classes_name_key113; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key113" UNIQUE (name);


--
-- Name: Classes Classes_name_key114; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key114" UNIQUE (name);


--
-- Name: Classes Classes_name_key115; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key115" UNIQUE (name);


--
-- Name: Classes Classes_name_key116; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key116" UNIQUE (name);


--
-- Name: Classes Classes_name_key117; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key117" UNIQUE (name);


--
-- Name: Classes Classes_name_key118; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key118" UNIQUE (name);


--
-- Name: Classes Classes_name_key119; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key119" UNIQUE (name);


--
-- Name: Classes Classes_name_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key12" UNIQUE (name);


--
-- Name: Classes Classes_name_key120; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key120" UNIQUE (name);


--
-- Name: Classes Classes_name_key121; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key121" UNIQUE (name);


--
-- Name: Classes Classes_name_key122; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key122" UNIQUE (name);


--
-- Name: Classes Classes_name_key123; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key123" UNIQUE (name);


--
-- Name: Classes Classes_name_key124; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key124" UNIQUE (name);


--
-- Name: Classes Classes_name_key125; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key125" UNIQUE (name);


--
-- Name: Classes Classes_name_key126; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key126" UNIQUE (name);


--
-- Name: Classes Classes_name_key127; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key127" UNIQUE (name);


--
-- Name: Classes Classes_name_key128; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key128" UNIQUE (name);


--
-- Name: Classes Classes_name_key129; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key129" UNIQUE (name);


--
-- Name: Classes Classes_name_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key13" UNIQUE (name);


--
-- Name: Classes Classes_name_key130; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key130" UNIQUE (name);


--
-- Name: Classes Classes_name_key131; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key131" UNIQUE (name);


--
-- Name: Classes Classes_name_key132; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key132" UNIQUE (name);


--
-- Name: Classes Classes_name_key133; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key133" UNIQUE (name);


--
-- Name: Classes Classes_name_key134; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key134" UNIQUE (name);


--
-- Name: Classes Classes_name_key135; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key135" UNIQUE (name);


--
-- Name: Classes Classes_name_key136; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key136" UNIQUE (name);


--
-- Name: Classes Classes_name_key137; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key137" UNIQUE (name);


--
-- Name: Classes Classes_name_key138; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key138" UNIQUE (name);


--
-- Name: Classes Classes_name_key139; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key139" UNIQUE (name);


--
-- Name: Classes Classes_name_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key14" UNIQUE (name);


--
-- Name: Classes Classes_name_key140; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key140" UNIQUE (name);


--
-- Name: Classes Classes_name_key141; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key141" UNIQUE (name);


--
-- Name: Classes Classes_name_key142; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key142" UNIQUE (name);


--
-- Name: Classes Classes_name_key143; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key143" UNIQUE (name);


--
-- Name: Classes Classes_name_key144; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key144" UNIQUE (name);


--
-- Name: Classes Classes_name_key145; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key145" UNIQUE (name);


--
-- Name: Classes Classes_name_key146; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key146" UNIQUE (name);


--
-- Name: Classes Classes_name_key147; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key147" UNIQUE (name);


--
-- Name: Classes Classes_name_key148; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key148" UNIQUE (name);


--
-- Name: Classes Classes_name_key149; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key149" UNIQUE (name);


--
-- Name: Classes Classes_name_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key15" UNIQUE (name);


--
-- Name: Classes Classes_name_key150; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key150" UNIQUE (name);


--
-- Name: Classes Classes_name_key151; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key151" UNIQUE (name);


--
-- Name: Classes Classes_name_key152; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key152" UNIQUE (name);


--
-- Name: Classes Classes_name_key153; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key153" UNIQUE (name);


--
-- Name: Classes Classes_name_key154; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key154" UNIQUE (name);


--
-- Name: Classes Classes_name_key155; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key155" UNIQUE (name);


--
-- Name: Classes Classes_name_key156; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key156" UNIQUE (name);


--
-- Name: Classes Classes_name_key157; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key157" UNIQUE (name);


--
-- Name: Classes Classes_name_key158; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key158" UNIQUE (name);


--
-- Name: Classes Classes_name_key159; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key159" UNIQUE (name);


--
-- Name: Classes Classes_name_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key16" UNIQUE (name);


--
-- Name: Classes Classes_name_key160; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key160" UNIQUE (name);


--
-- Name: Classes Classes_name_key161; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key161" UNIQUE (name);


--
-- Name: Classes Classes_name_key162; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key162" UNIQUE (name);


--
-- Name: Classes Classes_name_key163; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key163" UNIQUE (name);


--
-- Name: Classes Classes_name_key164; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key164" UNIQUE (name);


--
-- Name: Classes Classes_name_key165; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key165" UNIQUE (name);


--
-- Name: Classes Classes_name_key166; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key166" UNIQUE (name);


--
-- Name: Classes Classes_name_key167; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key167" UNIQUE (name);


--
-- Name: Classes Classes_name_key168; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key168" UNIQUE (name);


--
-- Name: Classes Classes_name_key169; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key169" UNIQUE (name);


--
-- Name: Classes Classes_name_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key17" UNIQUE (name);


--
-- Name: Classes Classes_name_key170; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key170" UNIQUE (name);


--
-- Name: Classes Classes_name_key171; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key171" UNIQUE (name);


--
-- Name: Classes Classes_name_key172; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key172" UNIQUE (name);


--
-- Name: Classes Classes_name_key173; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key173" UNIQUE (name);


--
-- Name: Classes Classes_name_key174; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key174" UNIQUE (name);


--
-- Name: Classes Classes_name_key175; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key175" UNIQUE (name);


--
-- Name: Classes Classes_name_key176; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key176" UNIQUE (name);


--
-- Name: Classes Classes_name_key177; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key177" UNIQUE (name);


--
-- Name: Classes Classes_name_key178; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key178" UNIQUE (name);


--
-- Name: Classes Classes_name_key179; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key179" UNIQUE (name);


--
-- Name: Classes Classes_name_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key18" UNIQUE (name);


--
-- Name: Classes Classes_name_key180; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key180" UNIQUE (name);


--
-- Name: Classes Classes_name_key181; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key181" UNIQUE (name);


--
-- Name: Classes Classes_name_key182; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key182" UNIQUE (name);


--
-- Name: Classes Classes_name_key183; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key183" UNIQUE (name);


--
-- Name: Classes Classes_name_key184; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key184" UNIQUE (name);


--
-- Name: Classes Classes_name_key185; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key185" UNIQUE (name);


--
-- Name: Classes Classes_name_key186; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key186" UNIQUE (name);


--
-- Name: Classes Classes_name_key187; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key187" UNIQUE (name);


--
-- Name: Classes Classes_name_key188; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key188" UNIQUE (name);


--
-- Name: Classes Classes_name_key189; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key189" UNIQUE (name);


--
-- Name: Classes Classes_name_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key19" UNIQUE (name);


--
-- Name: Classes Classes_name_key190; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key190" UNIQUE (name);


--
-- Name: Classes Classes_name_key191; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key191" UNIQUE (name);


--
-- Name: Classes Classes_name_key192; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key192" UNIQUE (name);


--
-- Name: Classes Classes_name_key193; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key193" UNIQUE (name);


--
-- Name: Classes Classes_name_key194; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key194" UNIQUE (name);


--
-- Name: Classes Classes_name_key195; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key195" UNIQUE (name);


--
-- Name: Classes Classes_name_key196; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key196" UNIQUE (name);


--
-- Name: Classes Classes_name_key197; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key197" UNIQUE (name);


--
-- Name: Classes Classes_name_key198; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key198" UNIQUE (name);


--
-- Name: Classes Classes_name_key199; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key199" UNIQUE (name);


--
-- Name: Classes Classes_name_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key2" UNIQUE (name);


--
-- Name: Classes Classes_name_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key20" UNIQUE (name);


--
-- Name: Classes Classes_name_key200; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key200" UNIQUE (name);


--
-- Name: Classes Classes_name_key201; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key201" UNIQUE (name);


--
-- Name: Classes Classes_name_key202; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key202" UNIQUE (name);


--
-- Name: Classes Classes_name_key203; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key203" UNIQUE (name);


--
-- Name: Classes Classes_name_key204; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key204" UNIQUE (name);


--
-- Name: Classes Classes_name_key205; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key205" UNIQUE (name);


--
-- Name: Classes Classes_name_key206; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key206" UNIQUE (name);


--
-- Name: Classes Classes_name_key207; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key207" UNIQUE (name);


--
-- Name: Classes Classes_name_key208; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key208" UNIQUE (name);


--
-- Name: Classes Classes_name_key209; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key209" UNIQUE (name);


--
-- Name: Classes Classes_name_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key21" UNIQUE (name);


--
-- Name: Classes Classes_name_key210; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key210" UNIQUE (name);


--
-- Name: Classes Classes_name_key211; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key211" UNIQUE (name);


--
-- Name: Classes Classes_name_key212; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key212" UNIQUE (name);


--
-- Name: Classes Classes_name_key213; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key213" UNIQUE (name);


--
-- Name: Classes Classes_name_key214; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key214" UNIQUE (name);


--
-- Name: Classes Classes_name_key215; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key215" UNIQUE (name);


--
-- Name: Classes Classes_name_key216; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key216" UNIQUE (name);


--
-- Name: Classes Classes_name_key217; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key217" UNIQUE (name);


--
-- Name: Classes Classes_name_key218; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key218" UNIQUE (name);


--
-- Name: Classes Classes_name_key219; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key219" UNIQUE (name);


--
-- Name: Classes Classes_name_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key22" UNIQUE (name);


--
-- Name: Classes Classes_name_key220; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key220" UNIQUE (name);


--
-- Name: Classes Classes_name_key221; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key221" UNIQUE (name);


--
-- Name: Classes Classes_name_key222; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key222" UNIQUE (name);


--
-- Name: Classes Classes_name_key223; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key223" UNIQUE (name);


--
-- Name: Classes Classes_name_key224; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key224" UNIQUE (name);


--
-- Name: Classes Classes_name_key225; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key225" UNIQUE (name);


--
-- Name: Classes Classes_name_key226; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key226" UNIQUE (name);


--
-- Name: Classes Classes_name_key227; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key227" UNIQUE (name);


--
-- Name: Classes Classes_name_key228; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key228" UNIQUE (name);


--
-- Name: Classes Classes_name_key229; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key229" UNIQUE (name);


--
-- Name: Classes Classes_name_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key23" UNIQUE (name);


--
-- Name: Classes Classes_name_key230; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key230" UNIQUE (name);


--
-- Name: Classes Classes_name_key231; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key231" UNIQUE (name);


--
-- Name: Classes Classes_name_key232; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key232" UNIQUE (name);


--
-- Name: Classes Classes_name_key233; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key233" UNIQUE (name);


--
-- Name: Classes Classes_name_key234; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key234" UNIQUE (name);


--
-- Name: Classes Classes_name_key235; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key235" UNIQUE (name);


--
-- Name: Classes Classes_name_key236; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key236" UNIQUE (name);


--
-- Name: Classes Classes_name_key237; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key237" UNIQUE (name);


--
-- Name: Classes Classes_name_key238; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key238" UNIQUE (name);


--
-- Name: Classes Classes_name_key239; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key239" UNIQUE (name);


--
-- Name: Classes Classes_name_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key24" UNIQUE (name);


--
-- Name: Classes Classes_name_key240; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key240" UNIQUE (name);


--
-- Name: Classes Classes_name_key241; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key241" UNIQUE (name);


--
-- Name: Classes Classes_name_key242; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key242" UNIQUE (name);


--
-- Name: Classes Classes_name_key243; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key243" UNIQUE (name);


--
-- Name: Classes Classes_name_key244; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key244" UNIQUE (name);


--
-- Name: Classes Classes_name_key245; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key245" UNIQUE (name);


--
-- Name: Classes Classes_name_key246; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key246" UNIQUE (name);


--
-- Name: Classes Classes_name_key247; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key247" UNIQUE (name);


--
-- Name: Classes Classes_name_key248; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key248" UNIQUE (name);


--
-- Name: Classes Classes_name_key249; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key249" UNIQUE (name);


--
-- Name: Classes Classes_name_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key25" UNIQUE (name);


--
-- Name: Classes Classes_name_key250; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key250" UNIQUE (name);


--
-- Name: Classes Classes_name_key251; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key251" UNIQUE (name);


--
-- Name: Classes Classes_name_key252; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key252" UNIQUE (name);


--
-- Name: Classes Classes_name_key253; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key253" UNIQUE (name);


--
-- Name: Classes Classes_name_key254; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key254" UNIQUE (name);


--
-- Name: Classes Classes_name_key255; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key255" UNIQUE (name);


--
-- Name: Classes Classes_name_key256; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key256" UNIQUE (name);


--
-- Name: Classes Classes_name_key257; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key257" UNIQUE (name);


--
-- Name: Classes Classes_name_key258; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key258" UNIQUE (name);


--
-- Name: Classes Classes_name_key259; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key259" UNIQUE (name);


--
-- Name: Classes Classes_name_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key26" UNIQUE (name);


--
-- Name: Classes Classes_name_key260; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key260" UNIQUE (name);


--
-- Name: Classes Classes_name_key261; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key261" UNIQUE (name);


--
-- Name: Classes Classes_name_key262; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key262" UNIQUE (name);


--
-- Name: Classes Classes_name_key263; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key263" UNIQUE (name);


--
-- Name: Classes Classes_name_key264; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key264" UNIQUE (name);


--
-- Name: Classes Classes_name_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key27" UNIQUE (name);


--
-- Name: Classes Classes_name_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key28" UNIQUE (name);


--
-- Name: Classes Classes_name_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key29" UNIQUE (name);


--
-- Name: Classes Classes_name_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key3" UNIQUE (name);


--
-- Name: Classes Classes_name_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key30" UNIQUE (name);


--
-- Name: Classes Classes_name_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key31" UNIQUE (name);


--
-- Name: Classes Classes_name_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key32" UNIQUE (name);


--
-- Name: Classes Classes_name_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key33" UNIQUE (name);


--
-- Name: Classes Classes_name_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key34" UNIQUE (name);


--
-- Name: Classes Classes_name_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key35" UNIQUE (name);


--
-- Name: Classes Classes_name_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key36" UNIQUE (name);


--
-- Name: Classes Classes_name_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key37" UNIQUE (name);


--
-- Name: Classes Classes_name_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key38" UNIQUE (name);


--
-- Name: Classes Classes_name_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key39" UNIQUE (name);


--
-- Name: Classes Classes_name_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key4" UNIQUE (name);


--
-- Name: Classes Classes_name_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key40" UNIQUE (name);


--
-- Name: Classes Classes_name_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key41" UNIQUE (name);


--
-- Name: Classes Classes_name_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key42" UNIQUE (name);


--
-- Name: Classes Classes_name_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key43" UNIQUE (name);


--
-- Name: Classes Classes_name_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key44" UNIQUE (name);


--
-- Name: Classes Classes_name_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key45" UNIQUE (name);


--
-- Name: Classes Classes_name_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key46" UNIQUE (name);


--
-- Name: Classes Classes_name_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key47" UNIQUE (name);


--
-- Name: Classes Classes_name_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key48" UNIQUE (name);


--
-- Name: Classes Classes_name_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key49" UNIQUE (name);


--
-- Name: Classes Classes_name_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key5" UNIQUE (name);


--
-- Name: Classes Classes_name_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key50" UNIQUE (name);


--
-- Name: Classes Classes_name_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key51" UNIQUE (name);


--
-- Name: Classes Classes_name_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key52" UNIQUE (name);


--
-- Name: Classes Classes_name_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key53" UNIQUE (name);


--
-- Name: Classes Classes_name_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key54" UNIQUE (name);


--
-- Name: Classes Classes_name_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key55" UNIQUE (name);


--
-- Name: Classes Classes_name_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key56" UNIQUE (name);


--
-- Name: Classes Classes_name_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key57" UNIQUE (name);


--
-- Name: Classes Classes_name_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key58" UNIQUE (name);


--
-- Name: Classes Classes_name_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key59" UNIQUE (name);


--
-- Name: Classes Classes_name_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key6" UNIQUE (name);


--
-- Name: Classes Classes_name_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key60" UNIQUE (name);


--
-- Name: Classes Classes_name_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key61" UNIQUE (name);


--
-- Name: Classes Classes_name_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key62" UNIQUE (name);


--
-- Name: Classes Classes_name_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key63" UNIQUE (name);


--
-- Name: Classes Classes_name_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key64" UNIQUE (name);


--
-- Name: Classes Classes_name_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key65" UNIQUE (name);


--
-- Name: Classes Classes_name_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key66" UNIQUE (name);


--
-- Name: Classes Classes_name_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key67" UNIQUE (name);


--
-- Name: Classes Classes_name_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key68" UNIQUE (name);


--
-- Name: Classes Classes_name_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key69" UNIQUE (name);


--
-- Name: Classes Classes_name_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key7" UNIQUE (name);


--
-- Name: Classes Classes_name_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key70" UNIQUE (name);


--
-- Name: Classes Classes_name_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key71" UNIQUE (name);


--
-- Name: Classes Classes_name_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key72" UNIQUE (name);


--
-- Name: Classes Classes_name_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key73" UNIQUE (name);


--
-- Name: Classes Classes_name_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key74" UNIQUE (name);


--
-- Name: Classes Classes_name_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key75" UNIQUE (name);


--
-- Name: Classes Classes_name_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key76" UNIQUE (name);


--
-- Name: Classes Classes_name_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key77" UNIQUE (name);


--
-- Name: Classes Classes_name_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key78" UNIQUE (name);


--
-- Name: Classes Classes_name_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key79" UNIQUE (name);


--
-- Name: Classes Classes_name_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key8" UNIQUE (name);


--
-- Name: Classes Classes_name_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key80" UNIQUE (name);


--
-- Name: Classes Classes_name_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key81" UNIQUE (name);


--
-- Name: Classes Classes_name_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key82" UNIQUE (name);


--
-- Name: Classes Classes_name_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key83" UNIQUE (name);


--
-- Name: Classes Classes_name_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key84" UNIQUE (name);


--
-- Name: Classes Classes_name_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key85" UNIQUE (name);


--
-- Name: Classes Classes_name_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key86" UNIQUE (name);


--
-- Name: Classes Classes_name_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key87" UNIQUE (name);


--
-- Name: Classes Classes_name_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key88" UNIQUE (name);


--
-- Name: Classes Classes_name_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key89" UNIQUE (name);


--
-- Name: Classes Classes_name_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key9" UNIQUE (name);


--
-- Name: Classes Classes_name_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key90" UNIQUE (name);


--
-- Name: Classes Classes_name_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key91" UNIQUE (name);


--
-- Name: Classes Classes_name_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key92" UNIQUE (name);


--
-- Name: Classes Classes_name_key93; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key93" UNIQUE (name);


--
-- Name: Classes Classes_name_key94; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key94" UNIQUE (name);


--
-- Name: Classes Classes_name_key95; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key95" UNIQUE (name);


--
-- Name: Classes Classes_name_key96; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key96" UNIQUE (name);


--
-- Name: Classes Classes_name_key97; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key97" UNIQUE (name);


--
-- Name: Classes Classes_name_key98; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key98" UNIQUE (name);


--
-- Name: Classes Classes_name_key99; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_name_key99" UNIQUE (name);


--
-- Name: Classes Classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_pkey" PRIMARY KEY (id);


--
-- Name: Colleges Colleges_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key1" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key10" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key100; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key100" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key101; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key101" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key102; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key102" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key103; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key103" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key104; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key104" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key105; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key105" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key106; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key106" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key107; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key107" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key108; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key108" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key109; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key109" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key11" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key110; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key110" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key111; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key111" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key112; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key112" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key113; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key113" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key114; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key114" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key115; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key115" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key116; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key116" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key117; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key117" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key118; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key118" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key119; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key119" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key12" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key120; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key120" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key121; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key121" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key122; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key122" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key123; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key123" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key124; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key124" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key125; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key125" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key126; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key126" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key127; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key127" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key128; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key128" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key129; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key129" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key13" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key130; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key130" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key131; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key131" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key132; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key132" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key133; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key133" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key134; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key134" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key135; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key135" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key136; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key136" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key137; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key137" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key138; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key138" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key139; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key139" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key14" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key140; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key140" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key141; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key141" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key142; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key142" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key143; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key143" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key144; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key144" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key145; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key145" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key146; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key146" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key147; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key147" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key148; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key148" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key15" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key16" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key17" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key18" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key19" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key2" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key20" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key21" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key22" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key23" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key24" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key25" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key26" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key27" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key28" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key29" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key3" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key30" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key31" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key32" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key33" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key34" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key35" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key36" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key37" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key38" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key39" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key4" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key40" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key41" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key42" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key43" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key44" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key45" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key46" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key47" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key48" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key49" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key5" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key50" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key51" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key52" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key53" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key54" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key55" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key56" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key57" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key58" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key59" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key6" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key60" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key61" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key62" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key63" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key64" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key65" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key66" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key67" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key68" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key69" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key7" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key70" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key71" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key72" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key73" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key74" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key75" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key76" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key77" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key78" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key79" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key8" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key80" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key81" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key82" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key83" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key84" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key85" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key86" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key87" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key88" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key89" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key9" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key90" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key91" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key92" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key93; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key93" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key94; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key94" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key95; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key95" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key96; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key96" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key97; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key97" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key98; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key98" UNIQUE (name);


--
-- Name: Colleges Colleges_name_key99; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_name_key99" UNIQUE (name);


--
-- Name: Colleges Colleges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Colleges"
    ADD CONSTRAINT "Colleges_pkey" PRIMARY KEY (id);


--
-- Name: CompanyListings CompanyListings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CompanyListings"
    ADD CONSTRAINT "CompanyListings_pkey" PRIMARY KEY (id);


--
-- Name: Confessions Confessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Confessions"
    ADD CONSTRAINT "Confessions_pkey" PRIMARY KEY (id);


--
-- Name: ForumPosts ForumPosts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ForumPosts"
    ADD CONSTRAINT "ForumPosts_pkey" PRIMARY KEY (id);


--
-- Name: ForumReplies ForumReplies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ForumReplies"
    ADD CONSTRAINT "ForumReplies_pkey" PRIMARY KEY (id);


--
-- Name: Holidays Holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Holidays"
    ADD CONSTRAINT "Holidays_pkey" PRIMARY KEY (id);


--
-- Name: InterviewExperiences InterviewExperiences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InterviewExperiences"
    ADD CONSTRAINT "InterviewExperiences_pkey" PRIMARY KEY (id);


--
-- Name: JobApplications JobApplications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JobApplications"
    ADD CONSTRAINT "JobApplications_pkey" PRIMARY KEY (id);


--
-- Name: JobPosts JobPosts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JobPosts"
    ADD CONSTRAINT "JobPosts_pkey" PRIMARY KEY (id);


--
-- Name: LeaveRequests LeaveRequests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeaveRequests"
    ADD CONSTRAINT "LeaveRequests_pkey" PRIMARY KEY (id);


--
-- Name: LibraryBooks LibraryBooks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LibraryBooks"
    ADD CONSTRAINT "LibraryBooks_pkey" PRIMARY KEY (id);


--
-- Name: MarketplaceItems MarketplaceItems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MarketplaceItems"
    ADD CONSTRAINT "MarketplaceItems_pkey" PRIMARY KEY (id);


--
-- Name: Marks Marks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marks"
    ADD CONSTRAINT "Marks_pkey" PRIMARY KEY (id);


--
-- Name: MaterialPurchases MaterialPurchases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MaterialPurchases"
    ADD CONSTRAINT "MaterialPurchases_pkey" PRIMARY KEY (id);


--
-- Name: Materials Materials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Materials"
    ADD CONSTRAINT "Materials_pkey" PRIMARY KEY (id);


--
-- Name: MentorProfiles MentorProfiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MentorProfiles"
    ADD CONSTRAINT "MentorProfiles_pkey" PRIMARY KEY (id);


--
-- Name: MentorshipSlots MentorshipSlots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MentorshipSlots"
    ADD CONSTRAINT "MentorshipSlots_pkey" PRIMARY KEY (id);


--
-- Name: Messages Messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_pkey" PRIMARY KEY (id);


--
-- Name: Notifications Notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY (id);


--
-- Name: Opportunities Opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Opportunities"
    ADD CONSTRAINT "Opportunities_pkey" PRIMARY KEY (id);


--
-- Name: PlacementApplications PlacementApplications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlacementApplications"
    ADD CONSTRAINT "PlacementApplications_pkey" PRIMARY KEY (id);


--
-- Name: PlacementInsights PlacementInsights_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlacementInsights"
    ADD CONSTRAINT "PlacementInsights_pkey" PRIMARY KEY (id);


--
-- Name: PredictionLogs PredictionLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PredictionLogs"
    ADD CONSTRAINT "PredictionLogs_pkey" PRIMARY KEY (id);


--
-- Name: PrepHistories PrepHistories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PrepHistories"
    ADD CONSTRAINT "PrepHistories_pkey" PRIMARY KEY (id);


--
-- Name: ProjectInvites ProjectInvites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProjectInvites"
    ADD CONSTRAINT "ProjectInvites_pkey" PRIMARY KEY (id);


--
-- Name: ProjectPostings ProjectPostings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProjectPostings"
    ADD CONSTRAINT "ProjectPostings_pkey" PRIMARY KEY (id);


--
-- Name: QuizAttempts QuizAttempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuizAttempts"
    ADD CONSTRAINT "QuizAttempts_pkey" PRIMARY KEY (id);


--
-- Name: QuizQuestions QuizQuestions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuizQuestions"
    ADD CONSTRAINT "QuizQuestions_pkey" PRIMARY KEY (id);


--
-- Name: Quizzes Quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quizzes"
    ADD CONSTRAINT "Quizzes_pkey" PRIMARY KEY (id);


--
-- Name: RecoveryAssignments RecoveryAssignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecoveryAssignments"
    ADD CONSTRAINT "RecoveryAssignments_pkey" PRIMARY KEY (id);


--
-- Name: SelfAttendances SelfAttendances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SelfAttendances"
    ADD CONSTRAINT "SelfAttendances_pkey" PRIMARY KEY (id);


--
-- Name: StudyGroupParticipants StudyGroupParticipants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyGroupParticipants"
    ADD CONSTRAINT "StudyGroupParticipants_pkey" PRIMARY KEY (id);


--
-- Name: StudyGroups StudyGroups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyGroups"
    ADD CONSTRAINT "StudyGroups_pkey" PRIMARY KEY (id);


--
-- Name: StudyGuides StudyGuides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyGuides"
    ADD CONSTRAINT "StudyGuides_pkey" PRIMARY KEY (id);


--
-- Name: StudyRequests StudyRequests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyRequests"
    ADD CONSTRAINT "StudyRequests_pkey" PRIMARY KEY (id);


--
-- Name: Subjects Subjects_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key1" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key10" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key100; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key100" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key101; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key101" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key102; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key102" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key103; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key103" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key104; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key104" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key105; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key105" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key106; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key106" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key107; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key107" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key108; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key108" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key109; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key109" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key11" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key110; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key110" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key111; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key111" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key112; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key112" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key113; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key113" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key114; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key114" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key115; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key115" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key116; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key116" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key117; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key117" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key118; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key118" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key119; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key119" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key12" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key120; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key120" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key121; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key121" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key122; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key122" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key123; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key123" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key124; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key124" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key125; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key125" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key126; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key126" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key127; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key127" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key128; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key128" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key129; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key129" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key13" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key130; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key130" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key131; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key131" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key132; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key132" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key133; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key133" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key134; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key134" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key135; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key135" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key136; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key136" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key137; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key137" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key138; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key138" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key139; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key139" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key14" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key140; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key140" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key141; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key141" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key142; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key142" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key143; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key143" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key144; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key144" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key145; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key145" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key146; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key146" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key147; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key147" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key148; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key148" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key149; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key149" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key15" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key150; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key150" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key151; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key151" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key152; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key152" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key153; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key153" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key154; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key154" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key155; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key155" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key156; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key156" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key157; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key157" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key158; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key158" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key159; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key159" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key16" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key160; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key160" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key161; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key161" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key162; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key162" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key163; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key163" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key164; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key164" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key165; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key165" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key166; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key166" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key167; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key167" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key168; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key168" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key169; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key169" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key17" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key170; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key170" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key171; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key171" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key172; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key172" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key173; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key173" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key174; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key174" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key175; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key175" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key176; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key176" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key177; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key177" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key178; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key178" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key179; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key179" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key18" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key180; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key180" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key181; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key181" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key182; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key182" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key183; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key183" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key184; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key184" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key185; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key185" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key186; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key186" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key187; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key187" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key188; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key188" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key189; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key189" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key19" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key190; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key190" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key191; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key191" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key192; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key192" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key193; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key193" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key194; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key194" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key195; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key195" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key196; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key196" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key197; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key197" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key198; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key198" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key199; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key199" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key2" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key20" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key200; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key200" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key201; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key201" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key202; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key202" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key203; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key203" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key204; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key204" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key205; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key205" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key206; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key206" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key207; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key207" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key208; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key208" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key209; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key209" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key21" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key210; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key210" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key211; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key211" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key212; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key212" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key213; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key213" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key214; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key214" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key215; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key215" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key216; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key216" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key217; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key217" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key218; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key218" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key219; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key219" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key22" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key220; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key220" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key221; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key221" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key222; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key222" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key223; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key223" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key224; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key224" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key225; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key225" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key23" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key24" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key25" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key26" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key27" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key28" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key29" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key3" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key30" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key31" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key32" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key33" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key34" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key35" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key36" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key37" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key38" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key39" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key4" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key40" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key41" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key42" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key43" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key44" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key45" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key46" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key47" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key48" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key49" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key5" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key50" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key51" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key52" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key53" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key54" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key55" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key56" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key57" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key58" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key59" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key6" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key60" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key61" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key62" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key63" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key64" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key65" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key66" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key67" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key68" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key69" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key7" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key70" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key71" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key72" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key73" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key74" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key75" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key76" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key77" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key78" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key79" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key8" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key80" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key81" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key82" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key83" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key84" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key85" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key86" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key87" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key88" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key89" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key9" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key90" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key91" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key92" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key93; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key93" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key94; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key94" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key95; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key95" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key96; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key96" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key97; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key97" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key98; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key98" UNIQUE (code);


--
-- Name: Subjects Subjects_code_key99; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_code_key99" UNIQUE (code);


--
-- Name: Subjects Subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_pkey" PRIMARY KEY (id);


--
-- Name: Tasks Tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tasks"
    ADD CONSTRAINT "Tasks_pkey" PRIMARY KEY (id);


--
-- Name: TeamRequests TeamRequests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TeamRequests"
    ADD CONSTRAINT "TeamRequests_pkey" PRIMARY KEY (id);


--
-- Name: Timetables Timetables_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Timetables"
    ADD CONSTRAINT "Timetables_pkey" PRIMARY KEY (id);


--
-- Name: Transactions Transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_email_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key1" UNIQUE (email);


--
-- Name: Users Users_email_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key10" UNIQUE (email);


--
-- Name: Users Users_email_key100; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key100" UNIQUE (email);


--
-- Name: Users Users_email_key101; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key101" UNIQUE (email);


--
-- Name: Users Users_email_key102; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key102" UNIQUE (email);


--
-- Name: Users Users_email_key103; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key103" UNIQUE (email);


--
-- Name: Users Users_email_key104; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key104" UNIQUE (email);


--
-- Name: Users Users_email_key105; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key105" UNIQUE (email);


--
-- Name: Users Users_email_key106; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key106" UNIQUE (email);


--
-- Name: Users Users_email_key107; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key107" UNIQUE (email);


--
-- Name: Users Users_email_key108; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key108" UNIQUE (email);


--
-- Name: Users Users_email_key109; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key109" UNIQUE (email);


--
-- Name: Users Users_email_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key11" UNIQUE (email);


--
-- Name: Users Users_email_key110; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key110" UNIQUE (email);


--
-- Name: Users Users_email_key111; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key111" UNIQUE (email);


--
-- Name: Users Users_email_key112; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key112" UNIQUE (email);


--
-- Name: Users Users_email_key113; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key113" UNIQUE (email);


--
-- Name: Users Users_email_key114; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key114" UNIQUE (email);


--
-- Name: Users Users_email_key115; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key115" UNIQUE (email);


--
-- Name: Users Users_email_key116; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key116" UNIQUE (email);


--
-- Name: Users Users_email_key117; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key117" UNIQUE (email);


--
-- Name: Users Users_email_key118; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key118" UNIQUE (email);


--
-- Name: Users Users_email_key119; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key119" UNIQUE (email);


--
-- Name: Users Users_email_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key12" UNIQUE (email);


--
-- Name: Users Users_email_key120; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key120" UNIQUE (email);


--
-- Name: Users Users_email_key121; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key121" UNIQUE (email);


--
-- Name: Users Users_email_key122; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key122" UNIQUE (email);


--
-- Name: Users Users_email_key123; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key123" UNIQUE (email);


--
-- Name: Users Users_email_key124; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key124" UNIQUE (email);


--
-- Name: Users Users_email_key125; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key125" UNIQUE (email);


--
-- Name: Users Users_email_key126; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key126" UNIQUE (email);


--
-- Name: Users Users_email_key127; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key127" UNIQUE (email);


--
-- Name: Users Users_email_key128; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key128" UNIQUE (email);


--
-- Name: Users Users_email_key129; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key129" UNIQUE (email);


--
-- Name: Users Users_email_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key13" UNIQUE (email);


--
-- Name: Users Users_email_key130; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key130" UNIQUE (email);


--
-- Name: Users Users_email_key131; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key131" UNIQUE (email);


--
-- Name: Users Users_email_key132; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key132" UNIQUE (email);


--
-- Name: Users Users_email_key133; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key133" UNIQUE (email);


--
-- Name: Users Users_email_key134; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key134" UNIQUE (email);


--
-- Name: Users Users_email_key135; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key135" UNIQUE (email);


--
-- Name: Users Users_email_key136; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key136" UNIQUE (email);


--
-- Name: Users Users_email_key137; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key137" UNIQUE (email);


--
-- Name: Users Users_email_key138; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key138" UNIQUE (email);


--
-- Name: Users Users_email_key139; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key139" UNIQUE (email);


--
-- Name: Users Users_email_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key14" UNIQUE (email);


--
-- Name: Users Users_email_key140; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key140" UNIQUE (email);


--
-- Name: Users Users_email_key141; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key141" UNIQUE (email);


--
-- Name: Users Users_email_key142; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key142" UNIQUE (email);


--
-- Name: Users Users_email_key143; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key143" UNIQUE (email);


--
-- Name: Users Users_email_key144; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key144" UNIQUE (email);


--
-- Name: Users Users_email_key145; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key145" UNIQUE (email);


--
-- Name: Users Users_email_key146; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key146" UNIQUE (email);


--
-- Name: Users Users_email_key147; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key147" UNIQUE (email);


--
-- Name: Users Users_email_key148; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key148" UNIQUE (email);


--
-- Name: Users Users_email_key149; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key149" UNIQUE (email);


--
-- Name: Users Users_email_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key15" UNIQUE (email);


--
-- Name: Users Users_email_key150; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key150" UNIQUE (email);


--
-- Name: Users Users_email_key151; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key151" UNIQUE (email);


--
-- Name: Users Users_email_key152; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key152" UNIQUE (email);


--
-- Name: Users Users_email_key153; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key153" UNIQUE (email);


--
-- Name: Users Users_email_key154; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key154" UNIQUE (email);


--
-- Name: Users Users_email_key155; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key155" UNIQUE (email);


--
-- Name: Users Users_email_key156; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key156" UNIQUE (email);


--
-- Name: Users Users_email_key157; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key157" UNIQUE (email);


--
-- Name: Users Users_email_key158; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key158" UNIQUE (email);


--
-- Name: Users Users_email_key159; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key159" UNIQUE (email);


--
-- Name: Users Users_email_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key16" UNIQUE (email);


--
-- Name: Users Users_email_key160; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key160" UNIQUE (email);


--
-- Name: Users Users_email_key161; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key161" UNIQUE (email);


--
-- Name: Users Users_email_key162; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key162" UNIQUE (email);


--
-- Name: Users Users_email_key163; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key163" UNIQUE (email);


--
-- Name: Users Users_email_key164; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key164" UNIQUE (email);


--
-- Name: Users Users_email_key165; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key165" UNIQUE (email);


--
-- Name: Users Users_email_key166; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key166" UNIQUE (email);


--
-- Name: Users Users_email_key167; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key167" UNIQUE (email);


--
-- Name: Users Users_email_key168; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key168" UNIQUE (email);


--
-- Name: Users Users_email_key169; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key169" UNIQUE (email);


--
-- Name: Users Users_email_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key17" UNIQUE (email);


--
-- Name: Users Users_email_key170; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key170" UNIQUE (email);


--
-- Name: Users Users_email_key171; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key171" UNIQUE (email);


--
-- Name: Users Users_email_key172; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key172" UNIQUE (email);


--
-- Name: Users Users_email_key173; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key173" UNIQUE (email);


--
-- Name: Users Users_email_key174; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key174" UNIQUE (email);


--
-- Name: Users Users_email_key175; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key175" UNIQUE (email);


--
-- Name: Users Users_email_key176; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key176" UNIQUE (email);


--
-- Name: Users Users_email_key177; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key177" UNIQUE (email);


--
-- Name: Users Users_email_key178; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key178" UNIQUE (email);


--
-- Name: Users Users_email_key179; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key179" UNIQUE (email);


--
-- Name: Users Users_email_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key18" UNIQUE (email);


--
-- Name: Users Users_email_key180; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key180" UNIQUE (email);


--
-- Name: Users Users_email_key181; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key181" UNIQUE (email);


--
-- Name: Users Users_email_key182; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key182" UNIQUE (email);


--
-- Name: Users Users_email_key183; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key183" UNIQUE (email);


--
-- Name: Users Users_email_key184; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key184" UNIQUE (email);


--
-- Name: Users Users_email_key185; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key185" UNIQUE (email);


--
-- Name: Users Users_email_key186; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key186" UNIQUE (email);


--
-- Name: Users Users_email_key187; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key187" UNIQUE (email);


--
-- Name: Users Users_email_key188; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key188" UNIQUE (email);


--
-- Name: Users Users_email_key189; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key189" UNIQUE (email);


--
-- Name: Users Users_email_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key19" UNIQUE (email);


--
-- Name: Users Users_email_key190; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key190" UNIQUE (email);


--
-- Name: Users Users_email_key191; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key191" UNIQUE (email);


--
-- Name: Users Users_email_key192; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key192" UNIQUE (email);


--
-- Name: Users Users_email_key193; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key193" UNIQUE (email);


--
-- Name: Users Users_email_key194; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key194" UNIQUE (email);


--
-- Name: Users Users_email_key195; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key195" UNIQUE (email);


--
-- Name: Users Users_email_key196; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key196" UNIQUE (email);


--
-- Name: Users Users_email_key197; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key197" UNIQUE (email);


--
-- Name: Users Users_email_key198; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key198" UNIQUE (email);


--
-- Name: Users Users_email_key199; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key199" UNIQUE (email);


--
-- Name: Users Users_email_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key2" UNIQUE (email);


--
-- Name: Users Users_email_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key20" UNIQUE (email);


--
-- Name: Users Users_email_key200; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key200" UNIQUE (email);


--
-- Name: Users Users_email_key201; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key201" UNIQUE (email);


--
-- Name: Users Users_email_key202; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key202" UNIQUE (email);


--
-- Name: Users Users_email_key203; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key203" UNIQUE (email);


--
-- Name: Users Users_email_key204; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key204" UNIQUE (email);


--
-- Name: Users Users_email_key205; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key205" UNIQUE (email);


--
-- Name: Users Users_email_key206; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key206" UNIQUE (email);


--
-- Name: Users Users_email_key207; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key207" UNIQUE (email);


--
-- Name: Users Users_email_key208; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key208" UNIQUE (email);


--
-- Name: Users Users_email_key209; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key209" UNIQUE (email);


--
-- Name: Users Users_email_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key21" UNIQUE (email);


--
-- Name: Users Users_email_key210; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key210" UNIQUE (email);


--
-- Name: Users Users_email_key211; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key211" UNIQUE (email);


--
-- Name: Users Users_email_key212; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key212" UNIQUE (email);


--
-- Name: Users Users_email_key213; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key213" UNIQUE (email);


--
-- Name: Users Users_email_key214; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key214" UNIQUE (email);


--
-- Name: Users Users_email_key215; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key215" UNIQUE (email);


--
-- Name: Users Users_email_key216; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key216" UNIQUE (email);


--
-- Name: Users Users_email_key217; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key217" UNIQUE (email);


--
-- Name: Users Users_email_key218; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key218" UNIQUE (email);


--
-- Name: Users Users_email_key219; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key219" UNIQUE (email);


--
-- Name: Users Users_email_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key22" UNIQUE (email);


--
-- Name: Users Users_email_key220; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key220" UNIQUE (email);


--
-- Name: Users Users_email_key221; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key221" UNIQUE (email);


--
-- Name: Users Users_email_key222; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key222" UNIQUE (email);


--
-- Name: Users Users_email_key223; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key223" UNIQUE (email);


--
-- Name: Users Users_email_key224; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key224" UNIQUE (email);


--
-- Name: Users Users_email_key225; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key225" UNIQUE (email);


--
-- Name: Users Users_email_key226; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key226" UNIQUE (email);


--
-- Name: Users Users_email_key227; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key227" UNIQUE (email);


--
-- Name: Users Users_email_key228; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key228" UNIQUE (email);


--
-- Name: Users Users_email_key229; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key229" UNIQUE (email);


--
-- Name: Users Users_email_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key23" UNIQUE (email);


--
-- Name: Users Users_email_key230; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key230" UNIQUE (email);


--
-- Name: Users Users_email_key231; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key231" UNIQUE (email);


--
-- Name: Users Users_email_key232; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key232" UNIQUE (email);


--
-- Name: Users Users_email_key233; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key233" UNIQUE (email);


--
-- Name: Users Users_email_key234; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key234" UNIQUE (email);


--
-- Name: Users Users_email_key235; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key235" UNIQUE (email);


--
-- Name: Users Users_email_key236; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key236" UNIQUE (email);


--
-- Name: Users Users_email_key237; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key237" UNIQUE (email);


--
-- Name: Users Users_email_key238; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key238" UNIQUE (email);


--
-- Name: Users Users_email_key239; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key239" UNIQUE (email);


--
-- Name: Users Users_email_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key24" UNIQUE (email);


--
-- Name: Users Users_email_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key25" UNIQUE (email);


--
-- Name: Users Users_email_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key26" UNIQUE (email);


--
-- Name: Users Users_email_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key27" UNIQUE (email);


--
-- Name: Users Users_email_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key28" UNIQUE (email);


--
-- Name: Users Users_email_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key29" UNIQUE (email);


--
-- Name: Users Users_email_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key3" UNIQUE (email);


--
-- Name: Users Users_email_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key30" UNIQUE (email);


--
-- Name: Users Users_email_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key31" UNIQUE (email);


--
-- Name: Users Users_email_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key32" UNIQUE (email);


--
-- Name: Users Users_email_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key33" UNIQUE (email);


--
-- Name: Users Users_email_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key34" UNIQUE (email);


--
-- Name: Users Users_email_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key35" UNIQUE (email);


--
-- Name: Users Users_email_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key36" UNIQUE (email);


--
-- Name: Users Users_email_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key37" UNIQUE (email);


--
-- Name: Users Users_email_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key38" UNIQUE (email);


--
-- Name: Users Users_email_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key39" UNIQUE (email);


--
-- Name: Users Users_email_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key4" UNIQUE (email);


--
-- Name: Users Users_email_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key40" UNIQUE (email);


--
-- Name: Users Users_email_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key41" UNIQUE (email);


--
-- Name: Users Users_email_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key42" UNIQUE (email);


--
-- Name: Users Users_email_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key43" UNIQUE (email);


--
-- Name: Users Users_email_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key44" UNIQUE (email);


--
-- Name: Users Users_email_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key45" UNIQUE (email);


--
-- Name: Users Users_email_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key46" UNIQUE (email);


--
-- Name: Users Users_email_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key47" UNIQUE (email);


--
-- Name: Users Users_email_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key48" UNIQUE (email);


--
-- Name: Users Users_email_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key49" UNIQUE (email);


--
-- Name: Users Users_email_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key5" UNIQUE (email);


--
-- Name: Users Users_email_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key50" UNIQUE (email);


--
-- Name: Users Users_email_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key51" UNIQUE (email);


--
-- Name: Users Users_email_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key52" UNIQUE (email);


--
-- Name: Users Users_email_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key53" UNIQUE (email);


--
-- Name: Users Users_email_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key54" UNIQUE (email);


--
-- Name: Users Users_email_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key55" UNIQUE (email);


--
-- Name: Users Users_email_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key56" UNIQUE (email);


--
-- Name: Users Users_email_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key57" UNIQUE (email);


--
-- Name: Users Users_email_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key58" UNIQUE (email);


--
-- Name: Users Users_email_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key59" UNIQUE (email);


--
-- Name: Users Users_email_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key6" UNIQUE (email);


--
-- Name: Users Users_email_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key60" UNIQUE (email);


--
-- Name: Users Users_email_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key61" UNIQUE (email);


--
-- Name: Users Users_email_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key62" UNIQUE (email);


--
-- Name: Users Users_email_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key63" UNIQUE (email);


--
-- Name: Users Users_email_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key64" UNIQUE (email);


--
-- Name: Users Users_email_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key65" UNIQUE (email);


--
-- Name: Users Users_email_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key66" UNIQUE (email);


--
-- Name: Users Users_email_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key67" UNIQUE (email);


--
-- Name: Users Users_email_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key68" UNIQUE (email);


--
-- Name: Users Users_email_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key69" UNIQUE (email);


--
-- Name: Users Users_email_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key7" UNIQUE (email);


--
-- Name: Users Users_email_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key70" UNIQUE (email);


--
-- Name: Users Users_email_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key71" UNIQUE (email);


--
-- Name: Users Users_email_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key72" UNIQUE (email);


--
-- Name: Users Users_email_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key73" UNIQUE (email);


--
-- Name: Users Users_email_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key74" UNIQUE (email);


--
-- Name: Users Users_email_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key75" UNIQUE (email);


--
-- Name: Users Users_email_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key76" UNIQUE (email);


--
-- Name: Users Users_email_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key77" UNIQUE (email);


--
-- Name: Users Users_email_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key78" UNIQUE (email);


--
-- Name: Users Users_email_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key79" UNIQUE (email);


--
-- Name: Users Users_email_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key8" UNIQUE (email);


--
-- Name: Users Users_email_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key80" UNIQUE (email);


--
-- Name: Users Users_email_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key81" UNIQUE (email);


--
-- Name: Users Users_email_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key82" UNIQUE (email);


--
-- Name: Users Users_email_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key83" UNIQUE (email);


--
-- Name: Users Users_email_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key84" UNIQUE (email);


--
-- Name: Users Users_email_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key85" UNIQUE (email);


--
-- Name: Users Users_email_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key86" UNIQUE (email);


--
-- Name: Users Users_email_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key87" UNIQUE (email);


--
-- Name: Users Users_email_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key88" UNIQUE (email);


--
-- Name: Users Users_email_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key89" UNIQUE (email);


--
-- Name: Users Users_email_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key9" UNIQUE (email);


--
-- Name: Users Users_email_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key90" UNIQUE (email);


--
-- Name: Users Users_email_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key91" UNIQUE (email);


--
-- Name: Users Users_email_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key92" UNIQUE (email);


--
-- Name: Users Users_email_key93; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key93" UNIQUE (email);


--
-- Name: Users Users_email_key94; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key94" UNIQUE (email);


--
-- Name: Users Users_email_key95; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key95" UNIQUE (email);


--
-- Name: Users Users_email_key96; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key96" UNIQUE (email);


--
-- Name: Users Users_email_key97; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key97" UNIQUE (email);


--
-- Name: Users Users_email_key98; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key98" UNIQUE (email);


--
-- Name: Users Users_email_key99; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key99" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: attendances_class_id_subject_id_date; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX attendances_class_id_subject_id_date ON public."Attendances" USING btree ("classId", "subjectId", date);


--
-- Name: AlumniProfiles AlumniProfiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AlumniProfiles"
    ADD CONSTRAINT "AlumniProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Announcements Announcements_collegeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcements"
    ADD CONSTRAINT "Announcements_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES public."Colleges"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Announcements Announcements_postedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Announcements"
    ADD CONSTRAINT "Announcements_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssignmentSubmissions AssignmentSubmissions_assignmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssignmentSubmissions"
    ADD CONSTRAINT "AssignmentSubmissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES public."Assignments"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssignmentSubmissions AssignmentSubmissions_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssignmentSubmissions"
    ADD CONSTRAINT "AssignmentSubmissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Assignments Assignments_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assignments"
    ADD CONSTRAINT "Assignments_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Assignments Assignments_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assignments"
    ADD CONSTRAINT "Assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AttendanceRecords AttendanceRecords_attendanceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRecords"
    ADD CONSTRAINT "AttendanceRecords_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES public."Attendances"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AttendanceRecords AttendanceRecords_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AttendanceRecords"
    ADD CONSTRAINT "AttendanceRecords_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Attendances Attendances_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendances"
    ADD CONSTRAINT "Attendances_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Classes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Attendances Attendances_markedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendances"
    ADD CONSTRAINT "Attendances_markedById_fkey" FOREIGN KEY ("markedById") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Attendances Attendances_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendances"
    ADD CONSTRAINT "Attendances_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BookCheckouts BookCheckouts_bookId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BookCheckouts"
    ADD CONSTRAINT "BookCheckouts_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES public."LibraryBooks"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BookCheckouts BookCheckouts_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BookCheckouts"
    ADD CONSTRAINT "BookCheckouts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BookReviews BookReviews_bookId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BookReviews"
    ADD CONSTRAINT "BookReviews_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES public."LibraryBooks"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BookReviews BookReviews_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BookReviews"
    ADD CONSTRAINT "BookReviews_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Classes Classes_collegeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classes"
    ADD CONSTRAINT "Classes_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES public."Colleges"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ForumPosts ForumPosts_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ForumPosts"
    ADD CONSTRAINT "ForumPosts_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ForumPosts ForumPosts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ForumPosts"
    ADD CONSTRAINT "ForumPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ForumReplies ForumReplies_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ForumReplies"
    ADD CONSTRAINT "ForumReplies_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."ForumPosts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ForumReplies ForumReplies_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ForumReplies"
    ADD CONSTRAINT "ForumReplies_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InterviewExperiences InterviewExperiences_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InterviewExperiences"
    ADD CONSTRAINT "InterviewExperiences_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JobApplications JobApplications_jobPostId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JobApplications"
    ADD CONSTRAINT "JobApplications_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES public."JobPosts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JobApplications JobApplications_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JobApplications"
    ADD CONSTRAINT "JobApplications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JobPosts JobPosts_postedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JobPosts"
    ADD CONSTRAINT "JobPosts_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LeaveRequests LeaveRequests_approvedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeaveRequests"
    ADD CONSTRAINT "LeaveRequests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LeaveRequests LeaveRequests_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LeaveRequests"
    ADD CONSTRAINT "LeaveRequests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Marks Marks_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marks"
    ADD CONSTRAINT "Marks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Marks Marks_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marks"
    ADD CONSTRAINT "Marks_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MaterialPurchases MaterialPurchases_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MaterialPurchases"
    ADD CONSTRAINT "MaterialPurchases_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."Materials"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MaterialPurchases MaterialPurchases_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MaterialPurchases"
    ADD CONSTRAINT "MaterialPurchases_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Materials Materials_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Materials"
    ADD CONSTRAINT "Materials_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Materials Materials_uploaderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Materials"
    ADD CONSTRAINT "Materials_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MentorProfiles MentorProfiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MentorProfiles"
    ADD CONSTRAINT "MentorProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MentorshipSlots MentorshipSlots_menteeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MentorshipSlots"
    ADD CONSTRAINT "MentorshipSlots_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MentorshipSlots MentorshipSlots_mentorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MentorshipSlots"
    ADD CONSTRAINT "MentorshipSlots_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Messages Messages_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Messages Messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Messages Messages_studyGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_studyGroupId_fkey" FOREIGN KEY ("studyGroupId") REFERENCES public."StudyGroups"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Messages Messages_studyRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_studyRequestId_fkey" FOREIGN KEY ("studyRequestId") REFERENCES public."StudyRequests"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notifications Notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Opportunities Opportunities_postedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Opportunities"
    ADD CONSTRAINT "Opportunities_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlacementApplications PlacementApplications_companyListingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlacementApplications"
    ADD CONSTRAINT "PlacementApplications_companyListingId_fkey" FOREIGN KEY ("companyListingId") REFERENCES public."CompanyListings"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlacementApplications PlacementApplications_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlacementApplications"
    ADD CONSTRAINT "PlacementApplications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PrepHistories PrepHistories_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PrepHistories"
    ADD CONSTRAINT "PrepHistories_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectInvites ProjectInvites_inviteeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProjectInvites"
    ADD CONSTRAINT "ProjectInvites_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectInvites ProjectInvites_projectPostingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProjectInvites"
    ADD CONSTRAINT "ProjectInvites_projectPostingId_fkey" FOREIGN KEY ("projectPostingId") REFERENCES public."ProjectPostings"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectPostings ProjectPostings_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProjectPostings"
    ADD CONSTRAINT "ProjectPostings_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizAttempts QuizAttempts_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuizAttempts"
    ADD CONSTRAINT "QuizAttempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quizzes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizAttempts QuizAttempts_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuizAttempts"
    ADD CONSTRAINT "QuizAttempts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizQuestions QuizQuestions_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuizQuestions"
    ADD CONSTRAINT "QuizQuestions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quizzes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quizzes Quizzes_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quizzes"
    ADD CONSTRAINT "Quizzes_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quizzes Quizzes_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quizzes"
    ADD CONSTRAINT "Quizzes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecoveryAssignments RecoveryAssignments_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecoveryAssignments"
    ADD CONSTRAINT "RecoveryAssignments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RecoveryAssignments RecoveryAssignments_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RecoveryAssignments"
    ADD CONSTRAINT "RecoveryAssignments_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SelfAttendances SelfAttendances_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SelfAttendances"
    ADD CONSTRAINT "SelfAttendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyGroupParticipants StudyGroupParticipants_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyGroupParticipants"
    ADD CONSTRAINT "StudyGroupParticipants_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyGroupParticipants StudyGroupParticipants_studyGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyGroupParticipants"
    ADD CONSTRAINT "StudyGroupParticipants_studyGroupId_fkey" FOREIGN KEY ("studyGroupId") REFERENCES public."StudyGroups"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyGroups StudyGroups_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyGroups"
    ADD CONSTRAINT "StudyGroups_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyGroups StudyGroups_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyGroups"
    ADD CONSTRAINT "StudyGroups_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyGuides StudyGuides_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyGuides"
    ADD CONSTRAINT "StudyGuides_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyRequests StudyRequests_requesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyRequests"
    ADD CONSTRAINT "StudyRequests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyRequests StudyRequests_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyRequests"
    ADD CONSTRAINT "StudyRequests_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyRequests StudyRequests_tutorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StudyRequests"
    ADD CONSTRAINT "StudyRequests_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Subjects Subjects_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Classes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Subjects Subjects_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subjects"
    ADD CONSTRAINT "Subjects_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Tasks Tasks_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tasks"
    ADD CONSTRAINT "Tasks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeamRequests TeamRequests_opportunityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TeamRequests"
    ADD CONSTRAINT "TeamRequests_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES public."Opportunities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeamRequests TeamRequests_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TeamRequests"
    ADD CONSTRAINT "TeamRequests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Timetables Timetables_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Timetables"
    ADD CONSTRAINT "Timetables_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Classes"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Timetables Timetables_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Timetables"
    ADD CONSTRAINT "Timetables_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subjects"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Timetables Timetables_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Timetables"
    ADD CONSTRAINT "Timetables_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Transactions Transactions_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Users Users_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Classes"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Users Users_collegeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES public."Colleges"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict UHrHeOl20jCSdVpHbxeyxwmZYcxXdZCvMTYyT5SGTyADBtG2uFYrzQs1MjjUwfF

