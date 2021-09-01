import async from "components/common/Async";

// Auth components
const SignIn = async(() => import("pages/auth/SignIn"));
const Page404 = async(() => import("pages/auth/Page404"));
const Page500 = async(() => import("pages/auth/Page500"));

// Main components
const Scheme = async(() => import("pages/scheme"));
const Projects = async(() => import("pages/projects"));

const authRoutes = {
  id: "Auth",
  path: "/auth",
  //   icon: <Users />,
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn,
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404,
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500,
    },
  ],
  component: null,
};

const projectRoute = {
  id: "Project",
  path: "/",
  name: "Project",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const myProjectRoute = {
  id: "My Project",
  path: "/mine",
  name: "My Project",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const sharedProjectRoute = {
  id: "Shared Project",
  path: "/shared",
  name: "Shared Project",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const favoriteProjectRoute = {
  id: "Favorite Project",
  path: "/favorite",
  name: "Favorite Project",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const schemeRoute = {
  id: "Scheme",
  path: "/scheme/:id",
  name: "scheme",
  component: Scheme,
  guarded: true,
  redirectToSignIn: true,
};

// Routes using the Dashboard layout
export const mainLayoutRoutes = [
  projectRoute,
  myProjectRoute,
  sharedProjectRoute,
  favoriteProjectRoute,
  schemeRoute,
];

// Routes using the Auth layout
export const authLayoutRoutes = [authRoutes];
