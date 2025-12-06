import React from "react";
import data from "../data.json";
import { AllUserTable } from "../components/data-table";
export default function page() {
  return (
    <div>
      <AllUserTable data={data} />
    </div>
  );
}
