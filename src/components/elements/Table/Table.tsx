"use client";

import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { useMemo } from "react";
import { useTheme } from "next-themes";

interface ITableProps {
  columns: any[];
  data: any[];
  isLoading: boolean;
}

const Table = ({ columns, data, isLoading }: ITableProps) => {
  const { theme } = useTheme();

  return (
    <div className="w-full">
      <MaterialReactTable
        data={data}
        columns={columns}
        localization={MRT_Localization_ES}
        state={{ isLoading }}
        muiTableProps={{
          sx: {
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          },
        }}
        muiTablePaperProps={{
          sx: {
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          },
        }}
      />
    </div>
  );
};

export default Table;
