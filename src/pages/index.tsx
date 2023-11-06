import { useState, useEffect } from "react";

interface ICard {
  date: string;
  fileName: string;
}

export default function Home() {
  const [data, setData] = useState<ICard[]>([]);
  const getData = async (sortBy = "sortByCreatedAt=true") => {
    try {
      const response = await fetch(`/api/data?${sortBy}`);
      const { data } = await response.json();
      setData(data);
    } catch (err) {}
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <select
        onChange={(e) => {
          getData(e?.target?.value);
        }}
        name="sort by created at"
        className="bg-gray-950 border-white text-white border-2 rounded-lg p-4 shadow-md"
      >
        <option value="sortByCreatedAt=true">Sort by created At</option>
        <option value="sortByFileName=asc">Sort by FileName asc</option>
        <option value="sortByFileName=desc">Sort by FileName desc</option>
      </select>
      <div className="flex text-white w-9/12 flex-wrap">
        {data.map(({ date, fileName }: ICard) => (
          <div className="w-1/2 p-4" key={fileName}>
            <div className="bg-gray-950 border-white border-2	 rounded-lg p-4 shadow-md">
              <p>{date}</p>
              <p>{fileName}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
