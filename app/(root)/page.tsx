import React from "react";
import HeaderBox from "../../components/HeaderBox";
import TotalBalanceBox from "../../components/TotalBalanceBox";
import RightSidebar from "../../components/RightSidebar";

const Home = () => {
  const loggedin = {
    firstName: "Mohammed",
    lastName: "Abd",
    email: "admin@localhost",
  };
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greetings"
            title="Welcome"
            user={loggedin.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />
        </header>
        <TotalBalanceBox
          accounts={[]}
          totalBanks={1}
          totalCurrentBalance={1234.23}
        />
      </div>

      <RightSidebar user={loggedin} transaction={[]} banks={[{}, {}]} />
    </section>
  );
};

export default Home;
