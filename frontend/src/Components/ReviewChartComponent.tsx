import instance from "../Utils/Axios";
import React, { useEffect, useState } from "react";

import { BarChart, Bar, Cell, XAxis, YAxis, LabelList } from "recharts";

const data = [
  {
    name: "5 \uD83E\uDD54 ",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "4 \uD83E\uDD54",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "3 \uD83E\uDD54",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "2 \uD83E\uDD54",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "1 \uD83E\uDD54",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
];
interface reviewsummary {
  name: string;
  rating: number;
}
interface product_id {
  id: number;
}

const ReviewChartComponent: React.VFC<product_id> = ({ id }) => {
  const [summary, setSummary] = useState<reviewsummary[]>([]);

  useEffect(() => {
    instance
      .get("/get_review_summary", {
        params: {
          product_id: id,
        },
      })
      .then((res) => {
        const data = Object.assign({}, res.data);
        console.log(res);
        if ("review" in data) {
          setSummary(data["review"]);
        }
      });
  }, []);


  return (
    <BarChart
      width={350}
      height={180}
      data={summary}
      layout="vertical"
      margin={{ top: 25, right: 20, left: 10, bottom: 10 }}
    >
      <XAxis type="number" hide={true} />
      <YAxis type="category" dataKey="name" />

      <Bar dataKey="rating" fill="#black">
      <LabelList
        dataKey="rating"
        position="right"
        style={{ fill: "black" }}
      />
      </Bar>
    </BarChart>
  );
};
export default ReviewChartComponent;
