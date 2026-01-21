import UserRouter from "../module/user/user.router";
import CourseRouter from "../module/course/course.router";
import CourseModuleRouter from "../module/courseMilestone/courseMilestone.router";
import LessionRouter from "../module/courseLesson/courseLesson.router";
import userCourseProgressRouter from "../module/userCourseProgress/UserCourseProgress.router";
import enrollRouter from "../module/CourseEnroll/enroll.router";
import analyticsRouter from "../module/analytics/analytics.route";
import badgesRouter from "../module/BadgesAchievements/badges.router";
import supportRouter from "../module/Support/support.router";
import RecentActivityRouter from "../module/RecentActivity/recent.avtivity.router";



export const moduleRoute = [
    {
        path: "/user",
        routes: UserRouter
    },
    {
        path: "/course",
        routes: CourseRouter
    },

    {
        path: "/module",
        routes: CourseModuleRouter
    },
    {
        path: "/lession",
        routes: LessionRouter
    },
    {
        path: "/progress",
        routes: userCourseProgressRouter
    },
    {
        path: "/enrolCourse",
        routes: enrollRouter
    },
    {
        path: "/analytics",
        routes: analyticsRouter
    },
    {
        path: "/badges",
        routes: badgesRouter
    },
    {
        path: "/support",
        routes: supportRouter
    },
    {
        path: "/recent",
        routes: RecentActivityRouter
    },
];

