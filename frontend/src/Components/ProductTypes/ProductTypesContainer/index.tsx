import React, { useState } from "react";

import styles from "./index.module.scss";
import Button from "plaid-threads/Button";
import Insights from "../../Insights";

interface Props {
  children?: React.ReactNode | Array<React.ReactNode>;
  productType: string;
  transactions: any;
}

const TypeContainer: React.FC<Props> = (props) => {
  const [showInsights, setShowInsights] = useState(false);
  return (
    <>
      {showInsights && <Insights transactionsData={props.transactions} />}
      {!showInsights && (
        <div className={styles.container}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h4 className={styles.header}>{props.productType}</h4>
            <div
              style={{
                margin: "4rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <Button type="button" large onClick={() => setShowInsights(true)}>
                Insights
              </Button>
              <Button
                type="button"
                large
                onClick={() => {
                  window.open(
                    "http://localhost:3000/retrieval_agents",
                    "_blank"
                  );
                }}
              >
                Chat with Finance AI
              </Button>
            </div>
          </div>
          {props.children}
        </div>
      )}
    </>
  );
};

TypeContainer.displayName = "TypeContainer";

export default TypeContainer;
