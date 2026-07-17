import { createBrowserRouter } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { SplashPage } from "./pages/common/SplashPage";
import { Placeholder } from "./pages/common/Placeholder";
import { HomePage } from "./pages/home/HomePage";
import { HomeTabletPage } from "./pages/home/HomeTabletPage";
import { ReciteHome } from "./pages/enlighten/ReciteHome";
import { FollowRecite } from "./pages/enlighten/FollowRecite";
import { CoverRecite } from "./pages/enlighten/CoverRecite";
import { ReciteGame } from "./pages/enlighten/ReciteGame";
import { VisualTeach } from "./pages/enlighten/VisualTeach";
import { EntryPractice } from "./pages/enlighten/EntryPractice";
import { DifficultySelect } from "./pages/advanced/DifficultySelect";
import { TimedChallenge } from "./pages/advanced/TimedChallenge";
import { FreePractice } from "./pages/advanced/FreePractice";
import { AppDifficulty } from "./pages/advanced/AppDifficulty";
import { AppQuiz } from "./pages/advanced/AppQuiz";
import { ResultPage } from "./pages/wrong/ResultPage";
import { WrongBook } from "./pages/wrong/WrongBook";
import { WrongReview } from "./pages/wrong/WrongReview";
import { WrongExplain } from "./pages/wrong/WrongExplain";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { ReportPage } from "./pages/profile/ReportPage";
import { CustomQuiz } from "./pages/profile/CustomQuiz";
import { DailyCheckin } from "./pages/profile/DailyCheckin";
import { EyeCare } from "./pages/profile/EyeCare";
import { AccountSwitch } from "./pages/profile/AccountSwitch";
import { DataExport } from "./pages/profile/DataExport";
import { TimeControl } from "./pages/profile/TimeControl";
import { ReciteTablet } from "./pages/profile/ReciteTablet";
import { QuizTablet } from "./pages/profile/QuizTablet";

// 带 BottomNav 的布局包装
function withNav(node: JSX.Element) {
  return (
    <>
      <div className="app-content">{node}</div>
      <BottomNav />
    </>
  );
}

export const router = createBrowserRouter([
  { path: "/splash", element: <SplashPage /> },
  { path: "/", element: withNav(<HomePage />) },
  { path: "/home", element: withNav(<HomePage />) },
  { path: "/home-tablet", element: withNav(<HomeTabletPage />) },

  { path: "/recite", element: withNav(<ReciteHome />) },
  { path: "/recite/follow", element: withNav(<FollowRecite />) },
  { path: "/recite/cover", element: withNav(<CoverRecite />) },
  { path: "/recite/game", element: withNav(<ReciteGame />) },
  { path: "/enlighten/visual", element: withNav(<VisualTeach />) },
  { path: "/enlighten/practice", element: withNav(<EntryPractice />) },

  { path: "/advanced/difficulty", element: withNav(<DifficultySelect />) },
  { path: "/advanced/timed", element: withNav(<TimedChallenge />) },
  { path: "/advanced/free", element: withNav(<FreePractice />) },
  { path: "/advanced/app-difficulty", element: withNav(<AppDifficulty />) },
  { path: "/advanced/app-quiz", element: withNav(<AppQuiz />) },

  { path: "/result", element: withNav(<ResultPage />) },
  { path: "/wrong/book", element: withNav(<WrongBook />) },
  { path: "/wrong/review", element: withNav(<WrongReview />) },
  { path: "/wrong/explain", element: withNav(<WrongExplain />) },

  { path: "/profile", element: withNav(<ProfilePage />) },
  { path: "/report", element: withNav(<ReportPage />) },
  { path: "/custom-quiz", element: withNav(<CustomQuiz />) },
  { path: "/checkin", element: withNav(<DailyCheckin />) },
  { path: "/eye-care", element: withNav(<EyeCare />) },
  { path: "/account", element: withNav(<AccountSwitch />) },
  { path: "/export", element: withNav(<DataExport />) },
  { path: "/time-control", element: withNav(<TimeControl />) },

  { path: "/recite-tablet", element: withNav(<ReciteTablet />) },
  { path: "/quiz-tablet", element: withNav(<QuizTablet />) },

  // 兜底
  { path: "*", element: withNav(<Placeholder title="页面建设中" />) },
]);
