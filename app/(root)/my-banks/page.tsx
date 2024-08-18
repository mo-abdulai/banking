import HeaderBox from "@/components/HeaderBox";
import React from "react";
import { getLoggedInUser } from "@/lib/actions/user.action";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { formatAmount } from "@/lib/utils";
import BankCard from "@/components/BankCard";

const myBanks = async () => {
  const loggedIn = await getLoggedInUser();
  // const currentPage = Number(page as string) || 1;

  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return;

  const accountsData = accounts.data;
  // const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  // const account = await getAccount({ appwriteItemId });
  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly Manage Your Banking Activities"
        />
        <div className="space-y-4">
          <h1 className="header-2">Your cards</h1>
          <div className="flex flex-wrap gap-6">
            {accounts && accountsData.map((account: Account) => (
              <BankCard
                key={account.id}
                account={account}
                userName={`${loggedIn?.firstName} ${loggedIn?.lastName}`}
                showBalance={true}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default myBanks;
