// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { parse } from "csv-parse";

interface fileItem {
  date: string;
  fileName: string;
}
type Data = {
  data: fileItem[];
};

const sorter = (items: fileItem[], req: NextApiRequest) => {
  const { sortByFileName, sortByCreatedAt } = req?.query;
  if (sortByCreatedAt) {
    return items.sort((current: any, next: any) => {
      return current.date.localeCompare(next.date);
    });
  } else {
    return items.sort((current: fileItem, next: fileItem) => {
      if (sortByFileName === "asc") {
        return current.fileName.localeCompare(next.fileName, undefined, {
          numeric: true,
        });
      } else if (sortByFileName === "desc") {
        return next.fileName.localeCompare(current.fileName, undefined, {
          numeric: true,
        });
      }
      return 0;
    });
  }
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const csvData = [] as any;
  const query = req.query;
  const { sortByFileName, sortByCreatedAt } = query;

  return new Promise<void>((resolve) => {
    fs.createReadStream("public/data.csv")
      .pipe(parse({ delimiter: ";" }))
      .on("data", function (csvRow) {
        csvData.push(csvRow);
      })
      .on("end", function () {
        const parsedData = sorter(
          csvData.map((item: string[]) => ({ date: item[0], fileName: item[1] })),
          req
        );
        res.status(200).json({ data: parsedData });
        resolve();
      });
  }).catch(() => {
    res.status(500);
  });
}
